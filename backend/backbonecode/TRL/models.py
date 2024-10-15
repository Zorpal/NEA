from django.db import models

class ApplicantDetails(models.Model):
    id = models.AutoField(primary_key=True)
    fullname = models.CharField(max_length=50, null=False)
    email = models.EmailField(max_length=50, null=False)
    phonenumber = models.IntegerField()
    skill_1 = models.TextField(choices=[
        ('Adult Social Care', 'Adult Social Care'),
        ('Child Social Care', 'Child Social Care'),
        ('Elderly Social Care', 'Elderly Social Care'),
        ('Hospital/GP Experience', 'Hospital/GP Experience'),
        ('Manegerial Experience', 'Manegerial Experience'),
        ('Technological Experience', 'Technological Experience'),
        ('Physiotherapy', 'Physiotherapy'),
        ('Doctorate', 'Doctorate'),
        ('Surgeon', 'Surgeon'),
        ('Nursing', 'Nursing'),
    ], null=False)
    skill_2 = models.TextField(choices=[
        ('Adult Social Care', 'Adult Social Care'),
        ('Child Social Care', 'Child Social Care'),
        ('Elderly Social Care', 'Elderly Social Care'),
        ('Hospital/GP Experience', 'Hospital/GP Experience'),
        ('Manegerial Experience', 'Manegerial Experience'),
        ('Technological Experience', 'Technological Experience'),
        ('Physiotherapy', 'Physiotherapy'),
        ('Doctorate', 'Doctorate'),
        ('Surgeon', 'Surgeon'),
        ('Nursing', 'Nursing'),
    ], null=False)
    skill_3 = models.TextField(choices=[
       ('Adult Social Care', 'Adult Social Care'),
        ('Child Social Care', 'Child Social Care'),
        ('Elderly Social Care', 'Elderly Social Care'),
        ('Hospital/GP Experience', 'Hospital/GP Experience'),
        ('Manegerial Experience', 'Manegerial Experience'),
        ('Technological Experience', 'Technological Experience'),
        ('Physiotherapy', 'Physiotherapy'),
        ('Doctorate', 'Doctorate'),
        ('Surgeon', 'Surgeon'),
        ('Nursing', 'Nursing'),
    ], null=False)
    skill_4 = models.TextField(choices=[
        ('Adult Social Care', 'Adult Social Care'),
        ('Child Social Care', 'Child Social Care'),
        ('Elderly Social Care', 'Elderly Social Care'),
        ('Hospital/GP Experience', 'Hospital/GP Experience'),
        ('Manegerial Experience', 'Manegerial Experience'),
        ('Technological Experience', 'Technological Experience'),
        ('Physiotherapy', 'Physiotherapy'),
        ('Doctorate', 'Doctorate'),
        ('Surgeon', 'Surgeon'),
        ('Nursing', 'Nursing'),
    ], null=False)
    skill_5 = models.TextField(choices=[
        ('Adult Social Care', 'Adult Social Care'),
        ('Child Social Care', 'Child Social Care'),
        ('Elderly Social Care', 'Elderly Social Care'),
        ('Hospital/GP Experience', 'Hospital/GP Experience'),
        ('Manegerial Experience', 'Manegerial Experience'),
        ('Technological Experience', 'Technological Experience'),
        ('Physiotherapy', 'Physiotherapy'),
        ('Doctorate', 'Doctorate'),
        ('Surgeon', 'Surgeon'),
        ('Nursing', 'Nursing'),
    ], null=False)
    qualifications = models.TextField(null=False)
    preferences = models.CharField(max_length=500, null=False)
    cv = models.FileField(null=True, blank=True, upload_to='cvs/')

    def __str__(self):
        return self.fullname

class JobDetails(models.Model):
    id = models.AutoField(primary_key=True)
    jobtitle = models.CharField(max_length=50, null=False)
    companyname = models.CharField(max_length=50, null=False)
    salary = models.FloatField(null=False)
    jobdescription = models.CharField(max_length=2000, null=False)
    dateposted = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField(null=True)
    location = models.TextField(null=False)

    def __str__(self):
        return self.jobtitle
