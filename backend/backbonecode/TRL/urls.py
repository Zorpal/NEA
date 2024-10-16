from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenVerifyView, TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("List/", JobList.as_view(), name="Jobs"),
    path("List/<int:pk>/", JobDetail.as_view(), name="Job"),
    path("details/", UpdateApplicantDetails.as_view(), name="ApplicantDetails"),
    path("details/delete/<int:pk>/", DeleteApplicantDetails.as_view(), name="DeleteApplicantDetails"),
    path('g-sso/', GoogleSSO.as_view(), name='g-sso'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register, name='register')
    
]
