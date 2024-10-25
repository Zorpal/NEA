# Generated by Django 5.1.2 on 2024-10-25 09:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ApplicantDetails',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('fullname', models.CharField(max_length=50)),
                ('email', models.EmailField(max_length=100, unique=True)),
                ('phonenumber', models.IntegerField()),
                ('qualifications', models.TextField(blank=True, null=True)),
                ('preferences', models.TextField(blank=True, choices=[('Full Time', 'Full Time'), ('Part Time', 'Part Time'), ('Contract', 'Contract'), ('Internship', 'Internship'), ('Temporary', 'Temporary'), ('Seasonal', 'Seasonal')], null=True)),
                ('cv', models.FileField(blank=True, null=True, upload_to='cvs/')),
                ('recruitmenttracker', models.IntegerField(default=1)),
            ],
        ),
        migrations.CreateModel(
            name='JobDetails',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('jobtitle', models.CharField(max_length=50)),
                ('companyname', models.CharField(max_length=50)),
                ('salary', models.FloatField()),
                ('jobdescription', models.CharField(max_length=2000)),
                ('dateposted', models.DateField(auto_now_add=True)),
                ('deadline', models.DateField(null=True)),
                ('location', models.TextField()),
                ('jobtype', models.TextField(choices=[('Full Time', 'Full Time'), ('Part Time', 'Part Time'), ('Contract', 'Contract'), ('Temporary', 'Temporary'), ('Internship', 'Internship'), ('Seasonal', 'Seasonal')])),
                ('jobprimaryskill', models.TextField(choices=[('Adult Social Care', 'Adult Social Care'), ('Child Social Care', 'Child Social Care'), ('Elderly Social Care', 'Elderly Social Care'), ('Hospital/GP Experience', 'Hospital/GP Experience'), ('Manegerial Experience', 'Manegerial Experience'), ('Technological Experience', 'Technological Experience'), ('Physiotherapy', 'Physiotherapy'), ('Doctorate', 'Doctorate'), ('Surgeon', 'Surgeon'), ('Nursing', 'Nursing')])),
                ('jobsecondaryskill', models.TextField(choices=[('Adult Social Care', 'Adult Social Care'), ('Child Social Care', 'Child Social Care'), ('Elderly Social Care', 'Elderly Social Care'), ('Hospital/GP Experience', 'Hospital/GP Experience'), ('Manegerial Experience', 'Manegerial Experience'), ('Technological Experience', 'Technological Experience'), ('Physiotherapy', 'Physiotherapy'), ('Doctorate', 'Doctorate'), ('Surgeon', 'Surgeon'), ('Nursing', 'Nursing')])),
            ],
        ),
        migrations.CreateModel(
            name='Skill',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='ApplicantSkill',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('applicant_email', models.EmailField(max_length=100)),
                ('skill', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='TRL.skill')),
            ],
            options={
                'unique_together': {('applicant_email', 'skill')},
            },
        ),
    ]
