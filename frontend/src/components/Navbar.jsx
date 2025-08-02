import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCountriesDropdownOpen, setIsCountriesDropdownOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [countries, setCountries] = useState([])
  const location = useLocation()
  const navigate = useNavigate()

  const checkAuthStatus = () => {
    const accessToken = localStorage.getItem('accessToken')
    const userData = localStorage.getItem('user')
    
    console.log('Checking auth status:', { accessToken: !!accessToken, userData: !!userData })
    
    if (accessToken && userData) {
      console.log('Setting authenticated to true')
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
    } else {
      console.log('Setting authenticated to false')
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  // Force re-render when auth state changes
  useEffect(() => {
    const interval = setInterval(() => {
      const accessToken = localStorage.getItem('accessToken')
      const userData = localStorage.getItem('user')
      const shouldBeAuthenticated = !!(accessToken && userData)
      
      if (shouldBeAuthenticated !== isAuthenticated) {
        console.log('Auth state mismatch detected, updating...')
        checkAuthStatus()
      }
    }, 1000) // Check every second

    return () => clearInterval(interval)
  }, [isAuthenticated])

  useEffect(() => {
    // Fetch countries from API
    fetch('http://127.0.0.1:8000/api/countries/')
      .then(response => response.json())
      .then(data => {
        setCountries(data)
      })
      .catch(error => {
        console.error('Error fetching countries:', error)
      })
  }, [])

  useEffect(() => {
    // Check if user is authenticated on component mount
    checkAuthStatus()

    // Listen for authentication state changes
    const handleAuthChange = () => {
      console.log('Auth state changed event received')
      checkAuthStatus()
    }

    // Add event listener for authentication changes
    window.addEventListener('authStateChanged', handleAuthChange)

    // Cleanup event listener
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange)
    }
  }, [])

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refreshToken')
    
    // Call logout API
    fetch('http://127.0.0.1:8000/api/accounts/logout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    }).finally(() => {
      // Clear localStorage and state regardless of API response
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      setIsAuthenticated(false)
      setUser(null)
      setIsProfileDropdownOpen(false)
      
      // Dispatch custom event to notify navbar of authentication change
      window.dispatchEvent(new Event('authStateChanged'))
      
      // Small delay to ensure event is processed before navigation
      setTimeout(() => {
        navigate('/')
      }, 100)
    })
  }

  const getCountryFlag = (code) => {
    // Convert country code to flag emoji
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt())
    return String.fromCodePoint(...codePoints)
  }

  const handleCountrySelect = (country) => {
    setIsCountriesDropdownOpen(false)
    setIsMobileMenuOpen(false)
    navigate(`/country/${country.id}`, { state: { country } })
  }

  return (
    <>
      {/* Top Navbar - Logo and Auth */}
      <div className="top-navbar">
        <div className="container">
          <div className="top-nav-content">
            {/* <div className="nav-logo"> */}
              <Link to="/">
                <img src='/logo.png' alt="VisaGlobal" style={{width:'50px', objectFit: 'cover'}}/>
              </Link>
            {/* </div> */}

            
            <div className="auth-section">
              {isAuthenticated ? (
                <div className="profile-dropdown">
                  <button 
                    className="profile-button"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  >
                    <div className="profile-avatar">
                      {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </div>
                    <span className="profile-name">{user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username}</span>
                    <span className="dropdown-arrow">▼</span>
                  </button>
                  {isProfileDropdownOpen && (
                    <div className="profile-dropdown-menu">
                      <Link 
                        to="/account" 
                        className="dropdown-item"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link 
                        to="/account" 
                        className="dropdown-item"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        My Applications
                      </Link>
                      <button 
                        className="dropdown-item logout-btn"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="auth-link login">
                    LOG IN
                  </Link>
                  <span className="separator">|</span>
                  <Link to="/signup" className="auth-link signup">
                    SIGN UP
                  </Link>
                </>
              )}
            </div>
            
            {/* Mobile toggle button */}
            <div 
              className={`nav-toggle ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="main-navbar">
        <div className="container">
          <div className="main-nav-content">
            <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                HOME
              </Link>
              
              <Link 
                to="/about" 
                className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ABOUT US
              </Link>
              
              <div className="countries-dropdown">
                <button 
                  className={`dropdown-toggle ${isCountriesDropdownOpen ? 'open' : ''}`}
                  onClick={() => setIsCountriesDropdownOpen(!isCountriesDropdownOpen)}
                >
                  COUNTRIES
                  <span className="dropdown-arrow">▼</span>
                </button>
                <div className={`dropdown-menu ${isCountriesDropdownOpen ? 'open' : ''}`}>
                  {countries.map((country) => (
                    <button
                      key={country.id}
                      className="dropdown-item"
                      onClick={() => handleCountrySelect(country)}
                    >
                      <span className="country-flag">{getCountryFlag(country.code)}</span>
                      {country.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <Link 
                to="/gallery" 
                className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                GALLERY
              </Link>
              
              <Link 
                to="/contact" 
                className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                CONTACT
              </Link>
              
              {isAuthenticated && (
                <Link 
                  to="/account" 
                  className={`nav-link ${isActive('/account') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  MY ACCOUNT
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar