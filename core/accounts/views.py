from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import get_user_model
from .serializers import UserRegistrationSerializer, UserSerializer,UserResponseSerializer

User = get_user_model()

class LoginThrottle(AnonRateThrottle):
    rate = '10/minute'
    scope = 'login'

class RegisterThrottle(AnonRateThrottle):
    rate = '10/minute'
    scope = 'register'

class RegisterView(APIView):
    """
    API View for user registration.
    Allows creation of new user accounts with rate limiting.
    """
    permission_classes = (AllowAny,)
    throttle_classes = [RegisterThrottle]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'User registered successfully',
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                'user': UserResponseSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    """
    API View for user login with rate limiting.
    """
    permission_classes = (AllowAny,)
    throttle_classes = [LoginThrottle]

    def post(self, request):
        from django.contrib.auth import authenticate
        
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({
                'error': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(email=email, password=password)
        if not user:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Login successful',
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'user': UserResponseSerializer(user).data
        }, status=status.HTTP_200_OK)

class TokenRefreshView(APIView):
    """
    API View for refreshing access tokens.
    """
    permission_classes = (AllowAny,)

    def post(self, request):
        from rest_framework_simplejwt.tokens import RefreshToken
        from rest_framework_simplejwt.exceptions import TokenError
        
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({
                'error': 'Refresh token is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            refresh = RefreshToken(refresh_token)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh)  # New refresh token if rotation is enabled
            }, status=status.HTTP_200_OK)
        except TokenError:
            return Response({
                'error': 'Invalid refresh token'
            }, status=status.HTTP_401_UNAUTHORIZED)

class UserProfileView(APIView):
    """
    API View for user profile operations.
    Supports retrieving and updating user profile information.
    """
    permission_classes = (IsAuthenticated,)
    parser_classes = [MultiPartParser, FormParser]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        # If a new profile picture is provided, upload to Supabase and replace with URL
        data = request.data.copy()
        if 'profile_picture' in request.FILES:
            try:
                profile_file = request.FILES['profile_picture']

                # Basic validation (max 5MB and allowed extensions)
                if profile_file.size > 5 * 1024 * 1024:
                    return Response({'error': 'Profile picture size cannot exceed 5MB.'}, status=status.HTTP_400_BAD_REQUEST)

                allowed_extensions = {'.jpg', '.jpeg', '.png'}
                ext = '.' + profile_file.name.split('.')[-1].lower()
                if ext not in allowed_extensions:
                    return Response({'error': f"Only {', '.join(sorted(allowed_extensions))} files are allowed for profile picture."}, status=status.HTTP_400_BAD_REQUEST)

                # Upload to Supabase
                from core.supabase_client import upload_file_to_supabase
                public_url = upload_file_to_supabase(profile_file, folder="profiles", bucket="visa")

                # Replace file with URL for saving
                data['profile_picture'] = public_url
            except Exception as e:
                return Response({'error': f'Failed to upload profile picture: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        # If client mistakenly sent text for profile_picture in form-data, ignore non-file entry
        elif isinstance(request.data.get('profile_picture'), str) and request.data.get('profile_picture') == '':
            # Allow clearing the profile picture by sending empty string
            data['profile_picture'] = ''

        serializer = UserSerializer(request.user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Profile updated successfully',
                'user': serializer.data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        return self.put(request)

class LogoutView(APIView):
    """
    API View for user logout.
    Blacklists the refresh token to prevent its future use.
    """
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response({
                    "error": "Refresh token is required"
                }, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response({
                "status": True,
                "message": "Successfully logged out"
            }, status=status.HTTP_200_OK)
            
        except TokenError:
            return Response({
                "status": False,
                "error": "Invalid refresh token"
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({
                "status": False,
                "error": "An error occurred during logout",
                "detail": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


