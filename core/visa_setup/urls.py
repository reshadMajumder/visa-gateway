
from django.urls import path, include

from .views import VisaTypeView, CountryView,CountryVisaTypesView, VisaApplicationView, ApplicationDocumentView, AdminDocumentReviewView


urlpatterns = [
    path('visa-types/', VisaTypeView.as_view(), name='visa-type-list'),
    path('visa-types/<int:id>/', VisaTypeView.as_view(), name='visa-type-detail'),
    path('countries/', CountryView.as_view(), name='country-list'),
    path('countries/<int:id>/', CountryView.as_view(), name='country-detail'),
    path('country-visa-types/<int:id>/', CountryVisaTypesView.as_view(), name='visa-type-processes'),
    path('visa-applications/', VisaApplicationView.as_view(), name='visa-application-list'),
    path('visa-applications/<int:application_id>/documents/', ApplicationDocumentView.as_view(), name='application-document-list'),
    path('visa-applications/<int:application_id>/documents/<int:document_id>/', ApplicationDocumentView.as_view(), name='application-document-detail'),
    path('admin/document-review/<int:document_id>/', AdminDocumentReviewView.as_view(), name='admin-document-review'),
]
