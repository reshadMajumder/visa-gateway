from django.shortcuts import render
from rest_framework.views import APIView
# Create your views here.
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from .serializers import VisaTypeSerializer, CountrySerializer,DetailedVisaTypeSerializer
from .models import VisaType, Country



class CountryView(APIView):
    """
    get only the list of countries

    """

    def get(self, request):
        try:
            countries = Country.objects.all()
            serializer = CountrySerializer(countries, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": "Failed to fetch countries", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VisaTypeView(APIView):
    """
    get  visa type and also single type details
    """
    def get(self, request, id=None):
        if id:
            try:
                visa_type = VisaType.objects.filter(id=id, active=True).prefetch_related(
                    'processes', 'overviews', 'notes', 'required_documents'
                ).first()
                serializer = DetailedVisaTypeSerializer(visa_type)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(
                    {"error": "Failed to fetch visa types", "details": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            try:
                visa_types = VisaType.objects.filter(active=True).prefetch_related(
                    'processes', 'overviews', 'notes', 'required_documents'
                )
                serializer = VisaTypeSerializer(visa_types, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(
                    {"error": "Failed to fetch visa types", "details": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )



    