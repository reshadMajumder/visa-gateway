from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.permissions import AllowAny
from .permissions import IsSuperUser

from django.shortcuts import get_object_or_404
from visa_setup.models import Notes, VisaProcess, VisaOverview, RequiredDocuments,Country, VisaType
from .serializers import (
    AdminUserSerializer,
    NotesSerializer,
    VisaProcessSerializer,
    VisaOverviewSerializer,
    RequiredDocumentsSerializer,
    CountrySerializer, VisaTypeSerializer, CountryVisaTypeSerializer
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

    def get(self, request):
        docs = RequiredDocuments.objects.all()
        serializer = RequiredDocumentsSerializer(docs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = RequiredDocumentsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RequiredDocumentsDetailView(APIView):
    permission_classes = [IsSuperUser]

    def get(self, request, pk):
        doc = get_object_or_404_custom(RequiredDocuments, pk)
        serializer = RequiredDocumentsSerializer(doc)
        return Response(serializer.data)

    def put(self, request, pk):
        doc = get_object_or_404_custom(RequiredDocuments, pk)
        serializer = RequiredDocumentsSerializer(doc, data=request.data,partial=True)
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

    def get(self, request):
        countries = Country.objects.all()
        serializer = CountrySerializer(countries, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CountrySerializer(data=request.data)
        if serializer.is_valid():
            country = serializer.save()
            return Response(CountrySerializer(country).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CountryDetailView(APIView):
    permission_classes = [IsSuperUser]

    def get(self, request, pk):
        country = get_object_or_404(Country, pk=pk)
        return Response(CountrySerializer(country).data)

    def put(self, request, pk):
        country = get_object_or_404(Country, pk=pk)
        serializer = CountrySerializer(country, data=request.data, partial=True)
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

    def get(self, request):
        visatypes = VisaType.objects.all()
        serializer = VisaTypeSerializer(visatypes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = VisaTypeSerializer(data=request.data)
        if serializer.is_valid():
            visa_type = serializer.save()
            return Response(VisaTypeSerializer(visa_type).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VisaTypeDetailView(APIView):
    permission_classes = [IsSuperUser]

    def get(self, request, pk):
        visa_type = get_object_or_404(VisaType, pk=pk)
        return Response(VisaTypeSerializer(visa_type).data)

    def put(self, request, pk):
        visa_type = get_object_or_404(VisaType, pk=pk)
        serializer = VisaTypeSerializer(visa_type, data=request.data, partial=True)
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

    def get(self, request, country_id):
        """Get all visa types for a specific country"""
        country = get_object_or_404(Country, pk=country_id)
        visa_types = country.types.all()
        serializer = VisaTypeSerializer(visa_types, many=True)
        return Response(serializer.data)

    def post(self, request, country_id):
        """Create a new visa type and associate it with the country"""
        country = get_object_or_404(Country, pk=country_id)
        serializer = CountryVisaTypeSerializer(data=request.data)
        if serializer.is_valid():
            visa_type = serializer.save()
            # Associate the visa type with the country
            country.types.add(visa_type)
            return Response(VisaTypeSerializer(visa_type).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CountryVisaTypeDetailView(APIView):
    permission_classes = [IsSuperUser]

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
