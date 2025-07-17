from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from .serializers import VisaTypeSerializer, CountrySerializer, DetailedVisaTypeSerializer, VisaApplicationSerializer
from .models import VisaType, Country, VisaApplication
from rest_framework.permissions import IsAuthenticated, AllowAny



class CountryView(APIView):

    """
    API View to get the list of countries and individual country details.
    No authentication required.
    """
    permission_classes = [AllowAny]

    def get(self, request, id=None):
        if id:
            try:
                country = Country.objects.filter(id=id, active=True).prefetch_related(
                    'types'
                ).first()
                if not country:
                    return Response(
                        {"error": "Country not found"},
                        status=status.HTTP_404_NOT_FOUND
                    )
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
    API View to get visa types and their details.
    No authentication required.
    """
    permission_classes = [AllowAny]

    def get(self, request, id=None):
        if id:
            try:
                visa_type = VisaType.objects.filter(id=id, active=True).prefetch_related(
                    'processes', 'overviews', 'notes', 'required_documents'
                ).first()
                if not visa_type:
                    return Response(
                        {"error": "Visa type not found"},
                        status=status.HTTP_404_NOT_FOUND
                    )
                serializer = DetailedVisaTypeSerializer(visa_type)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(
                    {"error": "Failed to fetch visa type", "details": str(e)},
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
    API View to get visa types available for a specific country.
    No authentication required.
    """
    permission_classes = [AllowAny]

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
            if not country:
                return Response(
                    {"error": "Country not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
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


class VisaApplicationView(APIView):
    """
    API View for applying for a visa.
    This is a placeholder view and should be implemented with actual logic.
    """
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        # Pass request in the context
        serializer = VisaApplicationSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            try:
                visa_application = serializer.save()
                return Response({
                    "message": "Visa application created successfully",
                    "application": VisaApplicationSerializer(visa_application).data
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    "error": "Failed to create visa application",
                    "details": str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        """Get all visa applications for the logged-in user"""
        visa_applications = VisaApplication.objects.filter(user=request.user).select_related(
            'country', 'visa_type', 'user'
        )
        serializer = VisaApplicationSerializer(visa_applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

