import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
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
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="visa-details-page">
      <div className="visa-hero">
        <div className="visa-hero-content">
          <div className="container">
            <button className="visa-back-button" onClick={handleBack}>
              ← Back to {country?.name} Visas
            </button>
            <h1 className="visa-hero-title">
              <span className="visa-hero-icon">📄</span>
              {details.name} for {country?.name}
            </h1>
            <h2 className="visa-headings">{details.headings}</h2>
            <p className="visa-hero-subtitle">
              Complete visa processing service with expert guidance
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="visa-details-content">
          <div className="visa-main-info">
            <div className="visa-info-section">
              <h2 className="visa-info-title">Visa Overview</h2>
              <div className="visa-overview">
                {overviews.map((item, index) => (
                  <div key={index} className="overview-item">
                    <h3>{item.overview}</h3>
                    <p>{item.points}</p>
                  </div>
                ))}
              </div>
              
              <div className="visa-details-grid">
                <div className="visa-detail-item">
                  <div className="visa-detail-label">Processing Time</div>
                  <div className="visa-detail-value">{details.processingTime}</div>
                </div>
                <div className="visa-detail-item">
                  <div className="visa-detail-label">Price</div>
                  <div className="visa-detail-value">${details.price}</div>
                </div>
              </div>
            </div>

            <div className="visa-info-section">
              <h2 className="visa-info-title">Required Documents</h2>
              <ul className="requirements-list">
                {documents.map((doc, index) => (
                  <li key={index}>{doc}</li>
                ))}
              </ul>
            </div>

            <div className="visa-info-section">
              <h2 className="visa-info-title">Application Process</h2>
              <ol className="process-steps">
                {process.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="visa-info-section">
              <h2 className="visa-info-title">Important Notes</h2>
              <ul className="notes-list">
                {notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="visa-sidebar">
            <div className="pricing-card">
              <h3 className="pricing-title">Visa Processing Fee</h3>
              <div className="pricing-amount">
                ${details.price || 'Contact for price'}
              </div>
              <div className="pricing-period">Per Application</div>
              
              <button className="apply-now-button" onClick={handleApplyNow}>
                Apply Now
              </button>
            </div>

            <div className="support-card">
              <h3 className="support-title">Need Help?</h3>
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
            <h3>How do you want to apply?</h3>
            <button className="modal-option-btn" onClick={handleApplyWithDocuments}>
              Apply with Documents
            </button>
            <button className="modal-option-btn" onClick={handleApplyWithoutDocuments}>
              Apply without Documents
            </button>
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