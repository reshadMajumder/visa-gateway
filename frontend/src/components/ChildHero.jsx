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
    <section 
      className={`child-hero w-[98vw] md:w-[85vw] mx-auto rounded-lg mt-6 ${customClass}`}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}>
    
      <div className="child-hero-overlay">
        <div className="container">
          {showBackButton && (
            <button className="child-hero-back-button" onClick={handleBack}>
              ← {backButtonText || 'Back'}
            </button>
          )}
          <div className="child-hero-content">
            <div className="child-hero-left">
              {icon && (
                <div className="child-hero-icon">
                  {icon}
                </div>
              )}
              <h1 className="child-hero-title">{title}</h1>
              {subtitle && (
                <h2 className="child-hero-subtitle">
                  {subtitle}
                </h2>
              )}
              {description && (
                <p className="child-hero-description">
                  {description}
                </p>
              )}
            </div>
            <div className="child-hero-right">
              {/* Right side content can be added here */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChildHero
