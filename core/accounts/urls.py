from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import RegisterView, LoginView, TokenRefreshView, UserProfileView, LogoutView, SendOTPView, VerifyOTPView, ResendOTPView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('otp/send/', SendOTPView.as_view(), name='send_otp'),
    path('otp/verify/', VerifyOTPView.as_view(), name='verify_otp'),
    path('otp/resend/', ResendOTPView.as_view(), name='resend_otp'),
    

]