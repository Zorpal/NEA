# Generated by Django 5.0.7 on 2024-08-17 12:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('applicants', '0009_files'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Files',
        ),
        migrations.AlterField(
            model_name='applicantdetails',
            name='cv',
            field=models.FileField(blank=True, null=True, upload_to='upload_path'),
        ),
    ]
