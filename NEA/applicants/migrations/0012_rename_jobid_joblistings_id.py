# Generated by Django 5.0.7 on 2024-08-18 11:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('applicants', '0011_alter_applicantdetails_cv'),
    ]

    operations = [
        migrations.RenameField(
            model_name='joblistings',
            old_name='jobid',
            new_name='id',
        ),
    ]