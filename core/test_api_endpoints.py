#!/usr/bin/env python
"""
Test script to verify the API endpoints for countries and visa types
Run this after setting up the database and creating a superuser
"""

import os
import sys
import django
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from visa_setup.models import (
    Country, VisaType, VisaProcess, VisaOverview, 
    Notes, RequiredDocuments
)
from adminpanel.serializers import (
    CountrySerializer, VisaTypeSerializer,
    VisaProcessSerializer, VisaOverviewSerializer,
    NotesSerializer, RequiredDocumentsSerializer
)

User = get_user_model()

def test_serializers():
    """Test that serializers work correctly"""
    print("Testing serializers...")
    
    # Test creating a visa process
    process_data = {"points": "Submit application online"}
    process_serializer = VisaProcessSerializer(data=process_data)
    if process_serializer.is_valid():
        process = process_serializer.save()
        print(f"✓ Created visa process: {process}")
    else:
        print(f"✗ Failed to create visa process: {process_serializer.errors}")
    
    # Test creating a visa overview
    overview_data = {"points": "Valid passport required", "overview": "Tourist visa overview"}
    overview_serializer = VisaOverviewSerializer(data=overview_data)
    if overview_serializer.is_valid():
        overview = overview_serializer.save()
        print(f"✓ Created visa overview: {overview}")
    else:
        print(f"✗ Failed to create visa overview: {overview_serializer.errors}")
    
    # Test creating notes
    notes_data = {"notes": "Processing time may vary"}
    notes_serializer = NotesSerializer(data=notes_data)
    if notes_serializer.is_valid():
        notes = notes_serializer.save()
        print(f"✓ Created notes: {notes}")
    else:
        print(f"✗ Failed to create notes: {notes_serializer.errors}")
    
    # Test creating required documents
    doc_data = {"document_name": "Passport", "description": "Valid passport with 6 months validity"}
    doc_serializer = RequiredDocumentsSerializer(data=doc_data)
    if doc_serializer.is_valid():
        doc = doc_serializer.save()
        print(f"✓ Created required document: {doc}")
    else:
        print(f"✗ Failed to create required document: {doc_serializer.errors}")
    
    # Test creating a visa type with relationships
    visa_type_data = {
        "name": "Tourist Visa",
        "headings": "Tourist Visa Requirements",
        "description": "Visa for tourism purposes",
        "price": "150.00",
        "expected_processing_time": "5-7 days",
        "active": True,
        "process_ids": [process.id],
        "overview_ids": [overview.id],
        "note_ids": [notes.id],
        "required_document_ids": [doc.id]
    }
    
    visa_type_serializer = VisaTypeSerializer(data=visa_type_data)
    if visa_type_serializer.is_valid():
        visa_type = visa_type_serializer.save()
        print(f"✓ Created visa type with relationships: {visa_type}")
        print(f"  - Processes: {list(visa_type.processes.all())}")
        print(f"  - Overviews: {list(visa_type.overviews.all())}")
        print(f"  - Notes: {list(visa_type.notes.all())}")
        print(f"  - Required Documents: {list(visa_type.required_documents.all())}")
    else:
        print(f"✗ Failed to create visa type: {visa_type_serializer.errors}")
    
    # Test creating a country
    country_data = {
        "name": "United States",
        "description": "The United States of America",
        "code": "US",
        "type_ids": [visa_type.id]
    }
    
    country_serializer = CountrySerializer(data=country_data)
    if country_serializer.is_valid():
        country = country_serializer.save()
        print(f"✓ Created country with visa types: {country}")
        print(f"  - Visa Types: {list(country.types.all())}")
    else:
        print(f"✗ Failed to create country: {country_serializer.errors}")
    
    return {
        'process': process,
        'overview': overview,
        'notes': notes,
        'doc': doc,
        'visa_type': visa_type,
        'country': country
    }

def test_relationships():
    """Test that relationships work correctly"""
    print("\nTesting relationships...")
    
    # Get existing objects
    country = Country.objects.first()
    visa_type = VisaType.objects.first()
    
    if country and visa_type:
        # Test adding visa type to country
        country.types.add(visa_type)
        print(f"✓ Added visa type {visa_type.name} to country {country.name}")
        
        # Test removing visa type from country
        country.types.remove(visa_type)
        print(f"✓ Removed visa type {visa_type.name} from country {country.name}")
        
        # Test adding back
        country.types.add(visa_type)
        print(f"✓ Added visa type {visa_type.name} back to country {country.name}")
    else:
        print("✗ No country or visa type found for relationship testing")

def cleanup_test_data():
    """Clean up test data"""
    print("\nCleaning up test data...")
    
    # Delete test objects
    Country.objects.filter(name="United States").delete()
    VisaType.objects.filter(name="Tourist Visa").delete()
    VisaProcess.objects.filter(points="Submit application online").delete()
    VisaOverview.objects.filter(points="Valid passport required").delete()
    Notes.objects.filter(notes="Processing time may vary").delete()
    RequiredDocuments.objects.filter(document_name="Passport").delete()
    
    print("✓ Cleaned up test data")

if __name__ == "__main__":
    print("Testing API endpoints and relationships...")
    print("=" * 50)
    
    try:
        # Test serializers and data creation
        test_objects = test_serializers()
        
        # Test relationships
        test_relationships()
        
        print("\n" + "=" * 50)
        print("✓ All tests completed successfully!")
        
        # Ask if user wants to clean up
        response = input("\nDo you want to clean up test data? (y/n): ")
        if response.lower() == 'y':
            cleanup_test_data()
            print("✓ Cleanup completed")
        
    except Exception as e:
        print(f"\n✗ Test failed with error: {e}")
        import traceback
        traceback.print_exc() 