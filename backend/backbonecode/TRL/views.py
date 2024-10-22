from rest_framework.generics import *
from .models import *
from rest_framework.permissions import IsAuthenticated
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


#Adds in a new job instance
class UpdateJob(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data

        try:
            with connection.cursor() as cursor:
                cursor.execute('''
                    INSERT INTO TRL_jobdetails (jobtitle, companyname, salary, jobdescription, dateposted, location, jobtype, deadline, jobprimaryskill, jobsecondaryskill, jobsuitablefor)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
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
                    data.get('jobsuitablefor')
                ])
            return Response(status=status.HTTP_201_CREATED)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#Returns a list of all jobs 
class JobList(APIView):
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute('SELECT * FROM TRL_jobdetails')
                rows = cursor.fetchall()
                columns = [col[0] for col in cursor.description]
                results = [dict(zip(columns, row)) for row in rows]
            return Response(results)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#Returns all details of a specific job based on their primary key
class JobDetail(APIView):
    def get_job(self, pk):
        try:
            with connection.cursor() as cursor:
                cursor.execute('SELECT * FROM TRL_jobdetails WHERE id = %s', [pk])
                row = cursor.fetchone()
                if row:
                    columns = [col[0] for col in cursor.description]
                    return dict(zip(columns, row))
                else:
                    return None
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get(self, request, pk):
        job = self.get_job(pk)
        if job:
            return Response(job)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

#Adds in details of the applicant sent from the frontend server to the database
class UpdateApplicantDetails(APIView):
    
    # Makes sure that people who have logged in and passing in jwt (tokens) can access this, and rejects anyone who isn't logged in or has passed in an expired access token
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            with connection.cursor() as cursor:
                cursor.execute('SELECT * FROM TRL_applicantdetails WHERE email = %s', [user.email])
                rows = cursor.fetchall()
                columns = [col[0] for col in cursor.description]
                results = [dict(zip(columns, row)) for row in rows]
            return Response(results)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        data = request.data
        cv_file = data.get('cv')
        if cv_file:
            file_name = default_storage.save(f'cvs/{cv_file.name}', ContentFile(cv_file.read()))
            cv_file_path = default_storage.path(file_name)
        else:
            cv_file_path = None

        try:
            with connection.cursor() as cursor:
                cursor.execute('INSERT INTO TRL_applicantdetails (fullname, email, phonenumber, skill_1, skill_2, skill_3, skill_4, skill_5, qualifications, preferences, cv, recruitmenttracker) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)', 
                       [data.get('fullname'),
                        data.get('email'),
                        data.get('phonenumber'),
                        data.get('skill_1'),
                        data.get('skill_2'),
                        data.get('skill_3'),
                        data.get('skill_4'),
                        data.get('skill_5'),
                        data.get('qualifications'),
                        data.get('preferences'),
                        cv_file_path,
                        data.get('recruitmenttracker')])
            return Response(status=status.HTTP_201_CREATED)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#Updates the value of recruitmenttracker as a way to identify what stage of the recruitment process the applicant is in
class UpdateRecruitmentTracker(APIView):
    
    #(functionality of IsAuthenticated explained in UpdateApplicantDetails)
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    "UPDATE TRL_applicantdetails SET recruitmenttracker = %s WHERE email = %s",
                    [data.get('recruitmenttracker'), data.get('email')]
                )
            return Response(status=status.HTTP_200_OK)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#Deletes the details of an applicant from TRL_applicantdetails
class DeleteApplicantDetails(APIView):
    
    #(functionality of IsAuthenticated explained in UpdateApplicantDetails)
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk, format=None):
        user = request.user
        with connection.cursor() as cursor:
            cursor.execute('DELETE FROM TRL_applicantdetails WHERE id = %s', [pk])
            if cursor.rowcount == 0:
                return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)



#Allows a user to sign in with google sso through google cloud console, where I have registered this app along with the urls of both servers to communicate with each other
class GoogleSSO(APIView):
    def post(self, request):
        if 'code' in request.data.keys():
            code = request.data['code']
            id_token = get_google_token(code)
            email = id_token['email']
            user = self.login(email)
            token = AccessToken.for_user(user)
            return Response({'access_token': str(token), 'username': email})
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def login(self, email):
        try:
            with connection.cursor() as cursor:
                cursor.execute('SELECT * FROM auth_user WHERE email = %s', [email])
                row = cursor.fetchone()
                if row:
                    user_id = row[0]
                else:
                    cursor.execute('''
                        INSERT INTO auth_user (username, email, password, is_superuser, is_staff, is_active, date_joined, first_name, last_name)
                        VALUES (%s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP, %s, %s)
                        RETURNING id
                    ''', [email, email, '', False, False, True, '', ''])
                    user_id = cursor.fetchone()[0]
            user = User.objects.get(pk=user_id)
        except Exception:
            return None
        return user

#Registers a new user to the database that takes in the parameters username, password, and email from my frontend server, and hashes the password using Django's built in hashing function based on SHA256
class Register(APIView):
    def post(self, request, format=None):
        data = request.data
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        hashed_password = make_password(password)

        try:
            with connection.cursor() as cursor:
                cursor.execute('''
                    INSERT INTO auth_user (username, password, is_superuser, is_staff, is_active, date_joined, first_name, last_name, email)
                    VALUES (%s, %s, %s, %s, %s, CURRENT_TIMESTAMP, %s, %s, %s)
                ''', [username, hashed_password, False, False, True, '', '', email])
            return Response(status=status.HTTP_201_CREATED)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#Returns the username and is_staff attributes of the current user
class RetrieveStaffStatus(APIView):
    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'is_staff': user.is_staff,
        })


#Retrieves all applicants from the database, is used by employees (users with the is_staff field set to True)
class ListApplicants(APIView):
    
    #(functionality of IsAuthenticated explained in UpdateApplicantDetails)
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute('SELECT * FROM TRL_applicantdetails')
                rows = cursor.fetchall()
                columns = [col[0] for col in cursor.description]
                listofapplicants = [dict(zip(columns, row)) for row in rows]                 
            return Response(listofapplicants)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
#Retrieves emails of applicants whose skills match job primary or secondary skills
class RetrieveApplicantSkills(APIView):
    def post(self, request):
        skill = request.data.get('skill')
        if not skill:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            with connection.cursor() as cursor:
                cursor.execute('''
                    SELECT DISTINCT a.email
                    FROM TRL_applicantdetails a
                    WHERE %s IN (a.skill_1, a.skill_2, a.skill_3, a.skill_4, a.skill_5)
                ''', [skill])
                rows = cursor.fetchall()
                emails = [row[0] for row in rows]
            return Response({'emails': emails})
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)