from rest_framework.generics import *
from .models import *
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.views import APIView
from rest_framework import status
from .utils import *
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import AccessToken
from django.db import connection
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.contrib.auth.hashers import make_password
from django.http import HttpResponse
from .filterapplicants import filterapplicant
import os
from datetime import datetime
from django.conf import settings
import requests
from django.core.mail import send_mail
from abc import ABC, abstractmethod

# Created a superclass with a method to execute queries by taking in the query and parameters 
class QueryandemailClass(APIView):
    def __init__(self):
        self.__connection = connection
        self.__emailfrom = settings.DEFAULT_FROM_EMAIL
        self.__fullname = ''
        self.__subject = 'Update on your application'
        self.__message = '''
        Dear {fullname},
        
        There has been an update on the status of your application. Please log in to your account to view the changes.
        
        TRL Administration'''

    # Private method to execute an SQL query to help prevent against direct access to the execute query method
    def __executequery(self, query, params):
        try:
            with self.__connection.cursor() as cursor:
                cursor.execute(query, params)
                return cursor.fetchall(), cursor.description
        except Exception as caughterror:
            print(f"error: {caughterror}")
            return None, None

    def _query(self, query, params):
        return self.__executequery(query, params)
    
    # Private method to send an email to the applicant when there has been a change in the recruitmenttracker value
    def __notifyapplicant(self, email, message=None):
        
        name, _ = self._query('SELECT fullname FROM TRL_applicantdetails WHERE email = %s', [email])
        if name:
            self.__fullname = name[0][0]
        
        messagetosend = message or self.__message.format(fullname=self.__fullname)
        emailto = [email]

        try:
            send_mail(self.__subject, messagetosend, self.__emailfrom, emailto)
        except Exception as caughterror:
            return Response({'error': str(caughterror)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _notifyapplicant(self, email, custom_message=None):
        return self.__notifyapplicant(email, custom_message)
    
    @abstractmethod
    def get(self, request):
        pass
    
    @abstractmethod
    def post(self, request):
        pass

    
#class for getting and posting a job, inherits from QueryandemailClass
class JobView(QueryandemailClass):
    permission_classes = [AllowAny]
       
#post method to insert a new job in the database
    def post(self, request):
        data = request.data
        cursor = self._query('''
            INSERT INTO TRL_jobdetails (jobtitle, companyname, salary, jobdescription, dateposted, location, jobtype, deadline, jobprimaryskill, jobsecondaryskill)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', [
            data.get('jobtitle'), #values parsed into the query from the JSON request payload
            data.get('companyname'),
            data.get('salary'),
            data.get('jobdescription'),
            data.get('dateposted'),
            data.get('location'),
            data.get('jobtype'),
            data.get('deadline'),
            data.get('jobprimaryskill'),
            data.get('jobsecondaryskill'),
        ]) #Example of parameterised SQL
        if cursor:
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#get method to return the result of either get_job_list or get_job_detail, depending on whether a primary key is parsed into the request
    def get(self, request, pk=None):
        if pk:
            return self.get_job_detail(pk)
        else:
            return self.get_job_list()
#get method to list all jobs in the database
    def get_job_list(self):
        rows, description = self._query('SELECT * FROM TRL_jobdetails', [])
        if rows is not None:
            columns = [col[0] for col in description]
            results = [dict(zip(columns, row)) for row in rows]
            return Response(results)
        return Response(status=status.HTTP_404_NOT_FOUND)

#get method to return a specific job in the database
    def get_job_detail(self, pk):
        rows, description = self._query('SELECT * FROM TRL_jobdetails WHERE id = %s', [pk])
        if rows:
            columns = [col[0] for col in description]
            return Response(dict(zip(columns, rows[0])))
        return Response(status=status.HTTP_404_NOT_FOUND)

class RecommendedJobDetails(QueryandemailClass):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            rows, description = self._query('''
                SELECT TRL_jobdetails.*
                FROM TRL_jobdetails
                JOIN TRL_jobrecommendation ON TRL_jobdetails.id = TRL_jobrecommendation.job_id
                WHERE TRL_jobrecommendation.applicant_id = %s
            ''', [id])
            if rows:
                columns = [col[0] for col in description]
                job_details = dict(zip(columns, rows[0]))
                return Response(job_details, status=status.HTTP_200_OK)
            return Response({'error': 'Job details not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as caughterror:
            return Response({'error': str(caughterror)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

#class inheriting the QueryandemailClass method, this class houses the get post and delete methods for the ApplicantDetails table
class Applicantdetails(QueryandemailClass):
    #requires a user to be logged in and authenticated
    permission_classes = [IsAuthenticated]

#get method to return the applicant details of the user
    def get(self, request):
        user = request.user
        try:
            rows, description = self._query('''
                SELECT TRL_applicantdetails.*, 
                GROUP_CONCAT(TRL_skill.name) as skills
                FROM TRL_applicantdetails
                LEFT JOIN TRL_applicantskill ON TRL_applicantdetails.email = TRL_applicantskill.applicant_email
                LEFT JOIN TRL_skill ON TRL_applicantskill.skill_id = TRL_skill.id
                WHERE TRL_applicantdetails.email = %s
                GROUP BY TRL_applicantdetails.id
                ''', [user.email])
            if rows is not None:
                columns = [col[0] for col in description]
                results = [dict(zip(columns, row)) for row in rows]
                return Response(results)
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as caughterror:
            return Response({'error': str(caughterror)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
#post method to insert details of an applicant
    def post(self, request):
        data = request.data
        cv_file = data.get('cv')
        if cv_file:
            file_name = default_storage.save(f'cvs/{cv_file.name}', ContentFile(cv_file.read()))
            cv_file_path = default_storage.path(file_name)
        else:
            cv_file_path = None

#try except statement to insert the inputted data into the table, but in case some of the data is not present or in case there is the same email in the table, it will update the other values in the database
        try:
            self._query('''
            INSERT INTO TRL_applicantdetails (fullname, email, phonenumber, qualifications, preferences, cv, recruitmenttracker, timestamp)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (email) DO UPDATE SET
            fullname = EXCLUDED.fullname,
            phonenumber = EXCLUDED.phonenumber,
            qualifications = EXCLUDED.qualifications,
            preferences = EXCLUDED.preferences,
            cv = EXCLUDED.cv,
            recruitmenttracker = EXCLUDED.recruitmenttracker
            RETURNING id
            ''', [
            data.get('fullname'),
            data.get('email'),
            data.get('phonenumber'),
            data.get('qualifications'),
            data.get('preferences'),
            cv_file_path,
            data.get('recruitmenttracker'),
            data.get('timestamp'),
            ])
            #makes sure that there is no previous email that is the same as the one inputted
            self._query('DELETE FROM TRL_applicantskill WHERE applicant_email = %s', [data.get('email')])
            #creates a list of the skills inputted by the user
            skills = [data.get('skill_1'), data.get('skill_2'), data.get('skill_3'), data.get('skill_4'), data.get('skill_5')]
            for skill_name in skills:
                if skill_name:
                    skill_id = self.getskill(skill_name)
                    self._query('INSERT INTO TRL_applicantskill (applicant_email, skill_id) VALUES (%s, %s)', [data.get('email'), skill_id])
            return Response(status=status.HTTP_201_CREATED)
        except Exception as caughterror:
            return Response({'error': str(caughterror)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#get method to return the id of skills 
    def getskill(self, skill_name):
        skill_id = None
        rows, _ = self._query('SELECT id FROM TRL_skill WHERE name = %s', [skill_name])
        if rows:
            skill_id = rows[0][0]
        else:
            rows, _ = self._query('INSERT INTO TRL_skill (name) VALUES (%s) RETURNING id', [skill_name])
            skill_id = rows[0][0]
        return skill_id

#delete method to remove all details of an applicant from applicantskill and applicantdetails
    def delete(self, request, pk):
        try:
            rows, _ = self._query('SELECT email FROM TRL_applicantdetails WHERE id = %s', [pk])
            if not rows:
                return Response(status=status.HTTP_404_NOT_FOUND)
            applicant_email = rows[0][0]
            self._query('DELETE FROM TRL_jobrecommendation WHERE applicant_id = %s', [pk])
            self._query('DELETE FROM TRL_applicantskill WHERE applicant_email = %s', [applicant_email])
            self._query('DELETE FROM TRL_applicantdetails WHERE id = %s', [pk])
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as caughterror:
            return Response({'error': str(caughterror)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class FilteredApplicantDetails(QueryandemailClass):
    permission_classes = [IsAuthenticated]

    def get(self, request, email):
        try:
            rows, description = self._query('''
                SELECT TRL_applicantdetails.*, 
                GROUP_CONCAT(TRL_skill.name) as skills
                FROM TRL_applicantdetails 
                LEFT JOIN TRL_applicantskill ON TRL_applicantdetails.email = TRL_applicantskill.applicant_email
                LEFT JOIN TRL_skill ON TRL_applicantskill.skill_id = TRL_skill.id
                WHERE TRL_applicantdetails.email = %s
                GROUP BY TRL_applicantdetails.id
                ''', [email])
            if rows is not None:
                columns = [col[0] for col in description]
                results = [dict(zip(columns, row)) for row in rows]
                return Response(results)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as caughterror:
            return Response({'error': str(caughterror)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        
        
class Applicantstatistics(QueryandemailClass):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            #gets the total number of applicants that have applied, using aggregate function COUNT(*)
            totalnumofapplicants, _ = self._query('SELECT COUNT(*) FROM TRL_applicantdetails', [])

            #gets the average recruitment tracker value (rtvalue) of all applicants using an aggregate function AVG()
            averagertvalue, _ = self._query('SELECT AVG(recruitmenttracker) FROM TRL_applicantdetails', [])

            #gets how many applicants are in each recruitment tracker stage through the aggregate function COUNT(*)
            distributionofrtstages, _ = self._query('''
                SELECT recruitmenttracker, COUNT(*) 
                FROM TRL_applicantdetails 
                GROUP BY recruitmenttracker
            ''', [])

            data = {
                'totalnumofapplicants': totalnumofapplicants[0][0] if totalnumofapplicants else 0,
                'averagertvalue': averagertvalue[0][0] if averagertvalue else 0,
                'distributionofrtstages': {row[0]: row[1] for row in distributionofrtstages}
            }

            return Response(data, status=status.HTTP_200_OK)
        except Exception as caughterror:
            return Response({'error': str(caughterror)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        
#class to filter applicants based on their skills that match to a job (uses code in filterapplicants.py)
class RecommendApplicanttoJob(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, job_id):
        recommendations_both_skills, recommendations_one_skill = filterapplicant(job_id)
        return Response({
            'recommendations_both_skills': recommendations_both_skills,
            'recommendations_one_skill': recommendations_one_skill
        })
    
    def post(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

#class to return a list of all applicants and their details in the database
class ListApplicants(QueryandemailClass):
    #ensures the logged in user is an employee
    permission_classes=[IsAuthenticated]
    #get method to return all details of all applicants, also retrieves the skills of each applicant by concatenating them into a single string
    def get(self, request):
        try:
            rows, description = self._query('''
            SELECT TRL_applicantdetails.*,
            GROUP_CONCAT(TRL_skill.name) as skills FROM TRL_applicantdetails 
            LEFT JOIN TRL_applicantskill ON TRL_applicantdetails.email = TRL_applicantskill.applicant_email 
            LEFT JOIN TRL_skill ON TRL_applicantskill.skill_id = TRL_skill.id 
            GROUP BY TRL_applicantdetails.id, TRL_applicantdetails.fullname, TRL_applicantdetails.email, TRL_applicantdetails.phonenumber, TRL_applicantdetails.qualifications, TRL_applicantdetails.preferences, TRL_applicantdetails.cv, TRL_applicantdetails.recruitmenttracker
            ''', [])
            if rows is not None:
                columns = [col[0] for col in description]
                results = [dict(zip(columns, row)) for row in rows]
                return Response(results)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as caughterror:
            return Response({'error': str(caughterror)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

#class to download an applicant's cv stored on the server
class DownloadCV(QueryandemailClass):
    def get(self, request, id):
        try:
            rows, _ = self._query('SELECT cv FROM TRL_applicantdetails WHERE id = %s', [id])
            if rows:
                file_path = rows[0][0]
                if file_path and os.path.exists(file_path):
                    with open(file_path, 'rb') as cv:
                        response = HttpResponse(cv.read(), content_type="application/octet-stream")
                        response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path)
                        return response
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as caughterror:
            return Response({'error': str(caughterror)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        
#class to update the recruitment tracker value, imitates a dynamic tracker for the applicant
class UpdateRecruitmentTracker(QueryandemailClass):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        email = request.data.get('email')
        rtvalue = request.data.get('recruitmenttracker')
        jobid = request.data.get('job_id')

        try:
            self._query('UPDATE TRL_applicantdetails SET recruitmenttracker = %s WHERE email = %s', [rtvalue, email])

            if rtvalue == 3 and jobid:
                applicant_id, _ = self._query('SELECT id FROM TRL_applicantdetails WHERE email = %s', [email])
                if applicant_id:
                    self._query('INSERT INTO TRL_jobrecommendation (applicant_id, job_id, recommended_at) VALUES (%s, %s, CURRENT_TIMESTAMP)', [applicant_id[0][0], jobid])

                applicant_rows, applicant_description = self._query('SELECT * FROM TRL_applicantdetails WHERE email = %s', [email])
                job_rows, job_description = self._query('SELECT * FROM TRL_jobdetails WHERE id = %s', [jobid])

                if applicant_rows and job_rows:
                    applicant = dict(zip([col[0] for col in applicant_description], applicant_rows[0]))
                    job = dict(zip([col[0] for col in job_description], job_rows[0]))

                message = f'''
                Dear {applicant['fullname']},

                We have found a job that matches your skills:
                    
                Job Title: {job['jobtitle']}
                Company: {job['companyname']}
                Salary: £{job['salary']}
                Description: {job['jobdescription']}
                Location: {job['location']}
                Job Type: {job['jobtype']}
                Deadline: {job['deadline']}

                TRL Administration
                '''
                self._notifyapplicant(email, message)
            return Response(status=status.HTTP_200_OK)
        except Exception as caughterror:
            return Response({'error': str(caughterror)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

class ApplicantsToContact(QueryandemailClass):
    permission_classes = [IsAdminUser]

    def get(self, request):
        try:
            rows, description = self._query('''
            SELECT TRL_applicantdetails.fullname, TRL_applicantdetails.email
            FROM TRL_applicantdetails 
            WHERE TRL_applicantdetails.recruitmenttracker = 4
            ''', [])
            if rows is not None:
                columns = [col[0] for col in description]
                results = [dict(zip(columns, row)) for row in rows]
                return Response(results)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as caughterror:
            return Response({'error': str(caughterror)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

#class inheriting from QueryandemailClass which allows users to sign in with google
#To do this I have created a web application on google cloud console that allows google users to interface with my frontend and backend server, hence why i have a client secret json file to access this
#An Oauth2.0 ClientID is setup on google cloud console to allow this.
class GoogleSSO(QueryandemailClass):
    permission_classes = [AllowAny]
    def post(self, request):
        if 'code' in request.data.keys():
            code = request.data['code']
            id_token = get_google_token(code)
            email = id_token['email'] #email extracted from the JWT
            user = self.login(email)
            token = AccessToken.for_user(user)
            return Response({'access_token': str(token), 'username': email})
        return Response(status=status.HTTP_400_BAD_REQUEST)

#login method to check if the user is in the database, if not it will insert the user into the database
    def login(self, email):
        rows, description = self._query('SELECT * FROM auth_user WHERE email = %s', [email])
        if rows:
            user_id = rows[0][0]
        else:
            rows, description = self._query('''
                INSERT INTO auth_user (username, email, password, is_superuser, is_staff, is_active, date_joined, first_name, last_name)
                VALUES (%s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP, %s, %s)
                RETURNING id
            ''', [email, email, '', False, False, True, '', ''])
            user_id = rows[0][0]
        return User.objects.get(pk=user_id)

    def get(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
class ServerTime(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        server_time = datetime.now()
        return Response({'server_time': server_time.strftime('%Y-%m-%d %H:%M:%S')})

    def post(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


#register class to allow applicants to register with a username, password and email. By default, the is_staff attribute is set to false so they do not have employee access rights
#however any employee, admin or applicant can sign in using the same login system. Django's built in admin website can adjust the level of access rights for each user 
class Register(QueryandemailClass):
    # allows anyone to register
    permission_classes = [AllowAny]

    # post method to insert a new user into the database
    def post(self, request, format=None):
        data = request.data
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        hashed_password = make_password(password)  # hashed password using an SHA_256 digest

        # Check if the username already exists
        username_exists, _ = self._query('SELECT 1 FROM auth_user WHERE username = %s', [username])
        if username_exists:
            return Response({'error': 'Username already exists, please choose a different username.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the email already exists
        email_exists, _ = self._query('SELECT 1 FROM auth_user WHERE email = %s', [email])
        if email_exists:
            return Response({'error': 'Email already exists, please choose a different email.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cursor = self._query('''
                INSERT INTO auth_user (username, password, is_superuser, is_staff, is_active, date_joined, first_name, last_name, email)
                VALUES (%s, %s, %s, %s, %s, CURRENT_TIMESTAMP, %s, %s, %s)
            ''', [username, hashed_password, False, False, True, '', '', email])
            if cursor:
                return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            error_message = str(e)
            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


class RetrieveStaffStatus(QueryandemailClass):
    #get method to return the is_staff attribute of the logged in user
    def get(self, request):
        user = request.user
        rows, _ = self._query('SELECT username, email, is_staff FROM auth_user WHERE id = %s', [user.id])
        if rows:
            username, email, is_staff = rows[0]
            return Response({
                'username': username,
                'is_staff': is_staff,
                'email': email
            })
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        

class VerifyCaptcha(APIView):
    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

        url = 'https://www.google.com/recaptcha/api/siteverify'
        data = {
            'secret': settings.RECAPTCHA_SECRET_KEY,
            'response': token
        }
        response = requests.post(url, data=data)
        result = response.json()

        if result.get('success') == True:
            return Response({'message': 'CAPTCHA Verified!'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'CAPTCHA Invalid...'}, status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


    
