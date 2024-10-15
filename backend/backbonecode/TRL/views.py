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






