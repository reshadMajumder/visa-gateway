# Visa Application API Documentation

## Overview
The visa application system supports two types of applications:
1. **Apply without Documents** - Creates a draft application
2. **Apply with Documents** - Creates a complete application with uploaded documents

## API Endpoints

### Base URL
- `http://127.0.0.1:8000/api/v2/visa-applications/`

## 1. Apply Without Documents (Draft Application)

**Endpoint:** `POST /api/v2/visa-applications/`

**Content-Type:** `multipart/form-data`

**Request Body:**
```
country_id: 1
visa_type_id: 1
```

**Response:**
```json
{
  "message": "Application created successfully",
  "Application": {
    "id": 1,
    "country": {...},
    "visa_type": {...},
    "status": "draft",
    ...
  }
}
```

## 2. Apply With Documents (Complete Application)

**Endpoint:** `POST /api/v2/visa-applications/`

**Content-Type:** `multipart/form-data`

**Request Body:**
```
country_id: 1
visa_type_id: 1
required_documents[1]: [file]
required_documents[2]: [file]
required_documents[3]: [file]
...
```

### How to Get Document IDs

The document IDs for `required_documents[n]` come from the visa type details API:

**Endpoint:** `GET /api/visa-types/{visa_type_id}/`

**Response:**
```json
{
  "id": 1,
  "name": "Tourist Visa",
  "required_documents": [
    {
      "id": 1,
      "document_name": "Passport",
      "description": "Valid passport with 6 months validity"
    },
    {
      "id": 2,
      "document_name": "Photo",
      "description": "Recent passport size photo"
    },
    {
      "id": 3,
      "document_name": "Bank Statement",
      "description": "Last 3 months bank statement"
    }
  ]
}
```

### File Upload Format

For each required document, upload the file with the key format:
- `required_documents[document_id]`

**Example:**
- Document ID 1 (Passport): `required_documents[1]`
- Document ID 2 (Photo): `required_documents[2]`
- Document ID 3 (Bank Statement): `required_documents[3]`

### Supported File Types
- PDF (.pdf)
- Word documents (.doc, .docx)
- Images (.jpg, .jpeg, .png)

### File Size Limit
- Maximum file size: 10MB per file

## Frontend Implementation

### Apply Without Documents
```javascript
const formData = new FormData();
formData.append('country_id', countryId);
formData.append('visa_type_id', visaTypeId);

const response = await fetch('http://127.0.0.1:8000/api/v2/visa-applications/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### Apply With Documents
```javascript
const formData = new FormData();
formData.append('country_id', countryId);
formData.append('visa_type_id', visaTypeId);

// Append each file with the correct key format
requiredDocs.forEach(doc => {
  if (docFiles[doc.id]) {
    formData.append(`required_documents[${doc.id}]`, docFiles[doc.id]);
  }
});

const response = await fetch('http://127.0.0.1:8000/api/v2/visa-applications/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

## Postman Example

**URL:** `http://127.0.0.1:8000/api/v2/visa-applications/`
**Method:** `POST`
**Body:** `form-data`

| Key | Type | Value |
|-----|------|-------|
| country_id | Text | 1 |
| visa_type_id | Text | 1 |
| required_documents[1] | File | passport.pdf |
| required_documents[2] | File | photo.jpg |
| required_documents[3] | File | bank_statement.pdf |

## Status Values

- `draft` - Application created without documents
- `submitted` - Application created with all required documents
- `pending` - Under review
- `approved` - Application approved
- `rejected` - Application rejected 