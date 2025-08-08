from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.permissions import AllowAny
from .permissions import IsSuperUser
from rest_framework.parsers import MultiPartParser, FormParser

from django.shortcuts import get_object_or_404
from visa_setup.models import Notes, VisaProcess, VisaOverview, RequiredDocuments,Country, VisaType,VisaApplication,ApplicationDocument
from .serializers import (
    AdminUserSerializer,
    NotesSerializer,
    VisaProcessSerializer,
    VisaOverviewSerializer,
    RequiredDocumentsSerializer,
    CountrySerializer, VisaTypeSerializer, CountryVisaTypeSerializer,
    UserVisaApplicationSerializer
)

class AdminLoginView(APIView):
    """
    Allows only superusers to log in.
    """
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = AdminUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "email": user.email,
                "username": user.username,
                "is_superuser": user.is_superuser
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminLogoutView(APIView):
    """
    Log out by blacklisting the refresh token.
    """
    # permission_classes = [permissions.IsAuthenticated]
    permission_classes = [IsSuperUser]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Invalid token or already blacklisted."}, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get("refresh", None)

        if not refresh_token:
            return Response({"error": "Refresh token required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            new_access_token = str(token.access_token)
            return Response({
                "access": new_access_token
            }, status=status.HTTP_200_OK)
        except TokenError as e:
            return Response({"error": "Invalid or expired refresh token."}, status=status.HTTP_400_BAD_REQUEST)



# Utility function
def get_object_or_404_custom(model, pk):
    from django.shortcuts import get_object_or_404
    return get_object_or_404(model, pk=pk)

# --- Notes Views ---
class NotesView(APIView):
    permission_classes = [IsSuperUser]

    def get(self, request):
        notes = Notes.objects.all()
        serializer = NotesSerializer(notes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = NotesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NotesDetailView(APIView):
    permission_classes = [IsSuperUser]

    def get(self, request, pk):
        note = get_object_or_404_custom(Notes, pk)
        serializer = NotesSerializer(note)
        return Response(serializer.data)

    def put(self, request, pk):
        note = get_object_or_404_custom(Notes, pk)
        serializer = NotesSerializer(note, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        note = get_object_or_404_custom(Notes, pk)
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# --- VisaProcess Views ---
class VisaProcessView(APIView):
    permission_classes = [IsSuperUser]

    def get(self, request):
        items = VisaProcess.objects.all()
        serializer = VisaProcessSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = VisaProcessSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VisaProcessDetailView(APIView):
    permission_classes = [IsSuperUser]

    def get(self, request, pk):
        item = get_object_or_404_custom(VisaProcess, pk)
        serializer = VisaProcessSerializer(item)
        return Response(serializer.data)

    def put(self, request, pk):
        item = get_object_or_404_custom(VisaProcess, pk)
        serializer = VisaProcessSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        item = get_object_or_404_custom(VisaProcess, pk)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# --- VisaOverview Views ---
class VisaOverviewView(APIView):
    permission_classes = [IsSuperUser]

    def get(self, request):
        items = VisaOverview.objects.all()
        serializer = VisaOverviewSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = VisaOverviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VisaOverviewDetailView(APIView):
    permission_classes = [IsSuperUser]

    def get(self, request, pk):
        item = get_object_or_404_custom(VisaOverview, pk)
        serializer = VisaOverviewSerializer(item)
        return Response(serializer.data)

    def put(self, request, pk):
        item = get_object_or_404_custom(VisaOverview, pk)
        serializer = VisaOverviewSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        item = get_object_or_404_custom(VisaOverview, pk)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# --- RequiredDocuments Views ---
class RequiredDocumentsView(APIView):
    permission_classes = [IsSuperUser]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        docs = RequiredDocuments.objects.all()
        serializer = RequiredDocumentsSerializer(docs, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Handle document file upload if provided
        data = request.data.copy()
        if 'document_file' in request.FILES:
            try:
                from core.supabase_client import upload_file_to_supabase
                document_file = request.FILES['document_file']
                
                # Validate file
                if document_file.size > 1024 * 1024 * 10:  # 10MB limit for documents
                    return Response({'error': 'File size cannot exceed 10MB'}, status=status.HTTP_400_BAD_REQUEST)
                
                allowed_extensions = ['.pdf', '.docx', '.doc', '.jpg', '.jpeg', '.png']
                if not any(document_file.name.lower().endswith(ext) for ext in allowed_extensions):
                    return Response({'error': 'File type not allowed. Use PDF, DOCX, DOC, JPG, JPEG, or PNG'}, status=status.HTTP_400_BAD_REQUEST)
                
                # Upload to Supabase
                file_url = upload_file_to_supabase(document_file, folder="documents")
                data['document_file'] = file_url
                
            except Exception as e:
                return Response({'error': f'Failed to upload file: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = RequiredDocumentsSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RequiredDocumentsDetailView(APIView):
    permission_classes = [IsSuperUser]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, pk):
        doc = get_object_or_404_custom(RequiredDocuments, pk)
        serializer = RequiredDocumentsSerializer(doc)
        return Response(serializer.data)

    def put(self, request, pk):
        doc = get_object_or_404_custom(RequiredDocuments, pk)
        
        # Handle document file upload if provided
        data = request.data.copy()
        if 'document_file' in request.FILES:
            try:
                from core.supabase_client import upload_file_to_supabase
                document_file = request.FILES['document_file']
                
                # Validate file
                if document_file.size > 1024 * 1024 * 10:  # 10MB limit for documents
                    return Response({'error': 'File size cannot exceed 10MB'}, status=status.HTTP_400_BAD_REQUEST)
                
                allowed_extensions = ['.pdf', '.docx', '.doc', '.jpg', '.jpeg', '.png']
                if not any(document_file.name.lower().endswith(ext) for ext in allowed_extensions):
                    return Response({'error': 'File type not allowed. Use PDF, DOCX, DOC, JPG, JPEG, or PNG'}, status=status.HTTP_400_BAD_REQUEST)
                
                # Upload to Supabase
                file_url = upload_file_to_supabase(document_file, folder="documents")
                data['document_file'] = file_url
                
            except Exception as e:
                return Response({'error': f'Failed to upload file: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = RequiredDocumentsSerializer(doc, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        doc = get_object_or_404_custom(RequiredDocuments, pk)
        doc.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)




# ---------------- Country ----------------

class CountryListCreateView(APIView):
    permission_classes = [IsSuperUser]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        countries = Country.objects.all()
        serializer = CountrySerializer(countries, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Handle image upload if provided
        data = request.data.copy()
        if 'image' in request.FILES:
            try:
                from core.supabase_client import upload_file_to_supabase
                image_file = request.FILES['image']
                
                # Validate image file
                if image_file.size > 1024 * 1024 * 5:  # 5MB limit for images
                    return Response({'error': 'Image size cannot exceed 5MB'}, status=status.HTTP_400_BAD_REQUEST)
                
                allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif']
                if not any(image_file.name.lower().endswith(ext) for ext in allowed_extensions):
                    return Response({'error': 'Image type not allowed. Use JPG, JPEG, PNG, or GIF'}, status=status.HTTP_400_BAD_REQUEST)
                
                # Upload to Supabase
                image_url = upload_file_to_supabase(image_file, folder="countries")
                data['image'] = image_url
                
            except Exception as e:
                return Response({'error': f'Failed to upload image: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = CountrySerializer(data=data)
        if serializer.is_valid():
            country = serializer.save()
            return Response(CountrySerializer(country).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CountryDetailView(APIView):
    permission_classes = [IsSuperUser]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, pk):
        country = get_object_or_404(Country, pk=pk)
        return Response(CountrySerializer(country).data)

    def put(self, request, pk):
        country = get_object_or_404(Country, pk=pk)
        
        # Handle image upload if provided
        data = request.data.copy()
        if 'image' in request.FILES:
            try:
                from core.supabase_client import upload_file_to_supabase
                image_file = request.FILES['image']
                
                # Validate image file
                if image_file.size > 1024 * 1024 * 5:  # 5MB limit for images
                    return Response({'error': 'Image size cannot exceed 5MB'}, status=status.HTTP_400_BAD_REQUEST)
                
                allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif']
                if not any(image_file.name.lower().endswith(ext) for ext in allowed_extensions):
                    return Response({'error': 'Image type not allowed. Use JPG, JPEG, PNG, or GIF'}, status=status.HTTP_400_BAD_REQUEST)
                
                # Upload to Supabase
                image_url = upload_file_to_supabase(image_file, folder="countries")
                data['image'] = image_url
                
            except Exception as e:
                return Response({'error': f'Failed to upload image: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = CountrySerializer(country, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(CountrySerializer(country).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        country = get_object_or_404(Country, pk=pk)
        country.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ---------------- VisaType ----------------

class VisaTypeListCreateView(APIView):
    permission_classes = [IsSuperUser]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        visatypes = VisaType.objects.all()
        serializer = VisaTypeSerializer(visatypes, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Handle image upload if provided
        data = request.data.copy()
        if 'image' in request.FILES:
            try:
                from core.supabase_client import upload_file_to_supabase
                image_file = request.FILES['image']
                
                # Validate image file
                if image_file.size > 1024 * 1024 * 5:  # 5MB limit for images
                    return Response({'error': 'Image size cannot exceed 5MB'}, status=status.HTTP_400_BAD_REQUEST)
                
                allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif']
                if not any(image_file.name.lower().endswith(ext) for ext in allowed_extensions):
                    return Response({'error': 'Image type not allowed. Use JPG, JPEG, PNG, or GIF'}, status=status.HTTP_400_BAD_REQUEST)
                
                # Upload to Supabase
                image_url = upload_file_to_supabase(image_file, folder="visa_types")
                data['image'] = image_url
                
            except Exception as e:
                return Response({'error': f'Failed to upload image: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = VisaTypeSerializer(data=data)
        if serializer.is_valid():
            visa_type = serializer.save()
            return Response(VisaTypeSerializer(visa_type).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VisaTypeDetailView(APIView):
    permission_classes = [IsSuperUser]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, pk):
        visa_type = get_object_or_404(VisaType, pk=pk)
        return Response(VisaTypeSerializer(visa_type).data)

    def put(self, request, pk):
        visa_type = get_object_or_404(VisaType, pk=pk)
        
        # Handle image upload if provided
        data = request.data.copy()
        if 'image' in request.FILES:
            try:
                from core.supabase_client import upload_file_to_supabase
                image_file = request.FILES['image']
                
                # Validate image file
                if image_file.size > 1024 * 1024 * 5:  # 5MB limit for images
                    return Response({'error': 'Image size cannot exceed 5MB'}, status=status.HTTP_400_BAD_REQUEST)
                
                allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif']
                if not any(image_file.name.lower().endswith(ext) for ext in allowed_extensions):
                    return Response({'error': 'Image type not allowed. Use JPG, JPEG, PNG, or GIF'}, status=status.HTTP_400_BAD_REQUEST)
                
                # Upload to Supabase
                image_url = upload_file_to_supabase(image_file, folder="visa_types")
                data['image'] = image_url
                
            except Exception as e:
                return Response({'error': f'Failed to upload image: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = VisaTypeSerializer(visa_type, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(VisaTypeSerializer(visa_type).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        visa_type = get_object_or_404(VisaType, pk=pk)
        visa_type.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ---------------- Country Visa Types ----------------

class CountryVisaTypesView(APIView):
    permission_classes = [IsSuperUser]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, country_id):
        """Get all visa types for a specific country"""
        country = get_object_or_404(Country, pk=country_id)
        visa_types = country.types.all()
        serializer = VisaTypeSerializer(visa_types, many=True)
        return Response(serializer.data)

    def post(self, request, country_id):
        """Create a new visa type and associate it with the country"""
        country = get_object_or_404(Country, pk=country_id)
        
        # Handle image upload if provided
        data = request.data.copy()
        if 'image' in request.FILES:
            try:
                from core.supabase_client import upload_file_to_supabase
                image_file = request.FILES['image']
                
                # Validate image file
                if image_file.size > 1024 * 1024 * 5:  # 5MB limit for images
                    return Response({'error': 'Image size cannot exceed 5MB'}, status=status.HTTP_400_BAD_REQUEST)
                
                allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif']
                if not any(image_file.name.lower().endswith(ext) for ext in allowed_extensions):
                    return Response({'error': 'Image type not allowed. Use JPG, JPEG, PNG, or GIF'}, status=status.HTTP_400_BAD_REQUEST)
                
                # Upload to Supabase
                image_url = upload_file_to_supabase(image_file, folder="visa_types")
                data['image'] = image_url
                
            except Exception as e:
                return Response({'error': f'Failed to upload image: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = CountryVisaTypeSerializer(data=data)
        if serializer.is_valid():
            visa_type = serializer.save()
            # Associate the visa type with the country
            country.types.add(visa_type)
            return Response(VisaTypeSerializer(visa_type).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CountryVisaTypeDetailView(APIView):
    permission_classes = [IsSuperUser]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, country_id, visa_type_id):
        """Get a specific visa type for a country"""
        country = get_object_or_404(Country, pk=country_id)
        visa_type = get_object_or_404(VisaType, pk=visa_type_id)
        
        # Check if the visa type belongs to the country
        if visa_type not in country.types.all():
            return Response({"error": "Visa type not found for this country"}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(VisaTypeSerializer(visa_type).data)

    def put(self, request, country_id, visa_type_id):
        """Update a visa type for a country"""
        country = get_object_or_404(Country, pk=country_id)
        visa_type = get_object_or_404(VisaType, pk=visa_type_id)
        
        # Check if the visa type belongs to the country
        if visa_type not in country.types.all():
            return Response({"error": "Visa type not found for this country"}, status=status.HTTP_404_NOT_FOUND)
        
        # Handle image upload if provided
        if 'image' in request.FILES:
            try:
                from core.supabase_client import upload_file_to_supabase
                image_file = request.FILES['image']
                
                # Validate image file
                if image_file.size > 1024 * 1024 * 5:  # 5MB limit for images
                    return Response({'error': 'Image size cannot exceed 5MB'}, status=status.HTTP_400_BAD_REQUEST)
                
                allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif']
                if not any(image_file.name.lower().endswith(ext) for ext in allowed_extensions):
                    return Response({'error': 'Image type not allowed. Use JPG, JPEG, PNG, or GIF'}, status=status.HTTP_400_BAD_REQUEST)
                
                # Upload to Supabase
                image_url = upload_file_to_supabase(image_file, folder="visa_types")
                request.data._mutable = True
                request.data['image'] = image_url
                request.data._mutable = False
                
            except Exception as e:
                return Response({'error': f'Failed to upload image: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = VisaTypeSerializer(visa_type, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(VisaTypeSerializer(visa_type).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, country_id, visa_type_id):
        """Remove a visa type from a country (but don't delete the visa type itself)"""
        country = get_object_or_404(Country, pk=country_id)
        visa_type = get_object_or_404(VisaType, pk=visa_type_id)
        
        # Check if the visa type belongs to the country
        if visa_type not in country.types.all():
            return Response({"error": "Visa type not found for this country"}, status=status.HTTP_404_NOT_FOUND)
        
        # Remove the visa type from the country
        country.types.remove(visa_type)
        return Response(status=status.HTTP_204_NO_CONTENT)


# ---------------- Utility Views for Admin Interface ----------------

class VisaTypeFormDataView(APIView):
    """Get all available data for creating/editing visa types"""
    permission_classes = [IsSuperUser]

    def get(self, request):
        """Get all available processes, overviews, notes, and documents for visa type creation"""
        data = {
            'processes': VisaProcessSerializer(VisaProcess.objects.all(), many=True).data,
            'overviews': VisaOverviewSerializer(VisaOverview.objects.all(), many=True).data,
            'notes': NotesSerializer(Notes.objects.all(), many=True).data,
            'required_documents': RequiredDocumentsSerializer(RequiredDocuments.objects.all(), many=True).data,
        }
        return Response(data)


class CountryFormDataView(APIView):
    """Get all available data for creating/editing countries"""
    permission_classes = [IsSuperUser]

    def get(self, request):
        """Get all available visa types for country creation"""
        data = {
            'visa_types': VisaTypeSerializer(VisaType.objects.all(), many=True).data,
        }
        return Response(data)


class CountriesWithVisaTypesView(APIView):
    """Get all countries with their visa types in a nested format"""
    permission_classes = [IsSuperUser]

    def get(self, request):
        """Get all countries with their associated visa types"""
        countries = Country.objects.prefetch_related('types').all()
        serializer = CountrySerializer(countries, many=True)
        return Response(serializer.data)


class BulkVisaTypeAssignmentView(APIView):
    """Bulk assign visa types to a country"""
    permission_classes = [IsSuperUser]

    def post(self, request, country_id):
        """Assign multiple visa types to a country at once"""
        country = get_object_or_404(Country, pk=country_id)
        visa_type_ids = request.data.get('visa_type_ids', '')
        
        if not visa_type_ids:
            return Response({"error": "visa_type_ids is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Handle string input for visa_type_ids (form-data)
        try:
            if isinstance(visa_type_ids, str):
                ids = [int(x.strip()) for x in visa_type_ids.split(',') if x.strip()]
            else:
                ids = visa_type_ids
            
            visa_types = VisaType.objects.filter(id__in=ids)
            country.types.add(*visa_types)
            return Response({
                "message": f"Successfully assigned {len(visa_types)} visa types to {country.name}",
                "assigned_count": len(visa_types)
            }, status=status.HTTP_200_OK)
        except ValueError:
            return Response({"error": "Invalid visa_type_ids format. Use comma-separated integers."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)





class UserVisaApplicationView(APIView):
    permission_classes = [IsSuperUser]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, application_id=None):
        """Get all visa applications or specific application for admin with documents"""
        if application_id:
            try:
                visa_application = VisaApplication.objects.filter(
                    id=application_id
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
            """Get all visa applications for admin with documents"""
            visa_applications = VisaApplication.objects.all().select_related(
                'country', 'visa_type', 'user'
            ).prefetch_related('documents__required_document').order_by('-created_at')
            serializer = UserVisaApplicationSerializer(visa_applications, many=True)
            return Response({"message":"Applications fetched successfully", "Applications":serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = UserVisaApplicationSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            visa_application = serializer.save()
            return Response({
                "message": "Application created successfully",
                "Application": UserVisaApplicationSerializer(visa_application).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, application_id=None):
        """Update application status, admin notes, rejection reason, and/or documents"""
        if not application_id:
            return Response({'error': 'Application ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            app = VisaApplication.objects.get(pk=application_id)
        except VisaApplication.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

        updated = False
        update_data = {}

        # Handle form data updates (status, admin_notes, rejection_reason)
        if 'status' in request.data:
            update_data['status'] = request.data['status']
            updated = True
        
        if 'admin_notes' in request.data:
            update_data['admin_notes'] = request.data['admin_notes']
            updated = True
        
        if 'rejection_reason' in request.data:
            update_data['rejection_reason'] = request.data['rejection_reason']
            updated = True

        # Update application fields if provided
        if update_data:
            for field, value in update_data.items():
                setattr(app, field, value)
            app.save()

        # Handle individual document status and notes updates
        for key, value in request.data.items():
            if key.startswith("document_status["):
                try:
                    doc_id = int(key.split("[")[1].split("]")[0])
                    # Find the ApplicationDocument for this required document
                    try:
                        app_doc = ApplicationDocument.objects.get(
                            application=app,
                            required_document_id=doc_id
                        )
                        app_doc.status = value
                        app_doc.save()
                        updated = True
                    except ApplicationDocument.DoesNotExist:
                        # Document not uploaded yet, skip status update
                        continue
                except (IndexError, ValueError):
                    continue

            elif key.startswith("document_admin_notes["):
                try:
                    doc_id = int(key.split("[")[1].split("]")[0])
                    # Find the ApplicationDocument for this required document
                    try:
                        app_doc = ApplicationDocument.objects.get(
                            application=app,
                            required_document_id=doc_id
                        )
                        app_doc.admin_notes = value
                        app_doc.save()
                        updated = True
                    except ApplicationDocument.DoesNotExist:
                        # Document not uploaded yet, skip notes update
                        continue
                except (IndexError, ValueError):
                    continue

            elif key.startswith("document_rejection_reason["):
                try:
                    doc_id = int(key.split("[")[1].split("]")[0])
                    # Find the ApplicationDocument for this required document
                    try:
                        app_doc = ApplicationDocument.objects.get(
                            application=app,
                            required_document_id=doc_id
                        )
                        app_doc.rejection_reason = value
                        app_doc.save()
                        updated = True
                    except ApplicationDocument.DoesNotExist:
                        # Document not uploaded yet, skip rejection reason update
                        continue
                except (IndexError, ValueError):
                    continue

        # Handle file uploads
        for key in request.FILES:
            if key.startswith("required_documents["):
                try:
                    doc_id = int(key.split("[")[1].split("]")[0])
                except (IndexError, ValueError):
                    continue  # skip invalid keys

                file = request.FILES[key]

                # Validate file size and type
                if file.size > 1024 * 1024 * 10:  # 10MB limit
                    return Response({'error': 'File size cannot exceed 10MB'}, status=status.HTTP_400_BAD_REQUEST)
                
                allowed_extensions = ['.pdf', '.docx', '.doc', '.jpg', '.jpeg', '.png']
                if not any(file.name.lower().endswith(ext) for ext in allowed_extensions):
                    return Response({'error': 'File type not allowed. Use PDF, DOCX, DOC, JPG, JPEG, or PNG'}, status=status.HTTP_400_BAD_REQUEST)

                try:
                    required_doc = RequiredDocuments.objects.get(id=doc_id)
                except RequiredDocuments.DoesNotExist:
                    return Response({'error': f'Required document with ID {doc_id} does not exist'}, status=status.HTTP_404_NOT_FOUND)

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
            return Response({
                'message': 'Application updated successfully',
                'application': UserVisaApplicationSerializer(app).data
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'No valid data provided for update'}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, application_id=None):
        """Delete a visa application"""
        if not application_id:
            return Response({'error': 'Application ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            app = VisaApplication.objects.get(pk=application_id)
            app.delete()
            return Response({'message': 'Application deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except VisaApplication.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'Error deleting application: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



