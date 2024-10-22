from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenVerifyView, TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("List/", JobList.as_view(), name="Jobs"),
    path("List/<int:pk>/", JobDetail.as_view(), name="Job"),
    path("Update/", UpdateJob.as_view(), name="UpdateJob"),
    path("details/", UpdateApplicantDetails.as_view(), name="ApplicantDetails"),
    path("details/delete/<int:pk>/", DeleteApplicantDetails.as_view(), name="DeleteApplicantDetails"),
    path('g-sso/', GoogleSSO.as_view(), name='g-sso'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', Register.as_view(), name='register'),
    path('retrieve-staff-status/', RetrieveStaffStatus.as_view(), name='RetrieveStaffStatus'),
    path('applicant/list/', ListApplicants.as_view(), name='ApplicantList'),
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
