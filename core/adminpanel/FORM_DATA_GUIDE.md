# Form-Data API Usage Guide

This guide explains how to use `multipart/form-data` with the admin panel API, especially for handling many-to-many relationships.

## Understanding the Issue

When using `form-data` in Postman or other API clients, many-to-many relationship fields are sent as strings instead of arrays. The API has been updated to handle this automatically.

## Supported Formats

### 1. Comma-Separated Values (Recommended)
```
process_ids: 1,2,3
overview_ids: 1
note_ids: 1,2
required_document_ids: 1,2,3
type_ids: 1,2
```

### 2. Single Values
```
process_ids: 1
overview_ids: 1
note_ids: 1
required_document_ids: 1
type_ids: 1
```

### 3. Empty Values (No Relationships)
```
process_ids: (leave empty)
overview_ids: (leave empty)
note_ids: (leave empty)
required_document_ids: (leave empty)
type_ids: (leave empty)
```

## Postman Setup

### Step 1: Set Request Type
1. Select `POST` method
2. Choose `Body` tab
3. Select `form-data` radio button

### Step 2: Add Fields
Add the following fields to your form-data:

| Key | Type | Value | Description |
|-----|------|-------|-------------|
| `name` | Text | `Tourist Visa` | Visa type name |
| `headings` | Text | `Visa requirements` | Headings |
| `description` | Text | `Visa for tourism` | Description |
| `price` | Text | `150.00` | Price |
| `expected_processing_time` | Text | `5-7 days` | Processing time |
| `active` | Text | `true` | Active status |
| `process_ids` | Text | `1,2,3` | Comma-separated process IDs |
| `overview_ids` | Text | `1` | Comma-separated overview IDs |
| `note_ids` | Text | `1,2` | Comma-separated note IDs |
| `required_document_ids` | Text | `1,2,3` | Comma-separated document IDs |
| `image` | File | `visa_image.jpg` | Visa type image (optional) |

## Example Requests

### Creating a Visa Type with Form-Data

**URL:** `POST /api/admin/countries/3/visa-types/`

**Form-Data Fields:**
```
name: Tourist Visa
headings: Tourist visa requirements
description: Visa for tourism purposes
price: 150.00
expected_processing_time: 5-7 days
active: true
process_ids: 1,2,3
overview_ids: 1
note_ids: 1,2
required_document_ids: 1,2
image: [file upload]
```

### Creating a Country with Form-Data

**URL:** `POST /api/admin/countries/`

**Form-Data Fields:**
```
name: United States
description: The United States of America
code: US
type_ids: 1,2,3
image: [file upload]
```

### Bulk Assigning Visa Types

**URL:** `POST /api/admin/countries/3/bulk-assign-visa-types/`

**Form-Data Fields:**
```
visa_type_ids: 1,2,3,4
```

## Error Handling

### Common Errors and Solutions

1. **"Invalid process_ids format"**
   - **Cause:** Non-numeric values in comma-separated list
   - **Solution:** Use only numbers separated by commas (e.g., `1,2,3`)

2. **"Expected pk value, received str"**
   - **Cause:** Using JSON format instead of form-data
   - **Solution:** Switch to form-data and use comma-separated values

3. **"visa_type_ids is required"**
   - **Cause:** Missing required field
   - **Solution:** Add the field even if empty

## Best Practices

### 1. Use Comma-Separated Values
```
✅ Correct: process_ids: 1,2,3
❌ Wrong: process_ids: [1,2,3]
❌ Wrong: process_ids: "1,2,3"
```

### 2. Handle Empty Relationships
```
✅ Correct: process_ids: (leave empty)
✅ Correct: process_ids: 
❌ Wrong: process_ids: null
❌ Wrong: process_ids: []
```

### 3. File Uploads
- Use `File` type for image fields
- Ensure file extensions are allowed (jpg, jpeg, png, pdf, doc, docx)
- Keep file sizes reasonable

### 4. Boolean Values
```
✅ Correct: active: true
✅ Correct: active: false
❌ Wrong: active: "true"
❌ Wrong: active: 1
```

## Testing with Postman

### Step-by-Step Setup

1. **Create a new request**
   - Method: `POST`
   - URL: `http://127.0.0.1:8000/api/admin/countries/3/visa-types/`

2. **Set Headers**
   ```
   Authorization: Bearer your_access_token
   ```

3. **Set Body**
   - Select `form-data`
   - Add fields as shown in examples above

4. **Send Request**
   - Click "Send"
   - Check response for success/errors

## Validation Rules

### Required Fields
- `name` (VisaType, Country)
- `headings` (VisaType)
- `description` (Country)

### Optional Fields
- `process_ids` (comma-separated integers)
- `overview_ids` (comma-separated integers)
- `note_ids` (comma-separated integers)
- `required_document_ids` (comma-separated integers)
- `type_ids` (comma-separated integers)
- `image` (file upload)

### Data Types
- **Text fields:** Regular text input
- **Numeric fields:** Text input with numbers
- **Boolean fields:** Text input with "true" or "false"
- **File fields:** File upload
- **ID fields:** Comma-separated integers

## Troubleshooting

### Issue: "Incorrect type. Expected pk value, received str"
**Solution:** The API now handles this automatically. Make sure you're using comma-separated values like `1,2,3` instead of JSON arrays.

### Issue: File upload fails
**Solution:** 
1. Check file extension is allowed
2. Ensure file size is reasonable
3. Use `File` type in form-data

### Issue: Relationships not saving
**Solution:**
1. Verify the IDs exist in the database
2. Use correct comma-separated format
3. Check for typos in field names

## Example Complete Request

Here's a complete example for creating a visa type:

**URL:** `POST /api/admin/countries/3/visa-types/`

**Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Form-Data:**
```
name: Business Visa
headings: Business visa requirements and process
description: Visa for business purposes
price: 200.00
expected_processing_time: 7-10 days
active: true
process_ids: 1,2,3
overview_ids: 1
note_ids: 1,2
required_document_ids: 1,2,3
image: [upload your file here]
```

**Expected Response:**
```json
{
    "id": 1,
    "name": "Business Visa",
    "headings": "Business visa requirements and process",
    "description": "Visa for business purposes",
    "price": "200.00",
    "expected_processing_time": "7-10 days",
    "active": true,
    "processes": [...],
    "overviews": [...],
    "notes": [...],
    "required_documents": [...],
    "image": "path/to/image.jpg",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
}
``` 