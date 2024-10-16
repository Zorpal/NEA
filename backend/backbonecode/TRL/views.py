from rest_framework.generics import *
from rest_framework.views import *
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import models

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
    permission_classes = [AllowAny]

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
