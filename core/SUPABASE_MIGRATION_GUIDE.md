# Supabase Migration Guide

## Overview
This guide explains the changes made to integrate Supabase storage for file uploads in your visa application system.

## Changes Made

### 1. Model Changes
- Changed `FileField` and `ImageField` to `URLField` in models:
  - `RequiredDocuments.document_file`
  - `VisaType.image`
  - `Country.image`
  - `ApplicationDocument.file`

### 2. Serializer Updates
- Updated all image and file URL methods to work with URLField
- Integrated Supabase upload in create methods
- Added fallback handling for upload failures

### 3. View Updates
- Modified file upload handling in both visa_setup and adminpanel views
- Added Supabase upload integration with error handling
- Maintained backward compatibility

## Setup Steps

### 1. Install Dependencies
```bash
pip install supabase==2.3.4
```

### 2. Environment Variables
Add to your `.env` file:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

### 3. Database Migration
```bash
python manage.py makemigrations
python manage.py migrate
```

## File Upload Flow

### New Upload Process:
1. File is uploaded via form
2. File is validated (size, type)
3. File is uploaded to Supabase storage
4. Supabase URL is stored in database
5. If upload fails, record is created without file URL

### Error Handling:
- Supabase upload failures are caught and logged
- Fallback creates records without file URLs
- System continues to function even if Supabase is unavailable

## API Changes

### File URLs:
- Previously: `file.url` (Django media URL)
- Now: `file` (Supabase URL directly)

### Image URLs:
- Previously: `image.url` (Django media URL)
- Now: `image` (Supabase URL directly)

## Testing

### Test File Upload:
1. Create a visa application with documents
2. Check that files are uploaded to Supabase
3. Verify URLs are stored correctly in database
4. Test file access via Supabase URLs

### Test Error Handling:
1. Temporarily break Supabase connection
2. Upload files - should create records without URLs
3. Restore connection and verify system works

## Troubleshooting

### Common Issues:

1. **Supabase Connection Error**
   - Check SUPABASE_URL and SUPABASE_KEY
   - Verify Supabase project is active
   - Check network connectivity

2. **File Upload Fails**
   - Check file size (10MB limit)
   - Verify file type is supported
   - Check Supabase bucket permissions

3. **URLs Not Working**
   - Verify bucket is public or URLs are signed
   - Check file paths in Supabase dashboard

## Migration from Existing Data

If you have existing files in local storage:

1. **Backup existing files**
2. **Run migration script** (create custom management command)
3. **Update existing records** with Supabase URLs
4. **Verify file accessibility**

## Performance Considerations

- Files are uploaded to Supabase asynchronously
- Local backup provides immediate access
- Consider CDN for better performance
- Monitor Supabase usage and costs

## Security

- Files are stored in private bucket by default
- Access requires proper authentication
- File validation prevents malicious uploads
- URLs can be signed for temporary access

## Monitoring

Monitor the following:
- Upload success rate
- File access patterns
- Storage usage in Supabase dashboard
- Error rates and types

## Support

For issues:
- Check Supabase dashboard for storage status
- Verify environment variables are correct
- Test with simple file upload first
- Check Django logs for error details 