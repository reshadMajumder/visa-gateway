import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ChildHero from '../components/ChildHero'
import './css/VisaDetails.css'

const VisaDetails = () => {
  const { countryId, visaId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [visaDetails, setVisaDetails] = useState(null)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const country = location.state?.country || {
    id: parseInt(countryId),
    name: 'Country',
    flag: '🌍'
  }

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/visa-types/${visaId}/`)
      .then(response => response.json())
      .then(data => {
        console.log('Visa Details API Response:', data) // Debug log
        setVisaDetails(data)
      })
      .catch(error => console.error('Error fetching visa details:', error))
  }, [visaId])

  const getRequiredDocuments = () => {
    return visaDetails?.required_documents?.map(doc => doc.document_name) || []
  }

  const getApplicationProcess = () => {
    return visaDetails?.processes?.map(process => process.points) || []
  }

  const getOverviews = () => {
    return visaDetails?.overviews?.map(item => ({
      points: item.points,
      overview: item.overview
    })) || []
  }

  const getNotes = () => {
    return visaDetails?.notes?.map(note => note.notes) || []
  }
  
  const getVisaDescription = () => {
    return visaDetails?.description || ''
  }
  
  const getVisaDetails = () => {
    if (!visaDetails) return {}
    
    return {
      name: visaDetails.name,
      headings: visaDetails.headings,
      price: visaDetails.price,
      processingTime: visaDetails.expected_processing_time || 'Contact for details'
    }
  }
  
  const details = getVisaDetails()
  const documents = getRequiredDocuments()
  const process = getApplicationProcess()
  const overviews = getOverviews()
  const notes = getNotes()
  
  const handleBack = () => {
    navigate(`/country/${countryId}`, { state: { country } })
  }

  const handleApplyNow = () => {
    setShowApplyModal(true)
  }

  const handleApplyWithDocuments = () => {
    setShowApplyModal(false)
    navigate('/apply-with-documents', { state: { countryId: country.id, visaTypeId: parseInt(visaId) } })
  }

  const handleApplyWithoutDocuments = async () => {
    setShowApplyModal(false)
    
    // Get token from localStorage
    const token = localStorage.getItem('accessToken')
    
    try {
      const formData = new FormData();
      formData.append('country_id', country.id);
      formData.append('visa_type_id', parseInt(visaId));
      
      const response = await fetch('http://127.0.0.1:8000/api/v2/visa-applications/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      
      if (response.ok) {
        alert('Application created successfully! You can upload documents later from your account.')
        navigate('/account')
      } else {
        const errorData = await response.json()
        alert(`Failed to create application: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      alert('Failed to create application. Please try again.')
    }
  }

  if (!visaDetails) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading visa details...</p>
      </div>
    )
  }

  return (
    <div className="visa-details-page">
      {/* Hero Section */}
      {/* <div className="visa-hero">
        <div className="container">
          <div className="visa-hero-content">
            <button className="visa-back-button" onClick={handleBack}>
              ← Back to {country.name}
            </button>
            
            <div className="visa-hero-main">
              <div className="visa-hero-info">
                <div className="visa-hero-badge">
                  <span className="country-flag">{country.flag}</span>
                  <span className="country-name">{country.name}</span>
                </div>
                <h1 className="visa-hero-title">
                  {details.name}
                </h1>
                <p className="visa-hero-subtitle">
                  Visa Application Guide
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <div className="container">
          <nav className="breadcrumb-nav">
            <a href="/" className="breadcrumb-item">Home</a>
            <span className="breadcrumb-separator">/</span>
            <a href={`/country/${countryId}`} className="breadcrumb-item">{country.name}</a>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">{details.name}</span>
          </nav>
        </div>
      </div>

      <div className="container">
        <div className="visa-details-content">
          <div className="visa-main-info">
            {/* Overview Section */}
            <div className="visa-info-section">
              <div className="section-header">
                <div className="section-icon">📋</div>
                <h2 className="visa-info-title">Visa Overview</h2>
              </div>
              <div className="visa-overview">
                {overviews.map((item, index) => (
                  <div key={index} className="overview-item">
                    <h3 className="overview-title">{item.overview}</h3>
                    <p className="overview-content">{item.points}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="visa-info-section">
              <div className="section-header">
                <div className="section-icon">⚡</div>
                <h2 className="visa-info-title">Quick Information</h2>
              </div>
              <div className="visa-details-grid">
                <div className="visa-detail-item">
                  <div className="detail-icon">⏱️</div>
                  <div className="detail-content">
                    <div className="visa-detail-label">Processing Time</div>
                    <div className="visa-detail-value">{details.processingTime}</div>
                  </div>
                </div>
                <div className="visa-detail-item">
                  <div className="detail-icon">💰</div>
                  <div className="detail-content">
                    <div className="visa-detail-label">Processing Fee</div>
                    <div className="visa-detail-value">${details.price}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Required Documents Section */}
            <div className="visa-info-section">
              <div className="section-header">
                <div className="section-icon">📄</div>
                <h2 className="visa-info-title">Required Documents</h2>
              </div>
              <div className="documents-container">
                {documents.map((doc, index) => (
                  <div key={index} className="document-item">
                    <div className="document-icon">📋</div>
                    <span className="document-name">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Process Section */}
            <div className="visa-info-section">
              <div className="section-header">
                <div className="section-icon">🔄</div>
                <h2 className="visa-info-title">Application Process</h2>
              </div>
              <div className="process-container">
                {process.map((step, index) => (
                  <div key={index} className="process-step">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-content">{step}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Notes Section */}
            <div className="visa-info-section">
              <div className="section-header">
                <div className="section-icon">⚠️</div>
                <h2 className="visa-info-title">Important Notes</h2>
              </div>
              <div className="notes-container">
                {notes.map((note, index) => (
                  <div key={index} className="note-item">
                    <div className="note-icon">💡</div>
                    <span className="note-content">{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="visa-sidebar">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-title">Visa Processing Fee</h3>
                <div className="pricing-badge">Best Value</div>
              </div>
              <div className="pricing-amount">
                ${details.price || 'Contact for price'}
              </div>
              <div className="pricing-period">Per Application</div>
              
              <div className="pricing-features">
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <span>Expert guidance</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <span>Document review</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <span>Application tracking</span>
                </div>
              </div>
              
              <button className="apply-now-button" onClick={handleApplyNow}>
                Apply Now
              </button>
            </div>

            <div className="support-card">
              <div className="support-icon">🎯</div>
              <h3 className="support-title">Need Expert Help?</h3>
              <p className="support-text">
                Our visa experts are here to assist you with your application. Get personalized guidance and support throughout the process.
              </p>
              <button className="contact-button">
                Contact Expert
              </button>
            </div>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <div className="apply-modal-overlay">
          <div className="apply-modal">
            <div className="modal-header">
              <h3>Choose Your Application Method</h3>
              <p>Select how you'd like to proceed with your visa application</p>
            </div>
            <div className="modal-options">
              <button className="modal-option-btn primary" onClick={handleApplyWithDocuments}>
                <div className="option-icon">📁</div>
                <div className="option-content">
                  <div className="option-title">Apply with Documents</div>
                  <div className="option-subtitle">Upload all required documents now</div>
                </div>
              </button>
              <button className="modal-option-btn secondary" onClick={handleApplyWithoutDocuments}>
                <div className="option-icon">⏳</div>
                <div className="option-content">
                  <div className="option-title">Apply without Documents</div>
                  <div className="option-subtitle">Upload documents later from your account</div>
                </div>
              </button>
            </div>
            <button className="modal-cancel-btn" onClick={() => setShowApplyModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default VisaDetails