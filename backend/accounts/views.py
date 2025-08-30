from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.conf import settings

import jwt, datetime

from .serializers import UserSerializer
from .models import User

def get_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
        'iat': datetime.datetime.utcnow()
    }
        
    token = jwt.encode(payload=payload, key=settings.JWT_SECRET_KEY, algorithm='HS256')
    return token    

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        print(request.data)
        
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            token = get_token(user_id=serializer.data['id'])
            return Response({'message': 'Registration successful', 'user': serializer.data, 'token': token}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = User.objects.filter(email=email).first()
        
        if user is None:
            return Response({'error': 'Invalid email'}, status=status.HTTP_400_BAD_REQUEST)
        if not user.check_password(password):
            return Response({'error': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = UserSerializer(user)
        token = get_token(user_id=user.id)
        
        return Response({'message': 'Login successful', 'user': serializer.data, 'token': token}, status=status.HTTP_200_OK)
        
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)