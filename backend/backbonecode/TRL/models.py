from django.db import models

class ApplicantDetails(models.Model):
    id = models.AutoField(primary_key=True)
    fullname = models.CharField(max_length=50)
    email = models.EmailField(max_length=100, unique=True)
    phonenumber = models.IntegerField()
    qualifications = models.TextField(blank=True, null=True)
    preferences = models.TextField(choices=[
        ('Full Time', 'Full Time'),
        ('Part Time', 'Part Time'),
        ('Contract', 'Contract'),
        ('Internship', 'Internship'),
        ('Temporary', 'Temporary'),
        ('Seasonal', 'Seasonal'),
    ], blank=True, null=True)
    cv = models.FileField(upload_to='cvs/', blank=True, null=True)
    recruitmenttracker = models.IntegerField(default=1)

    def __str__(self):
        return self.fullname

class Skill(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class ApplicantSkill(models.Model):
    applicant_email = models.EmailField(max_length=100)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('applicant_email', 'skill')

    def __str__(self):
        return f"{self.applicant_email} - {self.skill.name}"

class JobDetails(models.Model):
    id = models.AutoField(primary_key=True)
    jobtitle = models.CharField(max_length=50)
    companyname = models.CharField(max_length=50)
    salary = models.FloatField()
    jobdescription = models.CharField(max_length=2000)
    dateposted = models.DateField(auto_now_add=True)
    deadline = models.DateField(null=True)
    location = models.TextField()
    jobtype = models.TextField(choices=[
        ('Full Time', 'Full Time'),
        ('Part Time', 'Part Time'),
        ('Contract', 'Contract'),
        ('Temporary', 'Temporary'),
        ('Internship', 'Internship'),
        ('Seasonal', 'Seasonal'),
    ])
    jobprimaryskill = models.TextField(choices=[
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
    ])
    jobsecondaryskill = models.TextField(choices=[
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
    ])

    def __str__(self):
        return self.jobtitle
