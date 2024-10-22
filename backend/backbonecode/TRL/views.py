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
from django.contrib.auth import authenticate, login

#Adds in a new job instance
class UpdateJob(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data

        try:
            with connection.cursor() as cursor:
                cursor.execute('''
                    INSERT INTO TRL_jobdetails (jobtitle, companyname, salary, jobdescription, dateposted, location, jobtype, deadline)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ''', [
                    data.get('jobtitle'),
                    data.get('companyname'),
                    data.get('salary'),
                    data.get('jobdescription'),
                    data.get('dateposted'),
                    data.get('location'),
                    data.get('jobtype'),
                    data.get('deadline')
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
        except Exception as e:
            return None
    
    def get(self, request, pk):
        job = self.get_job(pk)
        if job:
            return Response(job)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

#Adds in details of the applicant sent from the frontend server to the database
class UpdateApplicantDetails(APIView):
    
    #Makes sure that people who have logged in and passing in jwt (tokens) can access this, and rejects anyone who isn't logged in or has passed in an expired access token
    #permission_classes = [IsAuthenticated]

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
                cursor.execute('INSERT INTO TRL_applicantdetails (fullname, email, phonenumber, skill_1, skill_2, skill_3, skill_4, skill_5, qualifications, preferences, cv) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)', 
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
                        cv_file_path])
            return Response(status=status.HTTP_201_CREATED)
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

#
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
                allapplicants = [dict(zip(columns, row)) for row in rows]                 
            return Response(allapplicants)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)