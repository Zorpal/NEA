# Generated by Django 5.0.7 on 2024-07-17 11:25

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ApplicantDetails',
            fields=[
                ('userid', models.AutoField(primary_key=True, serialize=False)),
                ('fullname', models.CharField(max_length=50)),
                ('email', models.EmailField(max_length=50)),
                ('phonenumber', models.IntegerField()),
                ('skill_1', models.TextField(choices=[('Problem-Solving', 'Problem-Solving'), ('Leadership', 'Leadership'), ('Time-Management', 'Time-Management'), ('Communication', 'Communication'), ('Collaboration', 'Collaboration'), ('Adaptability', 'Adaptability'), ('Creativity', 'Creativity'), ('Empathy', 'Empathy'), ('Negotiation', 'Negotiation'), ('Critical-Thinking', 'Critical-Thinking')])),
                ('skill_2', models.TextField(choices=[('Problem-Solving', 'Problem-Solving'), ('Leadership', 'Leadership'), ('Time-Management', 'Time-Management'), ('Communication', 'Communication'), ('Collaboration', 'Collaboration'), ('Adaptability', 'Adaptability'), ('Creativity', 'Creativity'), ('Empathy', 'Empathy'), ('Negotiation', 'Negotiation'), ('Critical-Thinking', 'Critical-Thinking')])),
                ('skill_3', models.TextField(choices=[('Problem-Solving', 'Problem-Solving'), ('Leadership', 'Leadership'), ('Time-Management', 'Time-Management'), ('Communication', 'Communication'), ('Collaboration', 'Collaboration'), ('Adaptability', 'Adaptability'), ('Creativity', 'Creativity'), ('Empathy', 'Empathy'), ('Negotiation', 'Negotiation'), ('Critical-Thinking', 'Critical-Thinking')])),
                ('skill_4', models.TextField(choices=[('Problem-Solving', 'Problem-Solving'), ('Leadership', 'Leadership'), ('Time-Management', 'Time-Management'), ('Communication', 'Communication'), ('Collaboration', 'Collaboration'), ('Adaptability', 'Adaptability'), ('Creativity', 'Creativity'), ('Empathy', 'Empathy'), ('Negotiation', 'Negotiation'), ('Critical-Thinking', 'Critical-Thinking')])),
                ('skill_5', models.TextField(choices=[('Problem-Solving', 'Problem-Solving'), ('Leadership', 'Leadership'), ('Time-Management', 'Time-Management'), ('Communication', 'Communication'), ('Collaboration', 'Collaboration'), ('Adaptability', 'Adaptability'), ('Creativity', 'Creativity'), ('Empathy', 'Empathy'), ('Negotiation', 'Negotiation'), ('Critical-Thinking', 'Critical-Thinking')])),
                ('qualifications', models.TextField()),
                ('preferences', models.CharField(max_length=500)),
                ('cv', models.FileField(null=True, upload_to='cvs/')),
            ],
        ),
        migrations.CreateModel(
            name='JobListings',
            fields=[
                ('jobid', models.AutoField(primary_key=True, serialize=False)),
                ('jobtitle', models.CharField(max_length=50)),
                ('companyname', models.CharField(max_length=50)),
                ('salary', models.FloatField()),
                ('jobdescription', models.CharField(max_length=2000)),
                ('dateposted', models.DateTimeField()),
                ('deadline', models.DateTimeField(null=True)),
                ('location', models.TextField()),
            ],
        ),
    ]