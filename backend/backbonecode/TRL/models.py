from django.db import models

class ApplicantDetails(models.Model):
    id = models.AutoField(primary_key=True)
    fullname = models.CharField(max_length=50)
    email = models.EmailField(max_length=50)
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
    ], )
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
    ], )
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
    ], )
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
    ], )
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
    ], )
    qualifications = models.TextField()
    preferences = models.CharField(max_length=500, )
    cv = models.FileField(null=True, blank=True, upload_to='cvs/')

    def __str__(self):
        return self.fullname

class JobDetails(models.Model):
    id = models.AutoField(primary_key=True)
    jobtitle = models.CharField(max_length=50, )
    companyname = models.CharField(max_length=50, )
    salary = models.FloatField()
    jobdescription = models.CharField(max_length=2000, )
    dateposted = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField(null=True)
    location = models.TextField()

    def __str__(self):
        return self.jobtitle
