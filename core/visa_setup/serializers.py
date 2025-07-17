#write serializer code for VisaType and Country models
from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import VisaType, Country, VisaProcess, VisaOverview, Notes, RequiredDocuments,VisaApplication

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

    class Meta:
        model = VisaType
        fields = '__all__'

class VisaTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = VisaType
        fields = ['id', 'name']

class CountrySerializer(serializers.ModelSerializer):
    types = VisaTypeSerializer(many=True)

    class Meta:
        model = Country
        fields = ['id', 'name', 'description', 'code', 'types', 'created_at', 'updated_at']




class VisaApplicationSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    visa_type = VisaTypeSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    
    # Add these fields for write operations
    country_id = serializers.IntegerField(write_only=True)
    visa_type_id = serializers.IntegerField(write_only=True)

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

        return attrs

    def create(self, validated_data):
        # Get country and visa_type instances
        country_id = validated_data.pop('country_id')
        visa_type_id = validated_data.pop('visa_type_id')
        
        country = Country.objects.get(id=country_id)
        visa_type = VisaType.objects.get(id=visa_type_id)
        
        # Get the user from the context
        user = self.context['request'].user
        
        # Create the visa application
        visa_application = VisaApplication.objects.create(
            user=user,
            country=country,
            visa_type=visa_type,
            **validated_data
        )
        
        return visa_application

