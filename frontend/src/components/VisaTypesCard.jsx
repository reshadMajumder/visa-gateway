import { useNavigate } from 'react-router-dom'
import './VisaTypesCard.css'

const VisaTypesCard = ({ visa, country, index, isLoaded }) => {
  const navigate = useNavigate()

  const handleVisaSelect = () => {
    navigate(`/visa/${country.id}/${visa.id}`, { 
      state: { visa, country } 
    })
  }

  const formatPrice = (price) => {
    if (!price || price === '0.00') return 'Contact Us'
    return `$${price}`
  }

  return (
    <div 
      className={`visa-type-card ${isLoaded ? 'card-visible' : ''}`}
      style={{ 
        animationDelay: `${index * 0.2}s`,
        transform: isLoaded ? 'translateY(0)' : 'translateY(100px)',
        opacity: isLoaded ? 1 : 0
      }}
      onClick={handleVisaSelect}
    >
      <div className="visa-card-image">
        <img 
          src={`http://127.0.0.1:8000${visa.image}`} 
          alt={visa.name}
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
        <div className="visa-image-fallback" style={{ display: 'none' }}>
          <span className="visa-icon">📋</span>
        </div>
        <div className="visa-card-overlay">
          <span className="visa-price-badge">
            {formatPrice(visa.price)}
          </span>
          {/* {visa.active && <span className="visa-status">Active</span>} */}
        </div>
      </div>
      
      <div className="visa-card-content">
        <div className="visa-card-header">
          <h3 className="visa-card-title">{visa.name}</h3>
          
        </div>
                
        {visa.headings && (
            <h4 className="visa-headings">{visa.headings}</h4>
          )}
        
        <div className="visa-highlights">
          {visa.expected_processing_time && (
            <div className="highlight-item">
              <span className="highlight-icon">⏱️</span>
              <span className="highlight-text">{visa.expected_processing_time}</span>
            </div>
          )}
          
          {visa.required_documents && visa.required_documents.length > 0 && (
            <div className="highlight-item">
              <span className="highlight-icon">📄</span>
              <span className="highlight-text">{visa.required_documents.length} Documents</span>
            </div>
          )}
          
          {visa.processes && visa.processes.length > 0 && (
            <div className="highlight-item">
              <span className="highlight-icon">⚡</span>
              <span className="highlight-text">{visa.processes.length} Steps</span>
            </div>
          )}
        </div>
        
        <div className="visa-card-footer">
          <button className="visa-view-button">View Details</button>
        </div>
      </div>
    </div>
  )
}

export default VisaTypesCard
