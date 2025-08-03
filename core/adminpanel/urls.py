from django.urls import path
from .views import AdminLoginView, AdminLogoutView,CustomTokenRefreshView

urlpatterns = [
    path('login/', AdminLoginView.as_view(), name='admin-login'),
    path('logout/', AdminLogoutView.as_view(), name='admin-logout'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),

]
