#write serializer code for VisaType and Country models
from rest_framework import serializers

from .models import VisaType, Country, VisaProcess, VisaOverview, Notes, RequiredDocuments

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



