# Admin Visa Application Management API

This document describes the updated `UserVisaApplicationView` API endpoints for administrators to manage visa applications.

## Overview

The `UserVisaApplicationView` provides comprehensive CRUD operations for visa applications, allowing administrators to:
- Get all applications or a specific application
- Create new applications
- Update application status, admin notes, rejection reasons, and documents
- Delete applications

## Base URL
```
/api/admin/visa-applications/
```

## Authentication
All endpoints require superuser authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. GET /api/admin/visa-applications/
**Get all visa applications**

**Response:**
```json
{
    "message": "Applications fetched successfully",
    "Applications": [
        {
            "id": 1,
            "country": {
                "id": 1,
                "name": "United States",
                "image": "/media/countries/usa.jpg"
            },
            "visa_type": {
                "id": 1,
                "name": "Tourist Visa",
                "image": "/media/visa_types/tourist.jpg",
                "required_documents": [
                    {
                        "id": 1,
                        "document_name": "Passport",
                        "description": "Valid passport with 6 months validity",
                        "document_file": "/media/documents/passport.pdf",
                        "status": "approved",
                        "admin_notes": "Document verified"
                    }
                ]
            },
            "user": {
                "id": 1,
                "username": "john_doe"
            },
            "status": "pending",
            "admin_notes": "Application under review",
            "rejection_reason": "",
            "created_at": "2024-01-15T10:30:00Z",
            "updated_at": "2024-01-15T10:30:00Z"
        }
    ]
}
```

### 2. GET /api/admin/visa-applications/{application_id}/
**Get a specific visa application**

**Response:**
```json
{
    "id": 1,
    "country": {
        "id": 1,
        "name": "United States",
        "image": "/media/countries/usa.jpg"
    },
    "visa_type": {
        "id": 1,
        "name": "Tourist Visa",
        "image": "/media/visa_types/tourist.jpg",
        "required_documents": [...]
    },
    "user": {
        "id": 1,
        "username": "john_doe"
    },
    "status": "pending",
    "admin_notes": "Application under review",
    "rejection_reason": "",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
}
```

### 3. POST /api/admin/visa-applications/
**Create a new visa application**

**Request (multipart/form-data):**
```
country_id: 1
visa_type_id: 1
status: draft
admin_notes: Initial application
rejection_reason: 
required_documents[1]: [file]
required_documents[2]: [file]
```

**Response:**
```json
{
    "message": "Application created successfully",
    "Application": {
        "id": 2,
        "country": {...},
        "visa_type": {...},
        "user": {...},
        "status": "draft",
        "admin_notes": "Initial application",
        "rejection_reason": "",
        "created_at": "2024-01-15T11:00:00Z",
        "updated_at": "2024-01-15T11:00:00Z"
    }
}
```

### 4. PUT /api/admin/visa-applications/{application_id}/
**Update application status, notes, and/or documents**

This endpoint supports multiple types of updates:

#### A. Update Application Fields (JSON or form-data)
**Request:**
```
status: approved
admin_notes: Application approved after document verification
rejection_reason: 
```

**Response:**
```json
{
    "message": "Application updated successfully",
    "application": {
        "id": 1,
        "status": "approved",
        "admin_notes": "Application approved after document verification",
        "rejection_reason": "",
        ...
    }
}
```

#### B. Update Documents (multipart/form-data)
**Request:**
```
required_documents[1]: [file]
required_documents[3]: [file]
```

**Response:**
```json
{
    "message": "Application updated successfully",
    "application": {
        "id": 1,
        ...
        "visa_type": {
            "required_documents": [
                {
                    "id": 1,
                    "document_name": "Passport",
                    "document_file": "/media/documents/new_passport.pdf",
                    "status": "pending",
                    "admin_notes": ""
                }
            ]
        }
    }
}
```

#### C. Combined Update (multipart/form-data)
**Request:**
```
status: approved
admin_notes: Application approved
rejection_reason: 
required_documents[1]: [file]
required_documents[2]: [file]
```

### 5. DELETE /api/admin/visa-applications/{application_id}/
**Delete a visa application**

**Response:**
```json
{
    "message": "Application deleted successfully"
}
```

## Status Values

The `status` field can have the following values:
- `draft` - Application is in draft state
- `pending` - Application is under review
- `approved` - Application has been approved
- `rejected` - Application has been rejected
- `completed` - Application process is complete

## File Upload Requirements

### Supported File Types:
- PDF (.pdf)
- Microsoft Word (.docx, .doc)
- Images (.jpg, .jpeg, .png)

### File Size Limit:
- Maximum 10MB per file

### File Naming Convention:
For document uploads, use the format: `required_documents[document_id]`
Where `document_id` is the ID of the required document from the visa type.

## Error Responses

### 400 Bad Request
```json
{
    "error": "Application ID is required"
}
```

### 404 Not Found
```json
{
    "error": "Application not found"
}
```

### 400 Bad Request (File Validation)
```json
{
    "error": "File size cannot exceed 10MB"
}
```
or
```json
{
    "error": "File type not allowed. Use PDF, DOCX, DOC, JPG, JPEG, or PNG"
}
```

### 500 Internal Server Error
```json
{
    "error": "Error deleting application: [error details]"
}
```

## Usage Examples

### Example 1: Update Application Status
```bash
curl -X PUT \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved",
    "admin_notes": "All documents verified and approved"
  }' \
  http://localhost:8000/api/admin/visa-applications/1/
```

### Example 2: Upload Documents
```bash
curl -X PUT \
  -H "Authorization: Bearer <your_token>" \
  -F "required_documents[1]=@passport.pdf" \
  -F "required_documents[2]=@bank_statement.pdf" \
  http://localhost:8000/api/admin/visa-applications/1/
```

### Example 3: Combined Update
```bash
curl -X PUT \
  -H "Authorization: Bearer <your_token>" \
  -F "status=approved" \
  -F "admin_notes=Application approved with updated documents" \
  -F "required_documents[1]=@updated_passport.pdf" \
  http://localhost:8000/api/admin/visa-applications/1/
```

### Example 4: Delete Application
```bash
curl -X DELETE \
  -H "Authorization: Bearer <your_token>" \
  http://localhost:8000/api/admin/visa-applications/1/
```

## Notes

1. **Admin Only Access**: All endpoints require superuser authentication
2. **Flexible Updates**: The PUT endpoint allows updating any combination of fields and documents
3. **File Validation**: All uploaded files are validated for size and type
4. **Status Tracking**: Applications can be tracked through various statuses
5. **Document Management**: Documents can be uploaded, updated, and tracked with individual statuses
6. **Audit Trail**: All changes are timestamped in `created_at` and `updated_at` fields 