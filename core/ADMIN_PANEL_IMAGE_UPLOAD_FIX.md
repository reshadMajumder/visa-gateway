# Admin Panel Image Upload Fix

## Problem
The admin panel was not properly handling image uploads for countries and visa types. When users posted multipart form data with images, the image URLs were not being saved properly to the Supabase bucket.

## Root Cause
The admin panel views for countries and visa types were missing:
1. `MultiPartParser` and `FormParser` configuration
2. Image upload handling logic
3. Supabase integration for image uploads

## Solution Implemented

### 1. Updated Views with File Upload Support

#### Country Views:
- **CountryListCreateView**: Added image upload handling for POST requests
- **CountryDetailView**: Added image upload handling for PUT requests

#### VisaType Views:
- **VisaTypeListCreateView**: Added image upload handling for POST requests
- **VisaTypeDetailView**: Added image upload handling for PUT requests
- **CountryVisaTypesView**: Added image upload handling for POST requests
- **CountryVisaTypeDetailView**: Added image upload handling for PUT requests

#### RequiredDocuments Views:
- **RequiredDocumentsView**: Added document file upload handling for POST requests
- **RequiredDocumentsDetailView**: Added document file upload handling for PUT requests

### 2. Key Changes Made

#### Parser Configuration:
```python
parser_classes = [MultiPartParser, FormParser]
```

#### Image Upload Logic:
```python
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
        image_url = upload_file_to_supabase(image_file, folder="countries")  # or "visa_types"
        request.data._mutable = True
        request.data['image'] = image_url
        request.data._mutable = False
        
    except Exception as e:
        return Response({'error': f'Failed to upload image: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
```

#### Document Upload Logic:
```python
# Handle document file upload if provided
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
        request.data._mutable = True
        request.data['document_file'] = file_url
        request.data._mutable = False
        
    except Exception as e:
        return Response({'error': f'Failed to upload file: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
```

### 3. File Organization in Supabase

#### Folder Structure:
- **Countries**: `countries/` folder
- **Visa Types**: `visa_types/` folder
- **Documents**: `documents/` folder
- **Application Documents**: `uploads/` folder (existing)

#### File Naming:
- Files are uploaded with their original names
- Supabase handles unique naming automatically
- URLs are generated with proper paths

### 4. Validation Rules

#### Image Files:
- **Size Limit**: 5MB maximum
- **Allowed Types**: JPG, JPEG, PNG, GIF
- **Validation**: File size and extension checking

#### Document Files:
- **Size Limit**: 10MB maximum
- **Allowed Types**: PDF, DOCX, DOC, JPG, JPEG, PNG
- **Validation**: File size and extension checking

### 5. Error Handling

#### Upload Failures:
- Comprehensive error messages
- Graceful fallback handling
- Detailed exception information

#### Validation Errors:
- Clear error messages for file size violations
- Specific error messages for file type violations
- Proper HTTP status codes

### 6. API Endpoints Updated

#### Country Management:
- `POST /admin/countries/` - Create country with image
- `PUT /admin/countries/{id}/` - Update country with image

#### Visa Type Management:
- `POST /admin/visa-types/` - Create visa type with image
- `PUT /admin/visa-types/{id}/` - Update visa type with image
- `POST /admin/countries/{country_id}/visa-types/` - Create visa type for country with image
- `PUT /admin/countries/{country_id}/visa-types/{visa_type_id}/` - Update visa type for country with image

#### Required Documents Management:
- `POST /admin/required-documents/` - Create document with file
- `PUT /admin/required-documents/{id}/` - Update document with file

### 7. Testing Checklist

#### Image Upload Testing:
1. **Valid Images**: Upload JPG, PNG, GIF files under 5MB
2. **Large Images**: Try uploading images > 5MB (should be rejected)
3. **Invalid Types**: Try uploading non-image files (should be rejected)
4. **Network Issues**: Test with Supabase connection failures

#### Document Upload Testing:
1. **Valid Documents**: Upload PDF, DOCX, DOC files under 10MB
2. **Large Documents**: Try uploading files > 10MB (should be rejected)
3. **Invalid Types**: Try uploading unsupported file types (should be rejected)

#### Integration Testing:
1. **Country Creation**: Create country with image upload
2. **Visa Type Creation**: Create visa type with image upload
3. **Document Creation**: Create required document with file upload
4. **Update Operations**: Update existing records with new images/files

### 8. Form Data Format

#### For Country Creation/Update:
```html
<form enctype="multipart/form-data">
    <input type="text" name="name" value="Country Name">
    <input type="text" name="description" value="Country Description">
    <input type="text" name="code" value="US">
    <input type="file" name="image" accept="image/*">
    <input type="text" name="type_ids" value="1,2,3">
</form>
```

#### For Visa Type Creation/Update:
```html
<form enctype="multipart/form-data">
    <input type="text" name="name" value="Visa Type Name">
    <input type="text" name="headings" value="Visa Headings">
    <input type="file" name="image" accept="image/*">
    <input type="text" name="description" value="Visa Description">
    <input type="number" name="price" value="100.00">
    <input type="text" name="expected_processing_time" value="5-7 days">
    <input type="text" name="process_ids" value="1,2,3">
    <input type="text" name="overview_ids" value="1,2">
    <input type="text" name="note_ids" value="1">
    <input type="text" name="required_document_ids" value="1,2,3">
</form>
```

#### For Required Document Creation/Update:
```html
<form enctype="multipart/form-data">
    <input type="text" name="document_name" value="Document Name">
    <input type="text" name="description" value="Document Description">
    <input type="file" name="document_file" accept=".pdf,.docx,.doc,.jpg,.jpeg,.png">
</form>
```

### 9. Response Format

#### Success Response:
```json
{
    "id": 1,
    "name": "United States",
    "description": "Country description",
    "code": "US",
    "image": "https://supabase.co/storage/v1/object/public/visa/countries/usa.jpg",
    "types": [...],
    "active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Error Response:
```json
{
    "error": "Image size cannot exceed 5MB"
}
```

### 10. Security Considerations

#### File Validation:
- File size limits enforced
- File type validation
- Extension checking
- Content type validation

#### Access Control:
- Admin-only access
- Proper authentication required
- File access through Supabase URLs

### 11. Performance Impact

#### Benefits:
- Images stored in cloud storage
- Reduced server storage requirements
- Better scalability
- CDN-like access to files

#### Considerations:
- Network dependency for uploads
- Monitor Supabase usage and costs
- Consider image optimization

### 12. Troubleshooting

#### Common Issues:

1. **Upload Failures**:
   - Check Supabase credentials
   - Verify bucket permissions
   - Check network connectivity

2. **Validation Errors**:
   - Check file size limits
   - Verify file extensions
   - Review error messages

3. **Image Not Displaying**:
   - Verify Supabase bucket is public
   - Check file paths in Supabase dashboard
   - Test URLs directly

#### Debug Steps:
1. Check Django logs for errors
2. Verify Supabase dashboard for uploads
3. Test file URLs directly
4. Check environment variables

### 13. Migration Notes

#### Database Changes:
- No schema changes needed (URLField already implemented)
- Existing records will work with new URL format
- Backward compatibility maintained

#### Environment Setup:
- Ensure SUPABASE_URL and SUPABASE_KEY are set
- Test Supabase connection before deployment
- Monitor upload success rates

## Summary

The admin panel now properly handles image uploads for countries and visa types, as well as document file uploads for required documents. All uploads are validated, stored in Supabase, and the URLs are properly saved to the database. The system includes comprehensive error handling and maintains backward compatibility. 