from rest_framework.generics import *
from .models import ApplicantDetails, JobDetails, ApplicantSkill, Skill
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
from django.core.exceptions import SuspiciousFileOperation
from django.conf import settings
#class to filter applicants based on their skills that match to a job (uses code in filterapplicants.py)
class RecommendApplicanttoJob(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, job_id):
        recommendations_both_skills, recommendations_one_skill = filterapplicant(job_id)
        return Response({
            'recommendations_both_skills': recommendations_both_skills,
            'recommendations_one_skill': recommendations_one_skill
        })

#Created a superclass with a method to execute queries by taking in the query and parameters 
class QueryClass(APIView):
    def __init__(self):
        self.__connection = connection

#Privated method to execute an SQL query to help prevent against direct access to the execute query method
    def __executequery(self, query, params):
        try:
            with self.__connection.cursor() as cursor:
                cursor.execute(query, params)
                return cursor.fetchall(), cursor.description
        except Exception as error:
            print(f"Database error: {error}")
            return None, None

    def query(self, query, params):
        return self.__executequery(query, params)

class ServerTime(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        server_time = datetime.now()
        return Response({'server_time': server_time.strftime('%Y-%m-%d %H:%M:%S')})
    
#class for getting and posting a job, inherits from QueryClass
class JobView(QueryClass):
    permission_classes = [AllowAny]

#post method to insert a new job in the database
    def post(self, request):
        data = request.data
        cursor = self.query('''
            INSERT INTO TRL_jobdetails (jobtitle, companyname, salary, jobdescription, dateposted, location, jobtype, deadline, jobprimaryskill, jobsecondaryskill)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', [
            data.get('jobtitle'),
            data.get('companyname'),
            data.get('salary'),
            data.get('jobdescription'),
            data.get('dateposted'),
            data.get('location'),
            data.get('jobtype'),
            data.get('deadline'),
            data.get('jobprimaryskill'),
            data.get('jobsecondaryskill'),
        ])
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
        rows, description = self.query('SELECT * FROM TRL_jobdetails', [])
        if rows is not None:
            columns = [col[0] for col in description]
            results = [dict(zip(columns, row)) for row in rows]
            return Response(results)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#get method to return a specific job in the database
    def get_job_detail(self, pk):
        rows, description = self.query('SELECT * FROM TRL_jobdetails WHERE id = %s', [pk])
        if rows:
            columns = [col[0] for col in description]
            return Response(dict(zip(columns, rows[0])))
        return Response(status=status.HTTP_404_NOT_FOUND)

#class inheriting the QueryClass method, this class houses the get post and delete methods for the ApplicantDetails table
class Applicantdetails(QueryClass):
    #requires a user to be logged in and authenticated
    permission_classes = [IsAuthenticated]

#get method to return the applicant details of the user
    def get(self, request):
        user = request.user
        try:
            query = '''
                SELECT TRL_applicantdetails.*, 
                GROUP_CONCAT(TRL_skill.name) as skills
                FROM TRL_applicantdetails TRL_applicantdetails
                LEFT JOIN TRL_applicantskill ON TRL_applicantdetails.email = TRL_applicantskill.applicant_email
                LEFT JOIN TRL_skill ON TRL_applicantskill.skill_id = TRL_skill.id
                WHERE TRL_applicantdetails.email = %s
                GROUP BY TRL_applicantdetails.id
                '''
            rows, description = self.query(query, [user.email])
            if rows is not None:
                columns = [col[0] for col in description]
                results = [dict(zip(columns, row)) for row in rows]
                return Response(results)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
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
            with connection.cursor() as cursor:
                cursor.execute('''
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
            self.query('DELETE FROM TRL_applicantskill WHERE applicant_email = %s', [data.get('email')])
            #creates a list of the skills inputted by the user
            skills = [data.get('skill_1'), data.get('skill_2'), data.get('skill_3'), data.get('skill_4'), data.get('skill_5')]
            for skill_name in skills:
                if skill_name:
                    skill_id = self.getskill(skill_name)
                    self.query('INSERT INTO TRL_applicantskill (applicant_email, skill_id) VALUES (%s, %s)', [data.get('email'), skill_id])

            return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#get method to return the id of skills 
    def getskill(self, skill_name):
        skill_id = None
        rows, _ = self.query('SELECT id FROM TRL_skill WHERE name = %s', [skill_name])
        if rows:
            skill_id = rows[0][0]
        else:
            rows, _ = self.query('INSERT INTO TRL_skill (name) VALUES (%s) RETURNING id', [skill_name])
            skill_id = rows[0][0]
        return skill_id

#delete method to remove all details of an applicant from applicantskill and applicantdetails
    def delete(self, request, pk):
        try:
            with connection.cursor() as cursor:
                cursor.execute('SELECT email FROM TRL_applicantdetails WHERE id = %s', [pk])
                row = cursor.fetchone()
                if not row:
                    return Response(status=status.HTTP_404_NOT_FOUND)
                applicant_email = row[0]
                cursor.execute('DELETE FROM TRL_applicantskill WHERE applicant_email = %s', [applicant_email])
                cursor.execute('DELETE FROM TRL_applicantdetails WHERE id = %s', [pk])
                if cursor.rowcount == 0:
                    return Response(status=status.HTTP_404_NOT_FOUND)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class FilteredApplicantDetails(QueryClass):
    permission_classes = [IsAuthenticated]

    def get(self, request, email):
        try:
            query = '''
                SELECT TRL_applicantdetails.*, 
                GROUP_CONCAT(TRL_skill.name) as skills
                FROM TRL_applicantdetails TRL_applicantdetails
                LEFT JOIN TRL_applicantskill ON TRL_applicantdetails.email = TRL_applicantskill.applicant_email
                LEFT JOIN TRL_skill ON TRL_applicantskill.skill_id = TRL_skill.id
                WHERE TRL_applicantdetails.email = %s
                GROUP BY TRL_applicantdetails.id
                '''
            rows, description = self.query(query, [email])
            if rows is not None:
                columns = [col[0] for col in description]
                results = [dict(zip(columns, row)) for row in rows]
                return Response(results)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
#class to return the list of applicant skills
class RetrieveApplicantSkills(QueryClass):
    #post method to take in the sought skills of the specific job and return the emails of applicants who have one of those skills in their details
    def post(self, request):
        skill = request.data.get('skill')
        if not skill:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            query = '''
                SELECT DISTINCT TRL_applicantdetails.email
                FROM TRL_applicantdetails TRL_applicantdetails
                JOIN TRL_applicantskill ON TRL_applicantdetails.email = TRL_applicantskill.applicant_email
                JOIN TRL_skill ON TRL_applicantskill.skill_id = TRL_skill.id
                WHERE TRL_skill.name = %s
            '''
            rows, description = self.query(query, [skill])
            if rows is not None:
                emails = [row[0] for row in rows]
                return Response({'emails': emails})
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#class to update the recruitment tracker value, imitates a dynamic tracker for the applicant
class UpdateRecruitmentTracker(QueryClass):
    permission_classes = [IsAuthenticated]
    #post method to update the recruitment tracker value
    def post(self, request):
        email = request.data.get('email')
        tracker_value = request.data.get('recruitmenttracker')
        job_id = request.data.get('job_id')

        try:
            applicant = ApplicantDetails.objects.get(email=email)
            applicant.recruitmenttracker = tracker_value

            if tracker_value == 3 and job_id:
                job = JobDetails.objects.get(id=job_id)
                job.save()

            if tracker_value == 4:
                job_title = request.data.get('job_title')
                applicant.accepted_job_title = job_title

            applicant.save()
            return Response(status=status.HTTP_200_OK)
        except ApplicantDetails.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except JobDetails.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


#class inheriting from QueryClass which allows users to sign in with google
#To do this i have created a web application on google cloud console that allows google users to interface with my frontend and backend server, hence why i have a client secret json file to access this
class GoogleSSO(QueryClass):
    permission_classes = [AllowAny]
    def post(self, request):
        if 'code' in request.data.keys():
            code = request.data['code']
            id_token = get_google_token(code)
            email = id_token['email']
            user = self.login(email)
            token = AccessToken.for_user(user)
            return Response({'access_token': str(token), 'username': email})
        return Response(status=status.HTTP_400_BTRL_applicantdetails_REQUEST)

#login method to check if the user is in the database, if not it will insert the user into the database
    def login(self, email):
        rows, description = self.query('SELECT * FROM auth_user WHERE email = %s', [email])
        if rows:
            user_id = rows[0][0]
        else:
            rows, description = self.query('''
                INSERT INTO auth_user (username, email, password, is_superuser, is_staff, is_active, date_joined, first_name, last_name)
                VALUES (%s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP, %s, %s)
                RETURNING id
            ''', [email, email, '', False, False, True, '', ''])
            user_id = rows[0][0]
        return User.objects.get(pk=user_id)

#register class to allow applicants to register with a username, password and email. By default, the is_staff attribute is set to false so they do not have employee access rights
#however any employee, admin or applicant can sign in using the same login system. Django's built in admin website can adjust the level of access rights for each user 
class Register(QueryClass):
    #allows anyone to register
    permission_classes = [AllowAny]
    #post method to insert a new user into the database
    def post(self, request, format=None):
        data = request.data
        username = data.get('username') 
        password = data.get('password')
        email = data.get('email')
        hashed_password = make_password(password)
        cursor = self.query('''
            INSERT INTO auth_user (username, password, is_superuser, is_staff, is_active, date_joined, first_name, last_name, email)
            VALUES (%s, %s, %s, %s, %s, CURRENT_TIMESTAMP, %s, %s, %s)
        ''', [username, hashed_password, False, False, True, '', '', email])
        if cursor:
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RetrieveStaffStatus(QueryClass):
    #get method to return the is_staff attribute of the logged in user
    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'is_staff': user.is_staff,
        })

