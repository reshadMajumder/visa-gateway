from django.shortcuts import render
from rest_framework.views import APIView
# Create your views here.
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from .serializers import VisaTypeSerializer, CountrySerializer
from .models import VisaType, Country



class CountryView(APIView):
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
    def get(self, request):
        try:
            visa_types = VisaType.objects.all()
            serializer = VisaTypeSerializer(visa_types, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": "Failed to fetch visa types", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    