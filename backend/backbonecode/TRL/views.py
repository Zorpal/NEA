from rest_framework.generics import *
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import models
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer
from .utils import *
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import AccessToken

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


class UpdateApplicantDetails(ListCreateAPIView):
    serializer_class = ApplicantSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ApplicantDetails.objects.filter(fullname=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(fullname=self.request.user)
        else:
            print(serializer.errors)

class DeleteApplicantDetails(DestroyAPIView):
    serializer_class = ApplicantSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ApplicantDetails.objects.filter(fullname=user)



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