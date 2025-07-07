import './VisaDetails.css'

const VisaDetails = ({ visa, onBack }) => {
  if (!visa) return null

  const { name, icon, description, duration, price, features, processingTime, country } = visa

  const detailedRequirements = [
    'Valid passport with at least 6 months validity',
    'Completed visa application form',
    'Recent passport-sized photographs (2 copies)',
    'Proof of financial means (bank statements)',
    'Travel itinerary and accommodation bookings',
    'Travel insurance coverage',
    'Employment letter or business registration',
    'Educational certificates (if applicable)',
    'Medical examination report (if required)',
    'Police clearance certificate (if required)'
  ]

  const applicationProcess = [
    'Complete online application form',
    'Upload required documents',
    'Pay visa processing fees',
    'Schedule biometric appointment',
    'Attend embassy interview (if required)',
    'Track application status',
    'Collect visa or receive by mail'
  ]

  const pricingFeatures = [
    'Document review',
    'Application submission',
    'Status tracking',
    'Expert consultation',
    '24/7 customer support'
  ]

  return (
    <div className="visa-details-page">
      <div className="visa-hero">
        <div className="visa-hero-content">
          <div className="container">
            <button className="visa-back-button" onClick={onBack}>
              ← Back to {country?.name} Visas
            </button>
            <h1 className="visa-hero-title">
              <span className="visa-hero-icon">{icon}</span>
              {name} for {country?.name}
            </h1>
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
              <p className="visa-description-text">
                {description}. This visa allows you to stay in {country?.name} for {duration} 
                and is perfect for your specific travel needs. Our expert team will guide you 
                through the entire application process to ensure a smooth and successful experience.
              </p>
              
              <div className="visa-details-grid">
                <div className="visa-detail-item">
                  <div className="visa-detail-label">Duration</div>
                  <div className="visa-detail-value">{duration}</div>
                </div>
                <div className="visa-detail-item">
                  <div className="visa-detail-label">Processing Time</div>
                  <div className="visa-detail-value">{processingTime}</div>
                </div>
                <div className="visa-detail-item">
                  <div className="visa-detail-label">Validity</div>
                  <div className="visa-detail-value">6 months</div>
                </div>
                <div className="visa-detail-item">
                  <div className="visa-detail-label">Entry Type</div>
                  <div className="visa-detail-value">Multiple Entry</div>
                </div>
              </div>
            </div>

            <div className="visa-info-section">
              <h2 className="visa-info-title">Required Documents</h2>
              <ul className="requirements-list">
                {detailedRequirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>

            <div className="visa-info-section">
              <h2 className="visa-info-title">Application Process</h2>
              <ol className="process-steps">
                {applicationProcess.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="visa-info-section">
              <h2 className="visa-info-title">Important Notes</h2>
              <p className="visa-description-text">
                • Processing times may vary depending on the embassy workload and individual circumstances.<br/>
                • All documents must be translated into English if originally in another language.<br/>
                • Visa approval is subject to embassy discretion and meeting all requirements.<br/>
                • Additional documents may be requested during the application process.<br/>
                • Fees are non-refundable regardless of visa decision.
              </p>
            </div>
          </div>

          <div className="visa-sidebar">
            <div className="pricing-card">
              <h3 className="pricing-title">Visa Processing Fee</h3>
              <div className="pricing-amount">{price}</div>
              <div className="pricing-period">Per Application</div>
              
              <ul className="pricing-features">
                {pricingFeatures.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              
              <button className="apply-now-button">
                Apply Now
              </button>
            </div>

            <div className="support-card">
              <h3 className="support-title">Need Help?</h3>
              <p className="support-text">
                Our visa experts are here to assist you with your application. 
                Get personalized guidance and support throughout the process.
              </p>
              <button className="contact-button">
                Contact Expert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VisaDetails