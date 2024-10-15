from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenVerifyView, TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('g-sso/', GoogleSSO.as_view(), name='g-sso'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register, name='register')
]
