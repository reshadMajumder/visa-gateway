from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from .serializers import VisaTypeSerializer, CountrySerializer, DetailedVisaTypeSerializer, VisaApplicationSerializer, ApplicationDocumentSerializer
from .models import VisaType, Country, VisaApplication, ApplicationDocument
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser



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


class ApplicationDocumentView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, application_id):
        """Upload a document for a visa application"""
        try:
            application = VisaApplication.objects.get(id=application_id, user=request.user)
        except VisaApplication.DoesNotExist:
            return Response(
                {"error": "Visa application not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ApplicationDocumentSerializer(data=request.data)
        if serializer.is_valid():
            try:
                # Check if document is required for this visa type
                required_doc = serializer.validated_data['required_document']
                if not application.visa_type.required_documents.filter(id=required_doc.id).exists():
                    return Response(
                        {"error": "This document is not required for this visa type"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Check if document already exists
                existing_doc = ApplicationDocument.objects.filter(
                    application=application,
                    required_document=required_doc
                ).first()

                if existing_doc:
                    # Update existing document
                    existing_doc.file = serializer.validated_data['file']
                    existing_doc.status = 'pending'
                    existing_doc.rejection_reason = ''
                    existing_doc.save()
                    serializer = ApplicationDocumentSerializer(existing_doc)
                else:
                    # Create new document
                    document = serializer.save(
                        application=application,
                        status='pending'
                    )
                    serializer = ApplicationDocumentSerializer(document)

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, application_id, document_id=None):
        """Allow user to re-upload a rejected document"""
        try:
            document = ApplicationDocument.objects.get(id=document_id, application__id=application_id, application__user=request.user)
        except ApplicationDocument.DoesNotExist:
            return Response(
                {"error": "Document not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        file = request.data.get('file')
        if not file:
            return Response({"error": "File is required"}, status=status.HTTP_400_BAD_REQUEST)
        document.file = file
        document.status = 'pending'
        document.rejection_reason = ''
        document.save()
        return Response(ApplicationDocumentSerializer(document).data)

    def get(self, request, application_id):
        """Get all documents for a visa application"""
        try:
            application = VisaApplication.objects.get(id=application_id, user=request.user)
        except VisaApplication.DoesNotExist:
            return Response(
                {"error": "Visa application not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        documents = ApplicationDocument.objects.filter(application=application)
        serializer = ApplicationDocumentSerializer(documents, many=True)
        return Response(serializer.data)

class AdminDocumentReviewView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, document_id):
        """Update document status and add admin notes and rejection reason"""
        try:
            document = ApplicationDocument.objects.get(id=document_id)
        except ApplicationDocument.DoesNotExist:
            return Response(
                {"error": "Document not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        status_val = request.data.get('status')
        admin_notes = request.data.get('admin_notes')
        rejection_reason = request.data.get('rejection_reason', '')

        if status_val not in ['pending', 'approved', 'rejected']:
            return Response(
                {"error": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST
            )

        document.status = status_val
        if admin_notes is not None:
            document.admin_notes = admin_notes
        if status_val == 'rejected':
            document.rejection_reason = rejection_reason
        else:
            document.rejection_reason = ''
        document.save()

        # If all documents are approved, update application status
        if status_val == 'approved':
            application = document.application
            all_docs_approved = all(
                doc.status == 'approved' 
                for doc in application.documents.all()
            )
            if all_docs_approved:
                application.status = 'in_review'
                application.save()

        return Response(ApplicationDocumentSerializer(document).data)

