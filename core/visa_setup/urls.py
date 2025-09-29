
from django.urls import path, include

from .views import SettingsView, VisaTypeView, CountryView,CountryVisaTypesView, VisaApplicationView,UserVisaApplicationView,BookConsultationView


urlpatterns = [
    path('visa-types/', VisaTypeView.as_view(), name='visa-type-list'),
    path('visa-types/<int:id>/', VisaTypeView.as_view(), name='visa-type-detail'),
    path('countries/', CountryView.as_view(), name='country-list'),
    path('countries/<int:id>/', CountryView.as_view(), name='country-detail'),
    path('country-visa-types/<int:id>/', CountryVisaTypesView.as_view(), name='visa-type-processes'),
    path('visa-applications/', VisaApplicationView.as_view(), name='visa-application-list'),
    path('visa-applications/<int:application_id>/', VisaApplicationView.as_view(), name='visa-application-detail'),

    path('v2/visa-applications/', UserVisaApplicationView.as_view(), name='visa-application-list'),
    path('v2/visa-applications/<int:application_id>/', UserVisaApplicationView.as_view(), name='visa-application-detail'),
    path('settings/', SettingsView.as_view(), name='settings'),
    path('book-consultation/', BookConsultationView.as_view(), name='book-consultation'),
    
    
]