#class to return a list of all applicants and their details in the database
class ListApplicants(QueryClass):
    #ensures the logged in user is an employee
    permission_classes=[IsAdminUser]
    #get method to return all details of all applicants, also retrieves the skills of each applicant by concatenating them into a single string
    def get(self, request):
        try:
            query = '''
            SELECT TRL_applicantdetails.id, TRL_applicantdetails.fullname, TRL_applicantdetails.email, TRL_applicantdetails.phonenumber, TRL_applicantdetails.qualifications, TRL_applicantdetails.preferences, TRL_applicantdetails.cv, TRL_applicantdetails.recruitmenttracker, 
            GROUP_CONCAT(TRL_skill.name) as skills FROM TRL_applicantdetails 
            LEFT JOIN TRL_applicantskill ON TRL_applicantdetails.email = TRL_applicantskill.applicant_email 
            LEFT JOIN TRL_skill ON TRL_applicantskill.skill_id = TRL_skill.id 
            GROUP BY TRL_applicantdetails.id, TRL_applicantdetails.fullname, TRL_applicantdetails.email, TRL_applicantdetails.phonenumber, TRL_applicantdetails.qualifications, TRL_applicantdetails.preferences, TRL_applicantdetails.cv, TRL_applicantdetails.recruitmenttracker
            '''
            rows, description = self.query(query, [])
            if rows is not None:
                columns = [col[0] for col in description]
                results = [dict(zip(columns, row)) for row in rows]
                return Response(results)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#class to download an applicant's cv stored on the server
