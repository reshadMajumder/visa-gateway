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

    def get(self, request, id=None):   
        if id:
            try:
                country = Country.objects.filter(id=id, active=True).prefetch_related(
                    'types'
                ).first()
                serializer = CountrySerializer(country)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(
                    {"error": "Failed to fetch country", "details": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                ) 
        try:
            countries = Country.objects.filter(active=True).prefetch_related(
                'types'
            )
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
                serializer = DetailedVisaTypeSerializer(visa_types, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(
                    {"error": "Failed to fetch visa types", "details": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )


class CountryVisaTypesView(APIView):
    """
    get visa types by country
    """
    def get(self, request, id=None):
        if not id:
            return Response(
                {"error": "Country ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            country = Country.objects.filter(id=id, active=True).prefetch_related(
                'types'
            ).first()
            visa_types = country.types.filter(active=True).prefetch_related(
                'processes', 'overviews', 'notes', 'required_documents'
            )
            serializer = DetailedVisaTypeSerializer(visa_types, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": "Failed to fetch visa types for the country", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    