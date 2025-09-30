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
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings
import random
import string
from datetime import timedelta

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
        """
        Accept full registration payload, validate it, then send OTP to email and
        cache the validated payload for later creation after OTP verification.
        """
        serializer = UserRegistrationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data.get('email').lower()
        cache_key_payload = f"register:payload:{email}"
        cache_key_otp = f"otp:register:{email}"

        # Store the validated data for later user creation
        payload_ttl = int(getattr(settings, 'OTP_VERIFIED_TTL_SECONDS', 900))
        cache.set(cache_key_payload, serializer.validated_data, payload_ttl)

        # Generate and cache OTP
        import random, string
        otp = ''.join(random.choices(string.digits, k=6))
        otp_ttl = int(getattr(settings, 'OTP_TTL_SECONDS', 600))
        cache.set(cache_key_otp, otp, otp_ttl)

        # Send OTP via email
        subject = 'Your Registration OTP Code'
        message = f"Your verification code is: {otp}. It will expire in {otp_ttl // 60} minutes."
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', None)
        try:
            send_mail(subject, message, from_email, [email], fail_silently=False)
        except Exception as e:
            cache.delete(cache_key_payload)
            cache.delete(cache_key_otp)
            return Response({'error': f'Failed to send OTP: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'OTP sent to email. Please verify to complete registration.'}, status=status.HTTP_200_OK)

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




class SendOTPView(APIView):
    """
    Send a 6-digit OTP to the provided email. OTP is cached for limited time.
    """
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        purpose = request.data.get('purpose', 'login')  # e.g., login, register, reset

        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        # 6-digit numeric OTP
        otp = ''.join(random.choices(string.digits, k=6))
        cache_key = f"otp:{purpose}:{email.lower()}"

        # TTL 10 minutes by default
        ttl_seconds = int(getattr(settings, 'OTP_TTL_SECONDS', 600))
        cache.set(cache_key, otp, ttl_seconds)

        subject = 'Your OTP Code'
        message = f"Your verification code is: {otp}. It will expire in {ttl_seconds // 60} minutes."
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', None)

        try:
            send_mail(subject, message, from_email, [email], fail_silently=False)
        except Exception as e:
            # On email failure, delete the OTP from cache to avoid dangling codes
            cache.delete(cache_key)
            return Response({'error': f'Failed to send OTP: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'OTP sent successfully'}, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    """
    Verify email OTP. If correct, mark as verified by storing a short-lived flag in cache.
    """
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        purpose = request.data.get('purpose')

        if not email or not otp:
            return Response({'error': 'Email and OTP are required'}, status=status.HTTP_400_BAD_REQUEST)

        email_key = email.strip().lower()

        # Determine purpose smartly: if not provided, infer 'register' when registration payload exists
        purpose_key = (purpose or '').strip().lower() or 'login'
        payload_key = f"register:payload:{email_key}"
        if purpose is None and cache.get(payload_key) is not None:
            purpose_key = 'register'

        # Try to fetch OTP using the resolved purpose; fall back across common purposes to avoid UX issues
        tried_keys = []
        cache_key = f"otp:{purpose_key}:{email_key}"
        cached_otp = cache.get(cache_key)
        tried_keys.append(cache_key)
        if not cached_otp:
            # If we expected login but there's a register flow in progress, try register key
            alt_keys = []
            if purpose_key != 'register':
                alt_keys.append(f"otp:register:{email_key}")
            if purpose_key != 'login':
                alt_keys.append(f"otp:login:{email_key}")
            for k in alt_keys:
                v = cache.get(k)
                tried_keys.append(k)
                if v:
                    cached_otp = v
                    cache_key = k
                    # align purpose_key with the found key
                    purpose_key = k.split(':')[1]
                    break

        if not cached_otp:
            return Response({'error': 'OTP expired or not found'}, status=status.HTTP_400_BAD_REQUEST)

        if str(cached_otp) != str(otp):
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

        # OTP valid
        cache.delete(cache_key)

        # If this is for registration, create the user from cached payload and return tokens
        if purpose_key == 'register':
            payload_key = f"register:payload:{email_key}"
            payload = cache.get(payload_key)
            if not payload:
                return Response({'error': 'Registration data expired. Please register again.'}, status=status.HTTP_400_BAD_REQUEST)

            # Validate again and create user safely
            reg_serializer = UserRegistrationSerializer(data=payload)
            if not reg_serializer.is_valid():
                cache.delete(payload_key)
                return Response(reg_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            user = reg_serializer.save()
            cache.delete(payload_key)

            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'User registered successfully',
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                'user': UserResponseSerializer(user).data
            }, status=status.HTTP_201_CREATED)

        # Otherwise, mark as verified for the given purpose
        verified_key = f"otp_verified:{purpose}:{email.lower()}"
        verified_ttl = int(getattr(settings, 'OTP_VERIFIED_TTL_SECONDS', 900))
        cache.set(verified_key, True, verified_ttl)

        return Response({'message': 'OTP verified successfully'}, status=status.HTTP_200_OK)


class ResendOTPView(APIView):
    """
    Regenerate and resend a 6-digit OTP to the provided email for the given purpose.
    Overwrites any existing OTP in cache.
    """
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        purpose = request.data.get('purpose', 'login')

        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate new OTP
        otp = ''.join(random.choices(string.digits, k=6))
        cache_key = f"otp:{purpose}:{email.lower()}"
        ttl_seconds = int(getattr(settings, 'OTP_TTL_SECONDS', 600))
        cache.set(cache_key, otp, ttl_seconds)

        subject = 'Your OTP Code'
        message = f"Your verification code is: {otp}. It will expire in {ttl_seconds // 60} minutes."
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', None)

        try:
            send_mail(subject, message, from_email, [email], fail_silently=False)
        except Exception as e:
            return Response({'error': f'Failed to send OTP: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'OTP resent successfully'}, status=status.HTTP_200_OK)
