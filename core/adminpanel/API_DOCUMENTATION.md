# Admin Panel API Documentation

This document describes the API endpoints for managing countries, visa types, and their relationships in the admin panel.

## Authentication

All endpoints require superuser authentication. Use the login endpoint to get a JWT token:

```bash
POST /admin/login/
{
    "email": "admin@example.com",
    "password": "your_password"
}
```

Include the token in subsequent requests:
```
Authorization: Bearer <your_access_token>
```

## Base URL
```
/api/admin/
```

## Endpoints Overview

### 1. Authentication
- `POST /login/` - Admin login
- `POST /logout/` - Admin logout
- `POST /token/refresh/` - Refresh access token

### 2. Related Data Management
- `GET/POST /notes/` - Manage visa notes
- `GET/POST /visa-process/` - Manage visa processes
- `GET/POST /visa-overview/` - Manage visa overviews
- `GET/POST /required-documents/` - Manage required documents

### 3. Country Management
- `GET/POST /countries/` - List/Create countries
- `GET/PUT/DELETE /countries/<id>/` - Manage specific country
- `GET /countries-with-visa-types/` - Get countries with nested visa types

### 4. Visa Type Management
- `GET/POST /visa-types/` - List/Create visa types
- `GET/PUT/DELETE /visa-types/<id>/` - Manage specific visa type

### 5. Country-Visa Type Relationships
- `GET/POST /countries/<country_id>/visa-types/` - Get/Create visa types for a country
- `GET/PUT/DELETE /countries/<country_id>/visa-types/<visa_type_id>/` - Manage visa type within country
- `POST /countries/<country_id>/bulk-assign-visa-types/` - Bulk assign visa types to country

### 6. Form Data Utilities
- `GET /form-data/visa-type/` - Get all available data for visa type forms
- `GET /form-data/country/` - Get all available data for country forms

## Detailed Usage Examples

### Creating a Country

```bash
POST /api/admin/countries/
{
    "name": "United States",
    "description": "The United States of America",
    "code": "US",
    "type_ids": [1, 2, 3]  # Optional: existing visa type IDs
}
```

### Creating a Visa Type

```bash
POST /api/admin/visa-types/
{
    "name": "Tourist Visa",
    "headings": "Tourist visa requirements and process",
    "description": "Visa for tourism purposes",
    "price": "150.00",
    "expected_processing_time": "5-7 days",
    "active": true,
    "process_ids": [1, 2],  # Optional: existing process IDs
    "overview_ids": [1],     # Optional: existing overview IDs
    "note_ids": [1, 2],      # Optional: existing note IDs
    "required_document_ids": [1, 2, 3]  # Optional: existing document IDs
}
```

### Creating a Visa Type for a Specific Country

```bash
POST /api/admin/countries/1/visa-types/
{
    "name": "Business Visa",
    "headings": "Business visa requirements",
    "description": "Visa for business purposes",
    "price": "200.00",
    "expected_processing_time": "7-10 days",
    "active": true,
    "process_ids": [1, 2],
    "overview_ids": [1],
    "note_ids": [1],
    "required_document_ids": [1, 2]
}
```

### Bulk Assigning Visa Types to a Country

```bash
POST /api/admin/countries/1/bulk-assign-visa-types/
{
    "visa_type_ids": [1, 2, 3, 4]
}
```

### Getting Form Data for Visa Type Creation

```bash
GET /api/admin/form-data/visa-type/
```

Response:
```json
{
    "processes": [...],
    "overviews": [...],
    "notes": [...],
    "required_documents": [...]
}
```

### Getting Countries with Their Visa Types

```bash
GET /api/admin/countries-with-visa-types/
```

Response:
```json
[
    {
        "id": 1,
        "name": "United States",
        "description": "The United States of America",
        "code": "US",
        "image": null,
        "active": true,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "types": [
            {
                "id": 1,
                "name": "Tourist Visa",
                "headings": "Tourist visa requirements",
                "description": "Visa for tourism",
                "price": "150.00",
                "expected_processing_time": "5-7 days",
                "active": true,
                "processes": [...],
                "overviews": [...],
                "notes": [...],
                "required_documents": [...]
            }
        ]
    }
]
```

## Workflow for Setting Up Countries and Visa Types

### Step 1: Create Related Data
First, create the supporting data:

```bash
# Create visa processes
POST /api/admin/visa-process/
{"points": "Submit application online"}

POST /api/admin/visa-process/
{"points": "Pay application fee"}

# Create visa overviews
POST /api/admin/visa-overview/
{"points": "Valid passport required", "overview": "Tourist visa overview"}

# Create notes
POST /api/admin/notes/
{"notes": "Processing time may vary"}

# Create required documents
POST /api/admin/required-documents/
{"document_name": "Passport", "description": "Valid passport with 6 months validity"}
```

### Step 2: Create Visa Types
Create visa types with the related data:

```bash
POST /api/admin/visa-types/
{
    "name": "Tourist Visa",
    "headings": "Tourist Visa Requirements",
    "description": "Visa for tourism purposes",
    "price": "150.00",
    "expected_processing_time": "5-7 days",
    "active": true,
    "process_ids": [1, 2],
    "overview_ids": [1],
    "note_ids": [1],
    "required_document_ids": [1]
}
```

### Step 3: Create Countries
Create countries and optionally assign existing visa types:

```bash
POST /api/admin/countries/
{
    "name": "United States",
    "description": "The United States of America",
    "code": "US",
    "type_ids": [1]  # Assign existing visa type
}
```

### Step 4: Add Visa Types to Countries
Either create new visa types for specific countries or assign existing ones:

```bash
# Create new visa type for a country
POST /api/admin/countries/1/visa-types/
{
    "name": "Business Visa",
    "headings": "Business Visa Requirements",
    "description": "Visa for business purposes",
    "price": "200.00",
    "expected_processing_time": "7-10 days",
    "active": true,
    "process_ids": [1, 2],
    "overview_ids": [1],
    "note_ids": [1],
    "required_document_ids": [1]
}

# Or bulk assign existing visa types
POST /api/admin/countries/1/bulk-assign-visa-types/
{
    "visa_type_ids": [1, 2, 3]
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `204` - No Content (for deletions)

Error responses include detailed error messages:

```json
{
    "error": "Invalid credentials."
}
```

## File Upload

For endpoints that accept file uploads (like images for countries and visa types), use `multipart/form-data`:

```bash
POST /api/admin/countries/
Content-Type: multipart/form-data

{
    "name": "United States",
    "description": "The United States of America",
    "code": "US",
    "image": <file_upload>
}
```

## Best Practices

1. **Create related data first**: Create processes, overviews, notes, and documents before creating visa types
2. **Use bulk operations**: Use bulk assignment for efficiency when assigning multiple visa types
3. **Validate data**: Always check the form data endpoints to see available options
4. **Handle relationships carefully**: When updating relationships, provide all IDs to replace the entire set
5. **Use partial updates**: Use `PATCH` or `PUT` with `partial=True` for updating specific fields 