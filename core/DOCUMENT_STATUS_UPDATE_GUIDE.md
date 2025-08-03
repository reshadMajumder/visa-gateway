# Document Status and Admin Notes Update Guide

This guide explains how to update individual document status and admin notes for visa applications.

## Overview

You can now update individual document status and admin notes for each required document in a visa application. This allows for granular control over document review and feedback.

## Available Document Status Values

- `pending` - Document is under review
- `approved` - Document has been approved
- `rejected` - Document has been rejected

## API Endpoint

**Method:** PUT  
**URL:** `/api/admin/visa-applications/{application_id}/`

## Update Formats

### 1. Update Document Status

**Format:** `document_status[document_id] = status_value`

**Example:**
```
document_status[4] = approved
document_status[5] = rejected
document_status[7] = pending
```

### 2. Update Document Admin Notes

**Format:** `document_admin_notes[document_id] = notes_text`

**Example:**
```
document_admin_notes[4] = Passport verified successfully
document_admin_notes[5] = Passport photo is unclear, please provide a clearer copy
document_admin_notes[7] = NID document is valid and approved
```

### 3. Update Document Rejection Reason

**Format:** `document_rejection_reason[document_id] = reason_text`

**Example:**
```
document_rejection_reason[5] = Photo quality is poor, please upload a clearer image
document_rejection_reason[8] = Credit card statement is not recent enough
```

## Usage Examples

### Example 1: Update Document Status Only

**Using curl:**
```bash
curl -X PUT \
  -H "Authorization: Bearer <your_token>" \
  -F "document_status[4]=approved" \
  -F "document_status[5]=rejected" \
  -F "document_status[7]=approved" \
  http://localhost:8000/api/admin/visa-applications/58/
```

**Using Postman:**
- Method: PUT
- URL: `http://localhost:8000/api/admin/visa-applications/58/`
- Headers: `Authorization: Bearer <your_token>`
- Body (form-data):
  - Key: `document_status[4]`, Value: `approved`
  - Key: `document_status[5]`, Value: `rejected`
  - Key: `document_status[7]`, Value: `approved`

### Example 2: Update Document Admin Notes

**Using curl:**
```bash
curl -X PUT \
  -H "Authorization: Bearer <your_token>" \
  -F "document_admin_notes[4]=Passport verified successfully" \
  -F "document_admin_notes[5]=Passport photo needs to be clearer" \
  -F "document_admin_notes[7]=NID document is valid" \
  http://localhost:8000/api/admin/visa-applications/58/
```

### Example 3: Update Document Rejection Reasons

**Using curl:**
```bash
curl -X PUT \
  -H "Authorization: Bearer <your_token>" \
  -F "document_rejection_reason[5]=Photo quality is poor, please provide a clearer image" \
  -F "document_rejection_reason[8]=Credit card statement is not recent enough" \
  http://localhost:8000/api/admin/visa-applications/58/
```

### Example 4: Combined Update (Status + Notes + Rejection Reasons)

**Using curl:**
```bash
curl -X PUT \
  -H "Authorization: Bearer <your_token>" \
  -F "document_status[4]=approved" \
  -F "document_admin_notes[4]=Passport verified successfully" \
  -F "document_status[5]=rejected" \
  -F "document_admin_notes[5]=Passport photo is unclear" \
  -F "document_rejection_reason[5]=Please provide a clearer passport photo" \
  -F "document_status[7]=approved" \
  -F "document_admin_notes[7]=NID document is valid and approved" \
  http://localhost:8000/api/admin/visa-applications/58/
```

### Example 5: Combined with Application Status Update

**Using curl:**
```bash
curl -X PUT \
  -H "Authorization: Bearer <your_token>" \
  -F "status=approved" \
  -F "admin_notes=Application approved with some documents pending" \
  -F "document_status[4]=approved" \
  -F "document_admin_notes[4]=Passport verified" \
  -F "document_status[5]=rejected" \
  -F "document_admin_notes[5]=Passport photo unclear" \
  -F "document_rejection_reason[5]=Please provide clearer photo" \
  -F "document_status[7]=approved" \
  -F "document_admin_notes[7]=NID verified" \
  http://localhost:8000/api/admin/visa-applications/58/
```

## Response Format

After updating, you'll receive a response like this:

```json
{
    "message": "Application updated successfully",
    "application": {
        "id": 58,
        "country": {...},
        "visa_type": {
            "id": 2,
            "name": "Rider Visa",
            "required_documents": [
                {
                    "id": 4,
                    "document_name": "visa",
                    "description": "",
                    "document_file": "/media/visa_documents/2025/08/logo.png",
                    "status": "approved",
                    "admin_notes": "Passport verified successfully",
                    "rejection_reason": ""
                },
                {
                    "id": 5,
                    "document_name": "passport",
                    "description": "",
                    "document_file": "/media/visa_documents/2025/08/images.jpg",
                    "status": "rejected",
                    "admin_notes": "Passport photo is unclear",
                    "rejection_reason": "Please provide a clearer passport photo"
                },
                {
                    "id": 7,
                    "document_name": "NID",
                    "description": "",
                    "document_file": "/media/visa_documents/2025/08/react_nginx_ssl_deploy_steps_xbwAVeo.pdf",
                    "status": "approved",
                    "admin_notes": "NID document is valid and approved",
                    "rejection_reason": ""
                }
            ]
        },
        "user": {...},
        "status": "approved",
        "admin_notes": "Application approved with some documents pending",
        "rejection_reason": "",
        "created_at": "2025-08-01T18:18:14.732867Z",
        "updated_at": "2025-08-03T19:35:02.777756Z"
    }
}
```

## Important Notes

1. **Document ID Required**: You need to use the correct document ID from the visa type's required documents
2. **Uploaded Documents Only**: You can only update status/notes for documents that have been uploaded
3. **Status Values**: Use only `pending`, `approved`, or `rejected`
4. **Combined Updates**: You can update multiple documents and application status in one request
5. **Error Handling**: If a document hasn't been uploaded, the status/notes update will be skipped for that document

## Document ID Reference

From your example, the document IDs are:
- ID 4: "visa"
- ID 5: "passport" 
- ID 6: "birth certificate" (not uploaded)
- ID 7: "NID"
- ID 8: "credit card" (not uploaded)
- ID 9: "school certificate" (not uploaded)

Only documents that have been uploaded (have a `document_file`) can have their status and notes updated. 