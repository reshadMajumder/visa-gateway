import { useState } from 'react'
import './VisaApplicationCard.css'

const VisaApplicationCard = ({ application, onUploadSuccess, onUploadError }) => {
  const [selectedFiles, setSelectedFiles] = useState({})
  const [uploadingDocuments, setUploadingDocuments] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return '#6b7280'
      case 'submitted': return '#fbbf24'
      case 'approved': return '#10b981'
      case 'rejected': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft': return '📄'
      case 'submitted': return '⏳'
      case 'approved': return '✅'
      case 'rejected': return '❌'
      default: return '📄'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'draft': return 'Draft'
      case 'submitted': return 'Submitted'
      case 'approved': return 'Approved'
      case 'rejected': return 'Rejected'
      default: return status
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#fbbf24'
      case 'approved': return '#10b981'
      case 'rejected': return '#ef4444'
      default: return '#6b7280'
    }
  }

  // Get missing documents by comparing visa type requirements with uploaded documents
  const getMissingDocuments = () => {
    if (!application.visa_type.required_documents) return []
    
    const uploadedDocIds = application.required_documents?.map(doc => doc.required_document_id) || []
    return application.visa_type.required_documents.filter(doc => !uploadedDocIds.includes(doc.id))
  }

  // Check if application needs document updates (draft, missing docs, or rejected)
  const needsDocumentUpdate = () => {
    const missingDocs = getMissingDocuments()
    return application.status === 'draft' || 
           missingDocs.length > 0 || 
           (application.status === 'rejected' && application.rejection_reason)
  }

  const handleDocumentFileChange = (documentId, e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFiles(prev => ({
        ...prev,
        [documentId]: file
      }))
    }
  }

  const handleUploadDocuments = async () => {
    try {
      setUploadingDocuments(true)
      setUploadError('')
      
      const accessToken = localStorage.getItem('accessToken')
      const formData = new FormData()
      
      // Add application IDs
      formData.append('visa_type_id', application.visa_type.id.toString())
      formData.append('country_id', application.country.id.toString())
      
      // Get documents to upload (missing documents or all required documents for draft)
      const documentsToUpload = application.status === 'draft' 
        ? application.visa_type.required_documents 
        : getMissingDocuments()
      
      // Create the required_documents_files JSON
      const documentsArray = documentsToUpload.map(doc => ({
        required_document_id: doc.id
      }))
      formData.append('required_documents_files', JSON.stringify(documentsArray))
      
      // Add files
      documentsToUpload.forEach(doc => {
        const file = selectedFiles[doc.id]
        if (file) {
          formData.append(`file_${doc.id}`, file)
        }
      })

      const response = await fetch(`http://127.0.0.1:8000/api/visa-applications/${application.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData
      })

      if (response.ok) {
        setSelectedFiles({})
        setUploadError('')
        onUploadSuccess && onUploadSuccess()
        const successMessage = application.status === 'draft' 
          ? 'Documents uploaded successfully! Application status updated to submitted.'
          : 'Documents updated successfully!'
        alert(successMessage)
      } else if (response.status === 401) {
        setUploadError('Session expired. Please login again.')
        onUploadError && onUploadError('Session expired. Please login again.')
      } else {
        const errorData = await response.json()
        const errorMessage = errorData.error || 'Failed to upload documents'
        setUploadError(errorMessage)
        onUploadError && onUploadError(errorMessage)
      }
    } catch (error) {
      const errorMessage = 'Network error. Please try again.'
      setUploadError(errorMessage)
      onUploadError && onUploadError(errorMessage)
    } finally {
      setUploadingDocuments(false)
    }
  }

  const refreshToken = async () => {
    const refreshTokenValue = localStorage.getItem('refreshToken')
    if (!refreshTokenValue) return false

    try {
      const response = await fetch('http://127.0.0.1:8000/api/accounts/login/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshTokenValue })
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('accessToken', data.access)
        if (data.refresh) {
          localStorage.setItem('refreshToken', data.refresh)
        }
        return true
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
    }
    return false
  }

  const missingDocuments = getMissingDocuments()
  const showUploadSection = needsDocumentUpdate()

  return (
    <div className="application-card">
      <div className="application-header">
        <div className="country-info">
          <div className="country-image">
            <img 
              src={`http://127.0.0.1:8000${application.country.image}`} 
              alt={application.country.name}
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'block'
              }}
            />
            <span className="country-flag" style={{ display: 'none' }}>
              {application.country.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3>{application.country.name}</h3>
            <p>{application.visa_type.name}</p>
          </div>
        </div>
        <div className="status-badge" style={{ backgroundColor: getStatusColor(application.status) }}>
          <span className="status-icon">{getStatusIcon(application.status)}</span>
          {getStatusText(application.status)}
        </div>
      </div>

      <div className="application-details">
        <div className="detail-item">
          <span className="label">Application ID:</span>
          <span className="value">#{application.id}</span>
        </div>
        <div className="detail-item">
          <span className="label">Application Date:</span>
          <span className="value">{formatDate(application.created_at)}</span>
        </div>
        <div className="detail-item">
          <span className="label">Last Updated:</span>
          <span className="value">{formatDate(application.updated_at)}</span>
        </div>
        {application.admin_notes && (
          <div className="detail-item admin-notes">
            <span className="label">Admin Notes:</span>
            <span className="value">{application.admin_notes}</span>
          </div>
        )}
        {application.rejection_reason && (
          <div className="detail-item rejection-reason">
            <span className="label">Rejection Reason:</span>
            <span className="value">{application.rejection_reason}</span>
          </div>
        )}
      </div>

      {/* Show uploaded documents if any */}
      {application.required_documents && application.required_documents.length > 0 && (
        <div className="documents-section">
          <h4>Uploaded Documents</h4>
          <div className="documents-list">
            {application.required_documents.map((doc) => (
              <div key={doc.id} className="document-item">
                <div className="document-info">
                  <span className="document-name">{doc.document_name}</span>
                  <span 
                    className="document-status"
                    style={{ backgroundColor: getDocumentStatusColor(doc.status) }}
                  >
                    {doc.status}
                  </span>
                </div>
                {doc.file && (
                  <a 
                    href={`http://127.0.0.1:8000${doc.file}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="document-link"
                  >
                    View Document
                  </a>
                )}
                {doc.rejection_reason && (
                  <div className="document-rejection">
                    <span className="rejection-label">Rejection:</span>
                    <span className="rejection-reason">{doc.rejection_reason}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show upload section for missing documents or rejected applications */}
      {showUploadSection && (
        <div className="required-documents-section">
          <h4>
            {application.status === 'draft' ? 'Required Documents' : 
             application.status === 'rejected' ? 'Update Documents' : 'Missing Documents'}
          </h4>
          <p className="section-description">
            {application.status === 'draft' && 'Upload the following documents to complete your application:'}
            {application.status === 'rejected' && 'Please update the following documents based on the rejection feedback:'}
            {application.status !== 'draft' && application.status !== 'rejected' && 'Please upload the following missing documents:'}
          </p>
          
          {uploadError && (
            <div className="error-message upload-error">
              {uploadError}
              <button onClick={() => setUploadError('')} className="close-error">×</button>
            </div>
          )}

          <div className="upload-fields">
            {(() => {
              const documentsToShow = application.status === 'draft' 
                ? application.visa_type.required_documents 
                : missingDocuments
              
              return documentsToShow.length > 0 ? (
                documentsToShow.map((doc) => (
                  <div key={doc.id} className="upload-field">
                    <label>{doc.document_name}</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => handleDocumentFileChange(doc.id, e)}
                      className="file-input"
                    />
                    {selectedFiles[doc.id] && (
                      <span className="file-selected">
                        ✓ {selectedFiles[doc.id].name}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-documents">No documents required for this visa type.</p>
              )
            })()}
          </div>

          {(() => {
            const documentsToShow = application.status === 'draft' 
              ? application.visa_type.required_documents 
              : missingDocuments
            
            return documentsToShow.length > 0 && (
              <button 
                className="upload-button"
                onClick={handleUploadDocuments}
                disabled={uploadingDocuments}
              >
                {uploadingDocuments ? 'Uploading...' : 
                 application.status === 'draft' ? 'Upload Documents & Submit' :
                 application.status === 'rejected' ? 'Update Documents' : 'Upload Missing Documents'}
              </button>
            )
          })()}
        </div>
      )}

      {/* Show complete application button for draft applications without required documents */}
      {application.status === 'draft' && (!application.visa_type.required_documents || application.visa_type.required_documents.length === 0) && (
        <div className="complete-application-section">
          <h4>Complete Application</h4>
          <p className="section-description">
            No documents are required for this visa type. You can complete your application now.
          </p>
          <button 
            className="complete-button"
            onClick={handleUploadDocuments}
            disabled={uploadingDocuments}
          >
            {uploadingDocuments ? 'Completing...' : 'Complete Application'}
          </button>
        </div>
      )}

      <div className="application-actions">
        <button className="action-button primary">View Details</button>
        {application.status === 'submitted' && (
          <button className="action-button secondary">Track Status</button>
        )}
        {application.status === 'rejected' && (
          <button className="action-button secondary">Reapply</button>
        )}
      </div>
    </div>
  )
}

export default VisaApplicationCard
