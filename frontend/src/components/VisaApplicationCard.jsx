import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './VisaApplicationCard.css'

const VisaApplicationCard = ({ application, onUploadSuccess, onUploadError }) => {
  const [selectedFiles, setSelectedFiles] = useState({})
  const [uploadingDocuments, setUploadingDocuments] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [showUploadSection, setShowUploadSection] = useState(false)
  const navigate = useNavigate()

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
    
    // Find documents that don't have a document_file uploaded
    return application.visa_type.required_documents.filter(doc => !doc.document_file)
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
      
      // Add required fields for v2 API
      formData.append('visa_type_id', application.visa_type.id.toString())
      formData.append('country_id', application.country.id.toString())
      
      // Get documents to upload (missing documents or all required documents for draft)
      const documentsToUpload = application.status === 'draft' 
        ? application.visa_type.required_documents 
        : getMissingDocuments()
      
      // Add files using the new format: required_documents[document_id]
      documentsToUpload.forEach(doc => {
        const file = selectedFiles[doc.id]
        if (file) {
          formData.append(`required_documents[${doc.id}]`, file)
        }
      })

      const response = await fetch(`http://127.0.0.1:8000/api/v2/visa-applications/${application.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        setSelectedFiles({})
        setUploadError('')
        setShowUploadSection(false)
        onUploadSuccess && onUploadSuccess()
        
        // Show success message from API response
        const successMessage = result.message || (application.status === 'draft' 
          ? 'Documents uploaded successfully! Application status updated to submitted.'
          : 'Documents updated successfully!')
        alert(successMessage)
      } else if (response.status === 401) {
        setUploadError('Session expired. Please login again.')
        onUploadError && onUploadError('Session expired. Please login again.')
      } else {
        const errorData = await response.json()
        const errorMessage = errorData.error || errorData.message || 'Failed to upload documents'
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

  const handleViewDetails = () => {
    navigate(`/visa-application/${application.id}`)
  }

  const missingDocuments = getMissingDocuments()
  const needsUpdate = needsDocumentUpdate()

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
          <span className="label">ID:</span>
          <span className="value">#{application.id}</span>
        </div>
        <div className="detail-item">
          <span className="label">Date:</span>
          <span className="value">{formatDate(application.created_at)}</span>
        </div>
        {application.admin_notes && (
          <div className="detail-item admin-notes">
            <span className="label">Notes:</span>
            <span className="value">{application.admin_notes}</span>
          </div>
        )}
        {application.rejection_reason && (
          <div className="detail-item rejection-reason">
            <span className="label">Rejection:</span>
            <span className="value">{application.rejection_reason}</span>
          </div>
        )}
      </div>

      {/* Show uploaded documents count */}
      {application.visa_type.required_documents && application.visa_type.required_documents.length > 0 && (
        <div className="documents-summary">
          <span className="documents-count">
            📎 {application.visa_type.required_documents.filter(doc => doc.document_file).length} of {application.visa_type.required_documents.length} document{application.visa_type.required_documents.length !== 1 ? 's' : ''} uploaded
          </span>
        </div>
      )}

      {/* Show upload section for missing documents or rejected applications */}
      {needsUpdate && (
        <div className="upload-section">
          {!showUploadSection ? (
            <button 
              className="upload-toggle-button"
              onClick={() => setShowUploadSection(true)}
            >
              {application.status === 'draft' ? 'Upload Documents' : 
               application.status === 'rejected' ? 'Update Documents' : 'Upload Missing Documents'}
            </button>
          ) : (
            <div className="upload-fields">
              <div className="upload-header">
                <h4>
                  {application.status === 'draft' ? 'Required Documents' : 
                   application.status === 'rejected' ? 'Update Documents' : 'Missing Documents'}
                </h4>
                <button 
                  className="close-upload"
                  onClick={() => setShowUploadSection(false)}
                >
                  ×
                </button>
              </div>
              
              {uploadError && (
                <div className="error-message upload-error">
                  {uploadError}
                  <button onClick={() => setUploadError('')} className="close-error">×</button>
                </div>
              )}

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
                     application.status === 'draft' ? 'Upload & Submit' :
                     application.status === 'rejected' ? 'Update Documents' : 'Upload Documents'}
                  </button>
                )
              })()}
            </div>
          )}
        </div>
      )}

      <div className="application-actions">
        <button className="action-button primary" onClick={handleViewDetails}>
          View Details
        </button>
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
