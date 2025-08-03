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
    CountrySerializer, VisaTypeSerializer
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
