
from django.urls import path, include

from .views import VisaTypeView, CountryView


urlpatterns = [
    path('visa-types/', VisaTypeView.as_view(), name='visa-type-list'),
    path('countries/', CountryView.as_view(), name='country-list'),
]