#class to download an applicant's cv stored on the server
class DownloadCV(QueryClass):
    def get(self, request, id):
        try:
            applicant = ApplicantDetails.objects.get(id=id)
            file_path = applicant.cv.path
            if not file_path.startswith(settings.MEDIA_ROOT):
                raise SuspiciousFileOperation("The file is located outside of the base path component.")
            if os.path.exists(file_path):
                with open(file_path, 'rb') as cv:
                    response = HttpResponse(cv.read(), content_type="application/octet-stream")
                    response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path)
                    return response
            return Response(status=status.HTTP_404_NOT_FOUND)
        except ApplicantDetails.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except FileNotFoundError:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
# views.py
class ApplicantsToContact(QueryClass):
    permission_classes = [IsAdminUser]

    def get(self, request):
        try:
            query = '''
            SELECT TRL_applicantdetails.id, TRL_applicantdetails.fullname, TRL_applicantdetails.email, TRL_applicantdetails.phonenumber, TRL_applicantdetails.qualifications, TRL_applicantdetails.preferences, TRL_applicantdetails.cv, TRL_applicantdetails.recruitmenttracker, 
            GROUP_CONCAT(TRL_skill.name) as skills FROM TRL_applicantdetails 
            LEFT JOIN TRL_applicantskill ON TRL_applicantdetails.email = TRL_applicantskill.applicant_email 
            LEFT JOIN TRL_skill ON TRL_applicantskill.skill_id = TRL_skill.id 
            WHERE TRL_applicantdetails.recruitmenttracker = 4
            GROUP BY TRL_applicantdetails.id, TRL_applicantdetails.fullname, TRL_applicantdetails.email, TRL_applicantdetails.phonenumber, TRL_applicantdetails.qualifications, TRL_applicantdetails.preferences, TRL_applicantdetails.cv, TRL_applicantdetails.recruitmenttracker
            '''
            rows, description = self.query(query, [])
            if rows is not None:
                columns = [col[0] for col in description]
                results = [dict(zip(columns, row)) for row in rows]
                return Response(results)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# views.py
class UpdateContactedApplicant(QueryClass):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        email = request.data.get('email')
        try:
            applicant = ApplicantDetails.objects.get(email=email)
            applicant.recruitmenttracker = 5
            applicant.save()
            return Response(status=status.HTTP_200_OK)
        except ApplicantDetails.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)