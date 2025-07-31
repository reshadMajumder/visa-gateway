from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from .serializers import VisaTypeSerializer, CountrySerializer, DetailedVisaTypeSerializer, VisaApplicationSerializer,UserVisaApplicationSerializer
from .models import VisaType, Country, VisaApplication, RequiredDocuments, ApplicationDocument
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
                serializer = CountrySerializer(country, context={'request': request})
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
            serializer = CountrySerializer(countries, many=True, context={'request': request})
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
                serializer = DetailedVisaTypeSerializer(visa_type, context={'request': request})
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
                serializer = DetailedVisaTypeSerializer(visa_types, many=True, context={'request': request})
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
    """
    permission_classes = (IsAuthenticated,)
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        # Pass request in the context
        serializer = VisaApplicationSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            try:
                visa_application = serializer.save()
                message = "Visa application created successfully"
                if request.data.get('required_documents_files'):
                    message += " with all required documents"
                else:
                    message += " (draft - documents can be uploaded later)"
                
                return Response({
                    "message": message,
                    "application": VisaApplicationSerializer(visa_application).data
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    "error": "Failed to create visa application",
                    "details": str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, application_id=None):
        """Update application with documents"""
        if not application_id:
            return Response({"error": "Application ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            application = VisaApplication.objects.get(id=application_id, user=request.user)
        except VisaApplication.DoesNotExist:
            return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)
        
        files_json = request.data.get('required_documents_files', '')
        if not files_json:
            return Response({"error": "No documents provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Parse the JSON string
            import json
            files = json.loads(files_json)
            
            # Get required documents for this visa type
            required_docs = application.visa_type.required_documents.all()
            
            # Validate all required documents are provided
            if len(files) != required_docs.count():
                return Response({
                    "error": f"You must upload all required documents. Expected {required_docs.count()} documents, got {len(files)}."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check that all required doc IDs are present
            file_doc_ids = {int(f['required_document_id']) for f in files if 'required_document_id' in f}
            required_doc_ids = {doc.id for doc in required_docs}
            
            if file_doc_ids != required_doc_ids:
                missing_docs = required_doc_ids - file_doc_ids
                return Response({
                    "error": f"Missing required documents: {[RequiredDocuments.objects.get(id=doc_id).document_name for doc_id in missing_docs]}"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create or update ApplicationDocument for each required document
            for file_info in files:
                required_document_id = file_info['required_document_id']
                file_key = f"file_{required_document_id}"
                file = request.FILES.get(file_key)
                
                if not file:
                    return Response({
                        "error": f"File not found for document ID {required_document_id}"
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                required_document = RequiredDocuments.objects.get(id=required_document_id)
                
                # Check if document already exists
                existing_doc = ApplicationDocument.objects.filter(
                    application=application,
                    required_document=required_document
                ).first()
                
                if existing_doc:
                    # Update existing document
                    existing_doc.file = file
                    existing_doc.status = 'pending'
                    existing_doc.rejection_reason = ''
                    existing_doc.save()
                else:
                    # Create new document
                    ApplicationDocument.objects.create(
                        application=application,
                        required_document=required_document,
                        file=file,
                        status='pending'
                    )
            
            # Update application status to submitted
            application.status = 'submitted'
            application.save()
            
            return Response({
                "message": "Application updated successfully with all required documents",
                "application": VisaApplicationSerializer(application).data
            }, status=status.HTTP_200_OK)
            
        except json.JSONDecodeError:
            return Response({
                "error": "Invalid JSON format for required_documents_files"
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                "error": "Failed to update application",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request, application_id=None):
        """Get all visa applications or specific application for the logged-in user with documents"""
        if application_id:
            try:
                visa_application = VisaApplication.objects.filter(
                    id=application_id, 
                    user=request.user
                ).select_related(
                    'country', 'visa_type', 'user'
                ).prefetch_related('documents__required_document').first()
                
                if not visa_application:
                    return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)
                
                serializer = VisaApplicationSerializer(visa_application)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            """Get all visa applications for the logged-in user with documents"""
            visa_applications = VisaApplication.objects.filter(user=request.user).select_related(
                'country', 'visa_type', 'user'
            ).prefetch_related('documents__required_document')
            serializer = VisaApplicationSerializer(visa_applications, many=True)
            return Response({"message":"Applications fetched successfully", "Applications:":serializer.data}, status=status.HTTP_200_OK)



class UserVisaApplicationView(APIView):

    def get(self, request, application_id=None):
        """Get all visa applications or specific application for the logged-in user with documents"""
        if application_id:
            try:
                visa_application = VisaApplication.objects.filter(
                    id=application_id, 
                    user=request.user
                ).select_related(
                    'country', 'visa_type', 'user'
                ).prefetch_related('documents__required_document').first()
                
                if not visa_application:
                    return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)
                
                serializer = UserVisaApplicationSerializer(visa_application)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            """Get all visa applications for the logged-in user with documents"""
            visa_applications = VisaApplication.objects.filter(user=request.user).select_related(
                'country', 'visa_type', 'user'
            ).prefetch_related('documents__required_document')
            serializer = UserVisaApplicationSerializer(visa_applications, many=True)
            return Response({"message":"Applications fetched successfully", "Applications:":serializer.data}, status=status.HTTP_200_OK)
