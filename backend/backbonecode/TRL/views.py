from rest_framework.generics import *
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer
from .utils import *
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import AccessToken
from django.db import connection
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

class JobList(ListAPIView):
    queryset = JobDetails.objects.all()
    serializer_class = JobSerializer

class JobDetail(APIView):
    def get_jobobject(self, pk):
        try:
            return JobDetails.objects.get(pk=pk)
        except JobDetails.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
    def get(self, request, pk, format=None):
        job = self.get_jobobject(pk)
        serializer = JobDetailsSerializer(job)
        return Response(serializer.data)




class UpdateApplicantDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        try:
            with connection.cursor() as cursor:
                cursor.execute('SELECT * FROM TRL_applicantdetails WHERE fullname = %s', [user.username])
                rows = cursor.fetchall()
                columns = [col[0] for col in cursor.description]
                results = [dict(zip(columns, row)) for row in rows]
            return Response(results)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, format=None):
        user = request.user
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

class DeleteApplicantDetails(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk, format=None):
        user = request.user
        with connection.cursor() as cursor:
            cursor.execute('DELETE FROM TRL_applicantdetails WHERE id = %s', [pk])
            if cursor.rowcount == 0:
                return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)



def login(email):
    try:
        applicant = User.objects.get(email=email)
    except User.DoesNotExist:
        applicant = User.objects.create_user(username=email, email=email)
    return applicant

class GoogleSSO(APIView):
    def post(self, request):
        if 'code' in request.data.keys():
            code = request.data['code']
            id_token = get_google_token(code)
            email = id_token['email']
            user = login(email)
            token = AccessToken.for_user(user)
            return Response({'access_token': str(token), 'username': email})
            
        return Response('ok')
    
@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_406_NOT_ACCEPTABLE)
