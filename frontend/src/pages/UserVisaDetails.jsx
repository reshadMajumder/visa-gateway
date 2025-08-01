import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './UserVisaDetails.css'

const UserVisaDetails = () => {
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchApplicationDetails()
  }, [applicationId])

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true)
      const accessToken = localStorage.getItem('accessToken')
      
      if (!accessToken) {
        setError('Please login to view application details')
        setLoading(false)
        return
      }

      const response = await fetch(`http://127.0.0.1:8000/api/v2/visa-applications/${applicationId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        setApplication(data)
      } else if (response.status === 401) {
        setError('Session expired. Please login again.')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
      } else {
        setError('Failed to fetch application details')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (loading) {
    return (
      <div className="visa-details-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading application details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="visa-details-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchApplicationDetails} className="retry-button">Try Again</button>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="visa-details-page">
        <div className="error-container">
          <p className="error-message">Application not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="visa-details-page">
      <div className="details-header">
        <div className="container">
          <button className="back-button" onClick={() => navigate('/account')}>
            ← Back to Account
          </button>
          <div className="header-content">
            <div className="application-info">
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
                  <h1>{application.country.name} - {application.visa_type.name}</h1>
                  <p>Application #{application.id}</p>
                </div>
              </div>
              <div className="status-badge" style={{ backgroundColor: getStatusColor(application.status) }}>
                <span className="status-icon">{getStatusIcon(application.status)}</span>
                {getStatusText(application.status)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="details-content">
          <div className="details-grid">
            <div className="main-details">
              <div className="detail-section">
                <h2>Application Information</h2>
                <div className="detail-cards">
                  <div className="detail-card">
                    <div className="detail-label">Application ID</div>
                    <div className="detail-value">#{application.id}</div>
                  </div>
                  <div className="detail-card">
                    <div className="detail-label">Application Date</div>
                    <div className="detail-value">{formatDate(application.created_at)}</div>
                  </div>
                  <div className="detail-card">
                    <div className="detail-label">Last Updated</div>
                    <div className="detail-value">{formatDate(application.updated_at)}</div>
                  </div>
                  <div className="detail-card">
                    <div className="detail-label">Status</div>
                    <div className="detail-value status-value" style={{ color: getStatusColor(application.status) }}>
                      {getStatusIcon(application.status)} {getStatusText(application.status)}
                    </div>
                  </div>
                </div>
              </div>

              {application.admin_notes && (
                <div className="detail-section">
                  <h2>Admin Notes</h2>
                  <div className="notes-content">
                    <p>{application.admin_notes}</p>
                  </div>
                </div>
              )}

              {application.rejection_reason && (
                <div className="detail-section">
                  <h2>Rejection Reason</h2>
                  <div className="rejection-content">
                    <p>{application.rejection_reason}</p>
                  </div>
                </div>
              )}

              {application.visa_type.required_documents && application.visa_type.required_documents.length > 0 && (
                <div className="detail-section">
                  <h2>Uploaded Documents</h2>
                  <div className="documents-grid">
                    {application.visa_type.required_documents.map((doc) => (
                      <div key={doc.id} className="document-card">
                        <div className="document-header">
                          <span className="document-name">{doc.document_name}</span>
                          <span 
                            className="document-status"
                            style={{ backgroundColor: getDocumentStatusColor(doc.status) }}
                          >
                            {doc.status}
                          </span>
                        </div>
                        {doc.document_file && (
                          <a 
                            href={`http://127.0.0.1:8000${doc.document_file}`} 
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
            </div>

            <div className="sidebar">
              <div className="visa-info-card">
                <h3>Visa Information</h3>
                <div className="visa-details">
                  <div className="visa-detail-item">
                    <span className="label">Country</span>
                    <span className="value">{application.country.name}</span>
                  </div>
                  <div className="visa-detail-item">
                    <span className="label">Visa Type</span>
                    <span className="value">{application.visa_type.name}</span>
                  </div>
                  <div className="visa-detail-item">
                    <span className="label">Required Documents</span>
                    <span className="value">{application.visa_type.required_documents?.length || 0}</span>
                  </div>
                </div>
              </div>

              <div className="actions-card">
                <h3>Actions</h3>
                <div className="action-buttons">
                  {application.status === 'draft' && (
                    <button className="action-button primary">
                      Complete Application
                    </button>
                  )}
                  {application.status === 'rejected' && (
                    <button className="action-button secondary">
                      Reapply
                    </button>
                  )}
                  <button className="action-button outline">
                    Download Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserVisaDetails
