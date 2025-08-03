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


# Custom field for handling comma-separated IDs
class CommaSeparatedIdsField(serializers.CharField):
    def __init__(self, model_class, **kwargs):
        self.model_class = model_class
        super().__init__(**kwargs)

    def to_internal_value(self, data):
        if not data or data.strip() == '':
            return []
        
        try:
            ids = [int(x.strip()) for x in data.split(',') if x.strip()]
            return self.model_class.objects.filter(id__in=ids)
        except ValueError:
            raise serializers.ValidationError(f"Invalid format. Use comma-separated integers for {self.field_name}")

    def to_representation(self, value):
        if hasattr(value, 'all'):  # QuerySet
            return [obj.id for obj in value]
        return value


class VisaTypeSerializer(serializers.ModelSerializer):
    processes = VisaProcessSerializer(many=True, read_only=True)
    process_ids = CommaSeparatedIdsField(VisaProcess, required=False, allow_blank=True)

    overviews = VisaOverviewSerializer(many=True, read_only=True)
    overview_ids = CommaSeparatedIdsField(VisaOverview, required=False, allow_blank=True)

    notes = NotesSerializer(many=True, read_only=True)
    note_ids = CommaSeparatedIdsField(Notes, required=False, allow_blank=True)

    required_documents = RequiredDocumentsSerializer(many=True, read_only=True)
    required_document_ids = CommaSeparatedIdsField(RequiredDocuments, required=False, allow_blank=True)

    class Meta:
        model = VisaType
        fields = '__all__'

    def create(self, validated_data):
        # Extract many-to-many field data
        process_ids = validated_data.pop('process_ids', [])
        overview_ids = validated_data.pop('overview_ids', [])
        note_ids = validated_data.pop('note_ids', [])
        required_document_ids = validated_data.pop('required_document_ids', [])

        # Create the visa type
        visa_type = VisaType.objects.create(**validated_data)

        # Set the many-to-many relationships
        if process_ids:
            visa_type.processes.set(process_ids)
        if overview_ids:
            visa_type.overviews.set(overview_ids)
        if note_ids:
            visa_type.notes.set(note_ids)
        if required_document_ids:
            visa_type.required_documents.set(required_document_ids)

        return visa_type

    def update(self, instance, validated_data):
        # Extract many-to-many field data
        process_ids = validated_data.pop('process_ids', None)
        overview_ids = validated_data.pop('overview_ids', None)
        note_ids = validated_data.pop('note_ids', None)
        required_document_ids = validated_data.pop('required_document_ids', None)

        # Update the visa type
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update many-to-many relationships if provided
        if process_ids is not None:
            instance.processes.set(process_ids)
        if overview_ids is not None:
            instance.overviews.set(overview_ids)
        if note_ids is not None:
            instance.notes.set(note_ids)
        if required_document_ids is not None:
            instance.required_documents.set(required_document_ids)

        return instance


class CountrySerializer(serializers.ModelSerializer):
    types = VisaTypeSerializer(many=True, read_only=True)
    type_ids = CommaSeparatedIdsField(VisaType, required=False, allow_blank=True)

    class Meta:
        model = Country
        fields = '__all__'

    def create(self, validated_data):
        # Extract visa type IDs
        type_ids = validated_data.pop('type_ids', [])

        # Create the country
        country = Country.objects.create(**validated_data)

        # Set the visa types
        if type_ids:
            country.types.set(type_ids)

        return country

    def update(self, instance, validated_data):
        # Extract visa type IDs
        type_ids = validated_data.pop('type_ids', None)

        # Update the country
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update visa types if provided
        if type_ids is not None:
            instance.types.set(type_ids)

        return instance


