#write serializer code for VisaType and Country models
from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import (
    VisaType, Country, VisaProcess, VisaOverview, Notes, 
    RequiredDocuments, VisaApplication, ApplicationDocument,
    VisaTypeDocument
)

class visaProcessSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisaProcess
        fields = '__all__'
class VisaOverviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisaOverview
        fields = '__all__'

class NotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notes
        fields = '__all__'

class RequiredDocumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequiredDocuments
        fields = '__all__'

class DetailedVisaTypeSerializer(serializers.ModelSerializer):
    processes = visaProcessSerializer(many=True)
    overviews = VisaOverviewSerializer(many=True)
    notes = NotesSerializer(many=True)
    required_documents = RequiredDocumentsSerializer(many=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = VisaType
        fields = ['id', 'name', 'headings', 'active', 'image',
                 'processes', 'overviews', 'notes', 'required_documents',
                 'description', 'created_at', 'updated_at']

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class VisaTypeSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = VisaType
        fields = ['id', 'name', 'image']

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class CountrySerializer(serializers.ModelSerializer):
    types = VisaTypeSerializer(many=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Country
        fields = ['id', 'name', 'description', 'image',
                 'code', 'types', 'created_at', 'updated_at']

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    





class ApplicationDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationDocument
        fields = '__all__'

class VisaApplicationSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    visa_type = VisaTypeSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    
    # Add these fields for write operations
    country_id = serializers.IntegerField(write_only=True)
    visa_type_id = serializers.IntegerField(write_only=True)
    # Accept required documents and files on creation
    required_documents_files = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = VisaApplication
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def validate(self, attrs):
        # Validate if country exists
        try:
            country = Country.objects.get(id=attrs['country_id'])
        except Country.DoesNotExist:
            raise serializers.ValidationError({"country_id": "Invalid country ID"})

        # Validate if visa type exists
        try:
            visa_type = VisaType.objects.get(id=attrs['visa_type_id'])
        except VisaType.DoesNotExist:
            raise serializers.ValidationError({"visa_type_id": "Invalid visa type ID"})

        # Validate if visa type belongs to the selected country
        if not country.types.filter(id=visa_type.id).exists():
            raise serializers.ValidationError(
                {"visa_type_id": "This visa type is not available for the selected country"}
            )

        # Validate required documents and files
        required_docs = visa_type.required_documents.all()
        files = attrs.get('required_documents_files', [])
        if self.instance is None:  # Only on create
            if not files or len(files) != required_docs.count():
                raise serializers.ValidationError({
                    "required_documents_files": f"You must upload all required documents: {[doc.document_name for doc in required_docs]}"
                })
            # Check that all required doc IDs are present
            file_doc_ids = {int(f['required_document_id']) for f in files if 'required_document_id' in f}
            required_doc_ids = {doc.id for doc in required_docs}
            if file_doc_ids != required_doc_ids:
                raise serializers.ValidationError({
                    "required_documents_files": "You must upload a file for each required document."
                })
        return attrs

    def create(self, validated_data):
        # Get country and visa_type instances
        country_id = validated_data.pop('country_id')
        visa_type_id = validated_data.pop('visa_type_id')
        files = validated_data.pop('required_documents_files', [])
        country = Country.objects.get(id=country_id)
        visa_type = VisaType.objects.get(id=visa_type_id)
        user = self.context['request'].user
        visa_application = VisaApplication.objects.create(
            user=user,
            country=country,
            visa_type=visa_type,
            **validated_data
        )
        # Create ApplicationDocument for each required document
        for file_info in files:
            required_document_id = file_info['required_document_id']
            file = file_info['file']
            required_document = RequiredDocuments.objects.get(id=required_document_id)
            ApplicationDocument.objects.create(
                application=visa_application,
                required_document=required_document,
                file=file,
                status='pending'
            )
        return visa_application

