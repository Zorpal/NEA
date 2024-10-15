
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('Jobs/', include('TRL.urls')),
    path('user/', include('users.urls')),
]
