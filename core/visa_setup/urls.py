
from django.urls import path, include

from .views import VisaTypeView, CountryView,CountryVisaTypesView, VisaApplicationView


urlpatterns = [
    path('visa-types/', VisaTypeView.as_view(), name='visa-type-list'),
    path('visa-types/<int:id>/', VisaTypeView.as_view(), name='visa-type-detail'),
    path('countries/', CountryView.as_view(), name='country-list'),
    path('countries/<int:id>/', CountryView.as_view(), name='country-detail'),
    path('country-visa-types/<int:id>/', CountryVisaTypesView.as_view(), name='visa-type-processes'),
    path('visa-applications/', VisaApplicationView.as_view(), name='visa-application-list'),

    ]
