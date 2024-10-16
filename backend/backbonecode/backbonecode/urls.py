
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('Jobs/', include('TRL.urls')),
    path('user/', include('TRL.urls')),
    path('applicant/', include('TRL.urls')),
]
