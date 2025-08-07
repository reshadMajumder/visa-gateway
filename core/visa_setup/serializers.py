#write serializer code for VisaType and Country models
from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import (
    VisaType, Country, VisaProcess, VisaOverview, Notes, 
    RequiredDocuments, VisaApplication, ApplicationDocument
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
                 'description','price','expected_processing_time', 'created_at', 'updated_at']

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
        fields = ['id', 'name', 'image','headings','price']

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






class VisaApplicationSerializer(serializers.ModelSerializer):
    country = serializers.SerializerMethodField()
    visa_type = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    required_documents = serializers.SerializerMethodField()
    
    # Add these fields for write operations
    country_id = serializers.IntegerField(write_only=True)
    visa_type_id = serializers.IntegerField(write_only=True)
    # Accept required documents and files on creation (optional)
    required_documents_files = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = VisaApplication
        fields = ['id', 'country', 'visa_type', 'user', 'status', 'admin_notes', 
                 'rejection_reason', 'created_at', 'updated_at', 'required_documents', 
                 'country_id', 'visa_type_id', 'required_documents_files']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def get_country(self, obj):
        return {
            'id': obj.country.id,
            'name': obj.country.name,
            'image': obj.country.image.url if obj.country.image else None
        }

    def get_visa_type(self, obj):
        required_documents = []
        for doc in obj.visa_type.required_documents.all():
            required_documents.append({
                'id': doc.id,
                'document_name': doc.document_name,
                'description': doc.description
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
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name
        }
        

    def get_required_documents(self, obj):
        documents = []
        for doc in obj.documents.all():
            documents.append({
                'id': doc.id,
                'document_name': doc.required_document.document_name,
                'status': doc.status,
                'file': doc.file.url if doc.file else None,
                'rejection_reason': doc.rejection_reason
            })
        return documents

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

        # Parse required_documents_files if provided
        files_json = attrs.get('required_documents_files', '')
        if files_json:
            try:
                import json
                files = json.loads(files_json)
                attrs['required_documents_files'] = files
            except json.JSONDecodeError:
                raise serializers.ValidationError({
                    "required_documents_files": "Invalid JSON format for required_documents_files"
                })
        else:
            attrs['required_documents_files'] = []

        # Validate required documents and files (if provided)
        files = attrs.get('required_documents_files', [])
        if files:  # Only validate if files are provided
            required_docs = visa_type.required_documents.all()
            
            if len(files) != required_docs.count():
                raise serializers.ValidationError({
                    "required_documents_files": f"You must upload all required documents. Expected {required_docs.count()} documents, got {len(files)}."
                })
            
            # Check that all required doc IDs are present
            file_doc_ids = {int(f['required_document_id']) for f in files if 'required_document_id' in f}
            required_doc_ids = {doc.id for doc in required_docs}
            
            if file_doc_ids != required_doc_ids:
                missing_docs = required_doc_ids - file_doc_ids
                raise serializers.ValidationError({
                    "required_documents_files": f"Missing required documents: {[RequiredDocuments.objects.get(id=doc_id).document_name for doc_id in missing_docs]}"
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
        
        # Determine status based on whether documents are provided
        status = 'submitted' if files else 'draft'
        
        # Create the visa application
        visa_application = VisaApplication.objects.create(
            user=user,
            country=country,
            visa_type=visa_type,
            status=status,
            **validated_data
        )
        
        # Create ApplicationDocument for each required document (if files provided)
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
