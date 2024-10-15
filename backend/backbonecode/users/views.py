from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer
from .utils import *
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import AccessToken

def create_or_login(email):
    try:
        applicant = User.objects.get(email=email)
    except User.DoesNotExist:
        applicant = User.objects.create_user(username=email, email=email)
    return applicant

class GoogleSSO(APIView):
    def post(self, request):
        if 'code' in request.data.keys():
            code = request.data['code']
            id_token = get_google_token(code)
            email = id_token['email']
            user = create_or_login(email)
            token = AccessToken.for_user(user)
            return Response({'access_token': str(token), 'username': email})
            
        return Response('ok')
    
@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_406_NOT_ACCEPTABLE)