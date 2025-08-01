import React from 'react'
import { useNavigate } from 'react-router-dom'
import './ChildHero.css'

const ChildHero = ({ 
  title, 
  subtitle, 
  description, 
  backButtonText, 
  backButtonPath, 
  icon, 
  backgroundImage,
  showBackButton = true,
  customClass = ''
}) => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (backButtonPath) {
      navigate(backButtonPath)
    } else {
      navigate(-1)
    }
  }

  return (
    <div className={`child-hero ${customClass}`}>
      {backgroundImage && (
        <div className="hero-background">
          <img src={`http://127.0.0.1:8000/media/${backgroundImage}`} alt="Hero background" />
          <div className="hero-overlay"></div>
        </div>
      )}
      
      <div className="hero-content">
        <div className="container">
          {showBackButton && (
            <button className="hero-back-button" onClick={handleBack}>
              ← {backButtonText || 'Back'}
            </button>
          )}
          
          <div className="hero-text-content">
            {icon && (
              <div className="hero-icon">
                {icon}
              </div>
            )}
            
            <h1 className="hero-title">
              {title}
            </h1>
            
            {subtitle && (
              <h2 className="hero-subtitle">
                {subtitle}
              </h2>
            )}
            
            {description && (
              <p className="hero-description">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChildHero
