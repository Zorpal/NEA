from rest_framework.serializers import ModelSerializer
from .models import *

class JobSerializer(ModelSerializer):
    class Meta:
        model = JobDetails
        fields = ('id', 'jobtitle', 'salary', 'companyname')

class JobDetailsSerializer(ModelSerializer):
    class Meta:
        model = JobDetails
        fields = ('__all__')

class ApplicantSerializer(ModelSerializer):
    class Meta:
        model = ApplicantDetails
        fields = ('__all__')