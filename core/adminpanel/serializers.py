from rest_framework import serializers
from django.contrib.auth import authenticate
from accounts.models import User

from visa_setup.models import (
    VisaType, Country, VisaProcess, VisaOverview, Notes, 
    RequiredDocuments, VisaApplication, ApplicationDocument
)

class AdminUserSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        user = authenticate(email=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid credentials.")

        if not user.is_superuser:
            raise serializers.ValidationError("Only superusers can log in here.")

        data['user'] = user
        return data




class NotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notes
        fields = '__all__'

class VisaProcessSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisaProcess
        fields = '__all__'

class VisaOverviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisaOverview
        fields = '__all__'

class RequiredDocumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequiredDocuments
        fields = '__all__'





class VisaTypeSerializer(serializers.ModelSerializer):
    processes = VisaProcessSerializer(many=True, read_only=True)
    process_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=VisaProcess.objects.all(), write_only=True, required=False
    )

    overviews = VisaOverviewSerializer(many=True, read_only=True)
    overview_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=VisaOverview.objects.all(), write_only=True, required=False
    )

    notes = NotesSerializer(many=True, read_only=True)
    note_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Notes.objects.all(), write_only=True, required=False
    )

    required_documents = RequiredDocumentsSerializer(many=True, read_only=True)
    required_document_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=RequiredDocuments.objects.all(), write_only=True, required=False
    )

    class Meta:
        model = VisaType
        fields = '__all__'

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)

        # Optional many-to-many updates
        if 'process_ids' in validated_data:
            instance.processes.set(validated_data['process_ids'])
        if 'overview_ids' in validated_data:
            instance.overviews.set(validated_data['overview_ids'])
        if 'note_ids' in validated_data:
            instance.notes.set(validated_data['note_ids'])
        if 'required_document_ids' in validated_data:
            instance.required_documents.set(validated_data['required_document_ids'])

        return instance



class CountrySerializer(serializers.ModelSerializer):
    types = VisaTypeSerializer(many=True, read_only=True)

    class Meta:
        model = Country
        fields = '__all__'