# Serializer for creating visa types within a country context
class CountryVisaTypeSerializer(serializers.ModelSerializer):
    processes = VisaProcessSerializer(many=True, read_only=True)
    process_ids = CommaSeparatedIdsField(VisaProcess, required=False, allow_blank=True)

    overviews = VisaOverviewSerializer(many=True, read_only=True)
    overview_ids = CommaSeparatedIdsField(VisaOverview, required=False, allow_blank=True)

    notes = NotesSerializer(many=True, read_only=True)
    note_ids = CommaSeparatedIdsField(Notes, required=False, allow_blank=True)

    required_documents = RequiredDocumentsSerializer(many=True, read_only=True)
    required_document_ids = CommaSeparatedIdsField(RequiredDocuments, required=False, allow_blank=True)

    class Meta:
        model = VisaType
        fields = '__all__'

    def create(self, validated_data):
        # Extract many-to-many field data
        process_ids = validated_data.pop('process_ids', [])
        overview_ids = validated_data.pop('overview_ids', [])
        note_ids = validated_data.pop('note_ids', [])
        required_document_ids = validated_data.pop('required_document_ids', [])

        # Create the visa type
        visa_type = VisaType.objects.create(**validated_data)

        # Set the many-to-many relationships
        if process_ids:
            visa_type.processes.set(process_ids)
        if overview_ids:
            visa_type.overviews.set(overview_ids)
        if note_ids:
            visa_type.notes.set(note_ids)
        if required_document_ids:
            visa_type.required_documents.set(required_document_ids)

        return visa_type






class UserVisaApplicationSerializer(serializers.ModelSerializer):
    # Read-only detailed views
    country = serializers.SerializerMethodField(read_only=True)
    visa_type = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    # Write-only fields for input
    country_id = serializers.PrimaryKeyRelatedField(queryset=Country.objects.all(), write_only=True)
    visa_type_id = serializers.PrimaryKeyRelatedField(queryset=VisaType.objects.all(), write_only=True)

    class Meta:
        model = VisaApplication
        fields = [
            'id', 'country', 'country_id', 'visa_type', 'visa_type_id', 'user',
            'status', 'admin_notes', 'rejection_reason',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def get_country(self, obj):
        return {
            'id': obj.country.id,
            'name': obj.country.name,
            'image': obj.country.image.url if obj.country.image else None
        }

    def get_visa_type(self, obj):
        required_documents = []
        # validate the file size and type pdf, docx, doc, jpg, jpeg, png
        

        uploaded_docs = {
            doc.required_document.id: doc for doc in obj.documents.all()
        }

        for doc in obj.visa_type.required_documents.all():
            uploaded = uploaded_docs.get(doc.id)
            required_documents.append({
                'id': doc.id,
                'document_name': doc.document_name,
                'description': doc.description,
                'document_file': uploaded.file.url if uploaded and uploaded.file else None,
                'status': uploaded.status if uploaded else 'not_uploaded',
                'admin_notes': uploaded.admin_notes if uploaded else '',
                'rejection_reason': uploaded.rejection_reason if uploaded else '',
            })

        return {
            'id': obj.visa_type.id,
            'name': obj.visa_type.name,
            'image': obj.visa_type.image.url if obj.visa_type.image else None,
            'required_documents': required_documents
        }

    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
        }

    def create(self, validated_data):
        request = self.context['request']
        user = request.user

        country = validated_data.pop('country_id')
        visa_type = validated_data.pop('visa_type_id')

        application = VisaApplication.objects.create(
            user=user,
            country=country,
            visa_type=visa_type,
            status=validated_data.get('status', 'draft'),
            admin_notes=validated_data.get('admin_notes', ''),
            rejection_reason=validated_data.get('rejection_reason', ''),
        )

        # Handle uploaded files
        for key, file in request.FILES.items():
            if key.startswith("required_documents["):
                # validate the file size and type pdf, docx, doc, jpg, jpeg, png
                if file.size > 1024 * 1024 * 10:
                    raise serializers.ValidationError("File size cannot exceed 10MB")
                if not (file.name.endswith('.pdf') or file.name.endswith('.docx') or file.name.endswith('.doc') or file.name.endswith('.jpg') or file.name.endswith('.jpeg') or file.name.endswith('.png')):
                    raise serializers.ValidationError("File type is not allowed")
                doc_id = key.split("[")[1].split("]")[0]
                try:
                    required_doc = RequiredDocuments.objects.get(id=doc_id)
                    ApplicationDocument.objects.create(
                        application=application,
                        required_document=required_doc,
                        file=file
                    )
                except RequiredDocuments.DoesNotExist:
                    continue

        return application
