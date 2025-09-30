from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from .serializers import ConsultationSerializer, SettingsSerializer, VisaTypeSerializer, CountrySerializer, DetailedVisaTypeSerializer, VisaApplicationSerializer,UserVisaApplicationSerializer,CountryDetailsSerializer
from .models import Settings, VisaType, Country, VisaApplication, RequiredDocuments, ApplicationDocument
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.cache import cache
from django.conf import settings
import logging

logger = logging.getLogger(__name__)



class CountryView(APIView):

    """
    API View to get the list of countries and individual country details.
    No authentication required.
    """
    permission_classes = [AllowAny]

    def get(self, request, id=None):
        if id:
            try:
                cache_key = f"country:{id}"
                country = cache.get(cache_key)
                if country is not None:
                    logger.info("Serving country %s from cache", id)
                if country is None:
                    country = Country.objects.filter(id=id, active=True).prefetch_related(
                        'types'
                    ).first()
                    cache.set(cache_key, country, getattr(settings, 'CACHE_DEFAULT_TTL', 300))
                    logger.info("Cached country %s", id)
                if not country:
                    return Response(
                        {"error": "Country not found"},
                        status=status.HTTP_404_NOT_FOUND
                    )
                serializer = CountryDetailsSerializer(country, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(
                    {"error": "Failed to fetch country", "details": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                ) 
        try:
            cache_key = "countries:active"
            countries = cache.get(cache_key)
            if countries is not None:
                logger.info("Serving countries list from cache")
            if countries is None:
                countries_qs = Country.objects.filter(active=True).prefetch_related(
                    'types'
                )
                countries_list = list(countries_qs)
                cache.set(cache_key, countries_list, getattr(settings, 'CACHE_DEFAULT_TTL', 300))
                for c in countries_list:
                    per_country_key = f"country:{c.id}"
                    cache.set(per_country_key, c, getattr(settings, 'CACHE_DEFAULT_TTL', 300))
                logger.info("Cached countries list and hydrated %d country detail entries", len(countries_list))
                countries = countries_list
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
                cache_key = f"visa_type:{id}"
                visa_type = cache.get(cache_key)
                if visa_type is not None:
                    logger.info("Serving visa type %s from cache", id)
                if visa_type is None:
                    visa_type = VisaType.objects.filter(id=id, active=True).prefetch_related(
                        'processes', 'overviews', 'notes', 'required_documents'
                    ).first()
                    cache.set(cache_key, visa_type, getattr(settings, 'CACHE_DEFAULT_TTL', 300))
                    logger.info("Cached visa type %s", id)
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
                cache_key = "visa_types:active"
                visa_types = cache.get(cache_key)
                if visa_types is not None:
                    logger.info("Serving visa types list from cache")
                if visa_types is None:
                    visa_types_qs = VisaType.objects.filter(active=True).prefetch_related(
                        'processes', 'overviews', 'notes', 'required_documents'
                    )
                    visa_types_list = list(visa_types_qs)
                    cache.set(cache_key, visa_types_list, getattr(settings, 'CACHE_DEFAULT_TTL', 300))
                    for vt in visa_types_list:
                        per_vt_key = f"visa_type:{vt.id}"
                        cache.set(per_vt_key, vt, getattr(settings, 'CACHE_DEFAULT_TTL', 300))
                    logger.info("Cached visa types list and hydrated %d visa type entries", len(visa_types_list))
                    visa_types = visa_types_list
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
            country_cache_key = f"country:{id}"
            country = cache.get(country_cache_key)
            if country is not None:
                logger.info("Serving country %s from cache (country lookup)", id)
            if country is None:
                country = Country.objects.filter(id=id, active=True).prefetch_related(
                    'types'
                ).first()
                cache.set(country_cache_key, country, getattr(settings, 'CACHE_DEFAULT_TTL', 300))
                logger.info("Cached country %s (country lookup)", id)
            if not country:
                return Response(
                    {"error": "Country not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            visa_types_cache_key = f"country:{id}:visa_types"
            visa_types = cache.get(visa_types_cache_key)
            if visa_types is not None:
                logger.info("Serving visa types for country %s from cache", id)
            if visa_types is None:
                visa_types = country.types.filter(active=True).prefetch_related(
                    'processes', 'overviews', 'notes', 'required_documents'
                )
                cache.set(visa_types_cache_key, list(visa_types), getattr(settings, 'CACHE_DEFAULT_TTL', 300))
                logger.info("Cached visa types for country %s", id)
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
                    try:
                        from core.supabase_client import upload_file_to_supabase
                        file_url = upload_file_to_supabase(file)
                        existing_doc.file = file_url
                    except Exception as e:
                        # Fallback: keep existing file or set to None
                        existing_doc.file = None
                    
                    existing_doc.status = 'pending'
                    existing_doc.rejection_reason = ''
                    existing_doc.save()
                else:
                    # Create new document
                    try:
                        from core.supabase_client import upload_file_to_supabase
                        file_url = upload_file_to_supabase(file)
                        
                        ApplicationDocument.objects.create(
                            application=application,
                            required_document=required_document,
                            file=file_url,
                            status='pending'
                        )
                    except Exception as e:
                        # Fallback: create without file URL
                        ApplicationDocument.objects.create(
                            application=application,
                            required_document=required_document,
                            file=None,
                            status='pending'
                        )
            
            # Update application status to submitted
            application.status = 'submitted'
            application.save()
            
            # Invalidate and warm user-specific caches
            user_cache_list_key = f"user:{request.user.id}:applications"
            user_cache_detail_key = f"user:{request.user.id}:application:{application_id}"
            cache.delete(user_cache_list_key)
            cache.delete(user_cache_detail_key)
            # Warm detail
            application_refreshed = VisaApplication.objects.filter(id=application_id, user=request.user).select_related('country', 'visa_type', 'user').prefetch_related('documents__required_document').first()
            if application_refreshed:
                data_detail = VisaApplicationSerializer(application_refreshed).data
                cache.set(user_cache_detail_key, data_detail, getattr(settings, 'CACHE_DEFAULT_TTL', 300))
            # Warm list
            applications_qs = VisaApplication.objects.filter(user=request.user).select_related('country', 'visa_type', 'user').prefetch_related('documents__required_document')
            data_list = VisaApplicationSerializer(applications_qs, many=True).data
            cache.set(user_cache_list_key, data_list, getattr(settings, 'CACHE_DEFAULT_TTL', 300))
            logger.info("Invalidated and rewarmed cache keys: %s, %s", user_cache_list_key, user_cache_detail_key)

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
                cache_key = f"user:{request.user.id}:application:{application_id}"
                cached = cache.get(cache_key)
                if cached is not None:
                    logger.info("Serving user application %s from cache for user %s", application_id, request.user.id)
                    return Response(cached, status=status.HTTP_200_OK)

                visa_application = VisaApplication.objects.filter(
                    id=application_id, 
                    user=request.user
                ).select_related(
                    'country', 'visa_type', 'user'
                ).prefetch_related('documents__required_document').first()
                
                if not visa_application:
                    return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)
                
                serializer = VisaApplicationSerializer(visa_application)
                data = serializer.data
                cache.set(cache_key, data, getattr(settings, 'CACHE_DEFAULT_TTL', 300))
                logger.info("Cached user application %s for user %s", application_id, request.user.id)
                return Response(data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            """Get all visa applications for the logged-in user with documents"""
            cache_key = f"user:{request.user.id}:applications"
            cached = cache.get(cache_key)
            if cached is not None:
                logger.info("Serving user applications list from cache for user %s", request.user.id)
                return Response({"message":"Applications fetched successfully", "Applications:": cached}, status=status.HTTP_200_OK)

            visa_applications = VisaApplication.objects.filter(user=request.user).select_related(
                'country', 'visa_type', 'user'
            ).prefetch_related('documents__required_document')
            serializer = VisaApplicationSerializer(visa_applications, many=True)
            data = serializer.data
            cache.set(cache_key, data, getattr(settings, 'CACHE_DEFAULT_TTL', 300))
            logger.info("Cached user applications list for user %s", request.user.id)
            return Response({"message":"Applications fetched successfully", "Applications:": data}, status=status.HTTP_200_OK)



class UserVisaApplicationView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, application_id=None):
        """Get all visa applications or specific application for the logged-in user with documents"""
        if application_id:
            try:
                cache_key = f"user:{request.user.id}:application:{application_id}"
                cached = cache.get(cache_key)
                if cached is not None:
                    logger.info("Serving v2 user application %s from cache for user %s", application_id, request.user.id)
                    return Response(cached, status=status.HTTP_200_OK)

                visa_application = VisaApplication.objects.filter(
                    id=application_id, 
                    user=request.user
                ).select_related(
                    'country', 'visa_type', 'user'
                ).prefetch_related('documents__required_document').first()
                
                if not visa_application:
                    return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)
                
                serializer = UserVisaApplicationSerializer(visa_application)
                data = serializer.data
                cache.set(cache_key, data, getattr(settings, 'CACHE_DEFAULT_TTL', 300))
                logger.info("Cached v2 user application %s for user %s", application_id, request.user.id)
                return Response(data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            """Get all visa applications for the logged-in user with documents"""
            cache_key = f"user:{request.user.id}:applications"
            cached = cache.get(cache_key)
            if cached is not None:
                logger.info("Serving v2 user applications list from cache for user %s", request.user.id)
                return Response({"message":"Applications fetched successfully", "Applications:":cached}, status=status.HTTP_200_OK)

            visa_applications = VisaApplication.objects.filter(user=request.user).select_related(
                'country', 'visa_type', 'user'
            ).prefetch_related('documents__required_document')
            serializer = UserVisaApplicationSerializer(visa_applications, many=True)
            data = serializer.data
            cache.set(cache_key, data, getattr(settings, 'CACHE_DEFAULT_TTL', 300))
            logger.info("Cached v2 user applications list for user %s", request.user.id)
            return Response({"message":"Applications fetched successfully", "Applications:":data}, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = UserVisaApplicationSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            visa_application = serializer.save()
            list_key = f"user:{request.user.id}:applications"
            detail_key = f"user:{request.user.id}:application:{visa_application.id}"
            cache.delete(list_key)
            cache.delete(detail_key)
            # Warm detail and list
            data_detail = UserVisaApplicationSerializer(visa_application).data
            cache.set(detail_key, data_detail, getattr(settings, 'CACHE_DEFAULT_TTL', 300))
            apps_qs = VisaApplication.objects.filter(user=request.user).select_related('country', 'visa_type', 'user').prefetch_related('documents__required_document')
            data_list = UserVisaApplicationSerializer(apps_qs, many=True).data
            cache.set(list_key, data_list, getattr(settings, 'CACHE_DEFAULT_TTL', 300))
            logger.info("Invalidated and rewarmed v2 cache keys after create: %s, %s", list_key, detail_key)
            return Response({
                "message": "Application created successfully",
                "Application": UserVisaApplicationSerializer(visa_application).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, application_id=None):
        try:
            app = VisaApplication.objects.get(pk=application_id, user=request.user)
        except VisaApplication.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

        updated = False

        for key in request.FILES:
            if key.startswith("required_documents["):
                try:
                    doc_id = int(key.split("[")[1].split("]")[0])
                except (IndexError, ValueError):
                    continue  # skip invalid keys

                file = request.FILES[key]

                try:
                    required_doc = RequiredDocuments.objects.get(id=doc_id)
                except RequiredDocuments.DoesNotExist:
                    return Response({'error': f'Required document with ID {doc_id} does not exist'}, status=404)

                # Upload to Supabase
                try:
                    from core.supabase_client import upload_file_to_supabase
                    file_url = upload_file_to_supabase(file)
                    
                    # Update or create ApplicationDocument with Supabase URL
                    app_doc, created = ApplicationDocument.objects.get_or_create(
                        application=app,
                        required_document=required_doc,
                        defaults={'file': file_url}
                    )

                    if not created:
                        app_doc.file = file_url
                        app_doc.status = 'pending'  # Reset status after upload
                        app_doc.admin_notes = ''
                        app_doc.rejection_reason = ''
                        app_doc.save()
                        
                except Exception as e:
                    # Fallback to local storage if Supabase upload fails
                    app_doc, created = ApplicationDocument.objects.get_or_create(
                        application=app,
                        required_document=required_doc,
                        defaults={'file': None}
                    )

                    if not created:
                        app_doc.file = None
                        app_doc.status = 'pending'  # Reset status after upload
                        app_doc.admin_notes = ''
                        app_doc.rejection_reason = ''
                        app_doc.save()

                updated = True

        if updated:
            return Response({'message': 'Document(s) updated successfully'}, status=200)
        else:
            return Response({'error': 'No valid document found to update'}, status=400)


# lets implement book a consultation 
class BookConsultationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ConsultationSerializer(data=request.data)
        if serializer.is_valid():
            consultation = serializer.save()
            return Response({
                "message": "Consultation booked successfully, our team will contact you soon",
                "consultation": ConsultationSerializer(consultation).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class SettingsView(APIView):
    
    permission_classes = [AllowAny]

    def get(self, request):
        cache_key = "settings"
        cached = cache.get(cache_key)
        if cached is not None:
            logger.info("Serving settings from cache")
            return Response(cached, status=status.HTTP_200_OK)

        try:
            site_settings = Settings.objects.first()
            if not site_settings:
                return Response({"error": "Settings not configured"}, status=status.HTTP_404_NOT_FOUND)
            serializer = SettingsSerializer(site_settings)
            data = serializer.data
            cache_timeout = getattr(settings, 'CACHE_DEFAULT_TTL', 300)
            cache.set(cache_key, data, cache_timeout)
            logger.info("Cached settings")
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

