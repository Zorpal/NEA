from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from .models import *

class JobSerializer(ModelSerializer):
    class Meta:
        model = JobDetails
        fields = ['id', 'jobtitle', 'salary', 'companyname']

class JobDetailsSerializer(ModelSerializer):
    class Meta:
        model = JobDetails
        fields = ['__all__']

class ApplicantSerializer(ModelSerializer):
    class Meta:
        model = ApplicantDetails
        fields = ['id', 'fullname', 'email', 'phonenumber', 'skill_1', 'skill_2', 'skill_3', 'skill_4', 'skill_5', 'qualifications', 'preferences', 'cv']

class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True, validators=[UniqueValidator(queryset=User.objects.all())])
    password = serializers.CharField(required=True, write_only=True)
    confirmpassword = serializers.CharField(required=True, write_only=True)
    class Meta:
        model = User
        fields = ('username', 'password', 'confirmpassword')
    
    def validatedata(self, attrs): #attrs are short for attributes
        if attrs['password'] != attrs['confirmpassword']:
            raise serializers.ValidationError({"password":"Passwords are not matching!"})
        return attrs
    
    def create(self, applicantargs):
        applicant = User.objects.create(
            username=applicantargs['username']
        )
        applicant.set_password(applicantargs['password'])
        applicant.save()
        return applicant