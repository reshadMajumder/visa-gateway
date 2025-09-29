from django.urls import path
from .views import (
    AdminLoginView, AdminLogoutView,CustomTokenRefreshView,
    NotesView, NotesDetailView,
    VisaProcessView, VisaProcessDetailView,
    VisaOverviewView, VisaOverviewDetailView,
    RequiredDocumentsView, RequiredDocumentsDetailView,
    CountryListCreateView, CountryDetailView,
    VisaTypeListCreateView, VisaTypeDetailView,
    CountryVisaTypesView, CountryVisaTypeDetailView,
    VisaTypeFormDataView, CountryFormDataView,
    CountriesWithVisaTypesView, BulkVisaTypeAssignmentView,
    UserVisaApplicationView,
    ConsultationAPIView,
    SettingsView,
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
    path('countries-with-visa-types/', CountriesWithVisaTypesView.as_view()),

    # VisaType endpoints
    path('visa-types/', VisaTypeListCreateView.as_view()),
    path('visa-types/<int:pk>/', VisaTypeDetailView.as_view()),

    # Country Visa Types endpoints
    path('countries/<int:country_id>/visa-types/', CountryVisaTypesView.as_view()),
    path('countries/<int:country_id>/visa-types/<int:visa_type_id>/', CountryVisaTypeDetailView.as_view()),
    path('countries/<int:country_id>/bulk-assign-visa-types/', BulkVisaTypeAssignmentView.as_view()),

    # Utility endpoints for form data
    path('form-data/visa-type/', VisaTypeFormDataView.as_view()),
    path('form-data/country/', CountryFormDataView.as_view()),

    path('visa-applications/', UserVisaApplicationView.as_view(), name='visa-application-list'),
    path('visa-applications/<int:application_id>/', UserVisaApplicationView.as_view(), name='visa-application-detail'),
    path('consultations/', ConsultationAPIView.as_view(), name='consultation-list'),
    path('consultations/<int:consultation_id>/', ConsultationAPIView.as_view(), name='consultation-detail'),
    path('settings/', SettingsView.as_view(), name='settings'),


]
