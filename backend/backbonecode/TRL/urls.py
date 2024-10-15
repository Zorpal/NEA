from django.urls import path
from .views import *

urlpatterns = [
    path("List/", JobList.as_view(), name="Jobs"),
    path("List/<int:pk>/", JobDetail.as_view(), name="Job"),
    
]
