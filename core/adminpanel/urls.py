from django.urls import path
from .views import (
    AdminLoginView, AdminLogoutView,CustomTokenRefreshView,
    NotesView, NotesDetailView,
    VisaProcessView, VisaProcessDetailView,
    VisaOverviewView, VisaOverviewDetailView,
    RequiredDocumentsView, RequiredDocumentsDetailView,
    CountryListCreateView, CountryDetailView,
    VisaTypeListCreateView, VisaTypeDetailView,
)

urlpatterns = [
    path('login/', AdminLoginView.as_view(), name='admin-login'),
    path('logout/', AdminLogoutView.as_view(), name='admin-logout'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),

    path('notes/', NotesView.as_view()),
    path('notes/<int:pk>/', NotesDetailView.as_view()),
    
    path('visa-process/', VisaProcessView.as_view()),
    path('visa-process/<int:pk>/', VisaProcessDetailView.as_view()),

    path('visa-overview/', VisaOverviewView.as_view()),
    path('visa-overview/<int:pk>/', VisaOverviewDetailView.as_view()),

    path('required-documents/', RequiredDocumentsView.as_view()),
    path('required-documents/<int:pk>/', RequiredDocumentsDetailView.as_view()),
    # Country endpoints
    path('countries/', CountryListCreateView.as_view()),
    path('countries/<int:pk>/', CountryDetailView.as_view()),

    # VisaType endpoints
    path('visa-types/', VisaTypeListCreateView.as_view()),
    path('visa-types/<int:pk>/', VisaTypeDetailView.as_view()),

]
