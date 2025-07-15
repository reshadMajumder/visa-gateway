import { useParams, useLocation, useNavigate } from 'react-router-dom'
import './VisaDetails.css'

const VisaDetails = () => {
  const { countryId, visaId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  // Get visa and country data from location state
  const visa = location.state?.visa || {
    id: parseInt(visaId),
    name: 'Visa',
    description: 'Visa description',
    duration: '30 days',
    price: '$150',
    features: ['Feature 1', 'Feature 2'],
    processingTime: '5-7 days'
  }
  
  const country = location.state?.country || {
    id: parseInt(countryId),
    name: 'Country',
    flag: '🌍'
  }

  // Get visa-specific requirements based on visa type and country
  const getVisaRequirements = () => {
    if (country?.name === 'Romania' && visa.name.includes('Work')) {
      return [
        'Valid passport with at least 6 months validity',
        'Completed visa application form',
        'Recent passport-sized photographs (2 copies)',
        'Job offer letter from Romanian employer',
        'Work permit from Romanian authorities',
        'Proof of accommodation in Romania',
        'Medical insurance valid in Romania',
        'Criminal background check',
        'Educational certificates and diplomas',
        'Proof of financial means (minimum €500/month)',
        'Employment contract or job agreement',
        'Company registration documents (if self-employed)'
      ]
    }
    
    return [
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
  }

  const getApplicationProcess = () => {
    if (country?.name === 'Romania') {
      return [
        'Initial consultation and document review',
        'Complete online visa application form',
        'Gather and prepare all required documents',
        'Submit application to Romanian embassy/consulate',
        'Pay visa processing fees',
        'Schedule biometric appointment (if required)',
        'Attend embassy interview (if required)',
        'Wait for visa processing (7-12 months)',
        'Collect visa or receive notification',
        'Travel to Romania and complete entry procedures'
      ]
    }
    
    return [
      'Complete online application form',
      'Upload required documents',
      'Pay visa processing fees',
      'Schedule biometric appointment',
      'Attend embassy interview (if required)',
      'Track application status',
      'Collect visa or receive by mail'
    ]
  }

  const getPricingFeatures = () => {
    if (country?.name === 'Romania') {
      return [
        'Complete document preparation',
        'Application form assistance',
        'Embassy appointment scheduling',
        'Interview preparation',
        'Status tracking throughout process',
        'Expert consultation',
        'Post-arrival support',
        '24/7 customer support'
      ]
    }
    
    return [
      'Document review',
      'Application submission',
      'Status tracking',
      'Expert consultation',
      '24/7 customer support'
    ]
  }
  
  const getVisaDescription = () => {
    if (country?.name === 'Romania' && visa.name.includes('Work')) {
      return `Romania Work Visa allows you to live and work in Romania for an extended period. This visa is perfect for skilled workers, professionals, and those seeking employment opportunities in various sectors including construction, hospitality, transportation, and more. Romania offers excellent work opportunities with competitive salaries ranging from €700-€1000 per month, accommodation provided by employers, and a pathway to European residency.`
    }
    
    return visa.description
  }
  
  const getVisaDetails = () => {
    if (country?.name === 'Romania' && visa.name.includes('Work')) {
      return {
        duration: '1-2 years (renewable)',
        processingTime: '7-12 months',
        validity: '2 years',
        entryType: 'Multiple Entry',
        salary: '€700 - €1000/month',
        accommodation: 'Provided by company'
      }
    }
    
    return {
      duration: visa.duration,
      processingTime: visa.processingTime,
      validity: '6 months',
      entryType: 'Multiple Entry'
    }
  }
  
  const visaDetails = getVisaDetails()
  const detailedRequirements = getVisaRequirements()
  const applicationProcess = getApplicationProcess()
  const pricingFeatures = getPricingFeatures()

  const handleBack = () => {
    navigate(`/country/${countryId}`, { state: { country } })
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
              {visa.name} for {country?.name}
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
                {getVisaDescription()}
              </p>
              
              <div className="visa-details-grid">
                <div className="visa-detail-item">
                  <div className="visa-detail-label">Duration</div>
                  <div className="visa-detail-value">{visaDetails.duration}</div>
                </div>
                <div className="visa-detail-item">
                  <div className="visa-detail-label">Processing Time</div>
                  <div className="visa-detail-value">{visaDetails.processingTime}</div>
                </div>
                <div className="visa-detail-item">
                  <div className="visa-detail-label">Validity</div>
                  <div className="visa-detail-value">{visaDetails.validity}</div>
                </div>
                <div className="visa-detail-item">
                  <div className="visa-detail-label">Entry Type</div>
                  <div className="visa-detail-value">{visaDetails.entryType}</div>
                </div>
                {visaDetails.salary && (
                  <div className="visa-detail-item">
                    <div className="visa-detail-label">Salary Range</div>
                    <div className="visa-detail-value">{visaDetails.salary}</div>
                  </div>
                )}
                {visaDetails.accommodation && (
                  <div className="visa-detail-item">
                    <div className="visa-detail-label">Accommodation</div>
                    <div className="visa-detail-value">{visaDetails.accommodation}</div>
                  </div>
                )}
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
                {country?.name === 'Romania' ? (
                  <>
                    • Processing time is 7-12 months - plan accordingly for your travel dates.<br/>
                    • All documents must be translated into Romanian or English by certified translators.<br/>
                    • Job offer must be from a registered Romanian company with valid work permits.<br/>
                    • Accommodation is typically provided by the employer as part of the package.<br/>
                    • Payment is made only after visa approval - no upfront fees required.<br/>
                    • Visa allows multiple entries and can lead to permanent residency.<br/>
                    • Medical insurance is mandatory and must be valid throughout your stay.<br/>
                    • Minimum salary guarantee of €700-€1000 per month depending on the position.
                  </>
                ) : (
                  <>
                    • Processing times may vary depending on the embassy workload and individual circumstances.<br/>
                    • All documents must be translated into English if originally in another language.<br/>
                    • Visa approval is subject to embassy discretion and meeting all requirements.<br/>
                    • Additional documents may be requested during the application process.<br/>
                    • Fees are non-refundable regardless of visa decision.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="visa-sidebar">
            <div className="pricing-card">
              <h3 className="pricing-title">Visa Processing Fee</h3>
              <div className="pricing-amount">
                {country?.name === 'Romania' ? 'Payment After Visa' : visa.price}
              </div>
              <div className="pricing-period">
                {country?.name === 'Romania' ? 'No Upfront Payment' : 'Per Application'}
              </div>
              
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
                {country?.name === 'Romania' ? 
                  'Our Romania visa specialists are here to guide you through the work visa process. Get expert assistance for job placement and visa processing.' :
                  'Our visa experts are here to assist you with your application. Get personalized guidance and support throughout the process.'
                }
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