import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Bell, ChevronDown, User, LogOut, Settings, Globe, Menu, X } from 'lucide-react'
import { API_ENDPOINTS } from '../config/api.js'
import './Navbar.css'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCountriesDropdownOpen, setIsCountriesDropdownOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [countries, setCountries] = useState([])
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    fetch(API_ENDPOINTS.COUNTRIES)
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
    fetch(API_ENDPOINTS.LOGOUT, {
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close dropdowns if clicking inside mobile menu
      if (event.target.closest('.mobile-menu-content')) {
        return
      }
      
      // Close profile dropdown if clicking outside desktop profile dropdown
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false)
      }
      
      // Close countries dropdown if clicking outside desktop countries dropdown
      if (isCountriesDropdownOpen && !event.target.closest('.countries-dropdown')) {
        setIsCountriesDropdownOpen(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isProfileDropdownOpen, isCountriesDropdownOpen])

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

  const handleAllDestinations = () => {
    setIsCountriesDropdownOpen(false)
    setIsMobileMenuOpen(false)
    navigate('/all-destinations')
  }

  return (
    <>
      {/* Desktop Navbar */}
      <div className={`top-navbar ${isScrolled ? 'scrolled' : ''} hidden md:block`}>
        <div className="md:w-[83vw] w-[98vw] mx-auto">
          <div className="top-nav-content">
            <div className="">
              <Link  className="flex items-center gap-3" to="/">
                <img className='rounded-full object-cover w-12' src='/logo.png' alt="Schengen" />
                <span className="logo-text">Schengen</span>
              </Link>
            </div>

            <div className="auth-section">
              {isAuthenticated ? (
                <div className="auth-controls">
                  {/* Profile Dropdown */}
                  <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="profile-button"
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    >
                      <div className="profile-avatar">
                        <User size={18} />
                      </div>
                      <span className="profile-name">{user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username}</span>
                      <ChevronDown className={`dropdown-arrow ${isProfileDropdownOpen ? 'open' : ''}`} size={16} />
                    </button>
                    {isProfileDropdownOpen && (
                      <div className="profile-dropdown-menu">
                        <div className="dropdown-header">
                          <div className="user-info">
                            <div className="user-avatar">
                              {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                            </div>
                            <div className="user-details">
                              <div className="user-name">{user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username}</div>
                              <div className="user-email">{user?.email}</div>
                            </div>
                          </div>
                        </div>
                        <div className="dropdown-divider"></div>
                        <Link 
                          to="/account" 
                          className="dropdown-item"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <User size={16} />
                          My Profile
                        </Link>
                        <Link 
                          to="/account" 
                          className="dropdown-item"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <Globe size={16} />
                          My Applications
                        </Link>
                        <div className="dropdown-divider"></div>
                        <button 
                          className="dropdown-item logout-btn"
                          onClick={handleLogout}
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="auth-links">
                  <Link to="/login" className="auth-link login">
                    LOG IN
                  </Link>
                  <span className="separator">|</span>
                  <Link to="/signup" className="auth-link signup">
                    SIGN UP
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Main Navigation */}
      <nav className=" hidden md:block">
        <div className="container mx-auto">
          <div className="main-nav-content">
            <div className="nav-menu">
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                HOME
              </Link>
              
              <Link 
                to="/about" 
                className={`nav-link ${isActive('/about') ? 'active' : ''}`}
              >
                ABOUT US
              </Link>
              
              <div className="countries-dropdown" onClick={(e) => e.stopPropagation()}>
                <button 
                  className={`dropdown-toggle ${isCountriesDropdownOpen ? 'open' : ''}`}
                  onClick={() => setIsCountriesDropdownOpen(!isCountriesDropdownOpen)}
                >
                  <Globe size={16} />
                  COUNTRIES
                  <ChevronDown className={`dropdown-arrow ${isCountriesDropdownOpen ? 'open' : ''}`} size={16} />
                </button>
                <div className={`dropdown-menu ${isCountriesDropdownOpen ? 'open' : ''}`}>
                  <div className="dropdown-header">
                    <span className="dropdown-title">Select Destination</span>
                  </div>
                  <div className="countries-grid">
                    {/* All Destinations Option */}
                    <button
                      className="dropdown-item country-item flex items-center gap-3 w-full p-3 border-none bg-gradient-to-r from-primary-600 to-primary-700 text-white text-left rounded-lg cursor-pointer transition-all duration-300 hover:from-primary-700 hover:to-primary-800 hover:-translate-y-0.5 hover:shadow-lg mb-2"
                      onClick={handleAllDestinations}
                    >
                      <span className="text-lg">🌍</span>
                      <span className="flex-1 text-sm font-semibold">All Destinations</span>
                      <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">{countries.length} countries</span>
                    </button>
                    
                    {countries.map((country) => (
                      <button
                        key={country.id}
                        className="dropdown-item country-item"
                        onClick={() => handleCountrySelect(country)}
                      >
                        <span className="country-flag">{getCountryFlag(country.code)}</span>
                        <span className="country-name">{country.name}</span>
                        <span className="country-visa-count">{country.types?.length || 0} visas</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <Link 
                to="/gallery" 
                className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}
              >
                GALLERY
              </Link>
              
              <Link 
                to="/contact" 
                className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
              >
                CONTACT
              </Link>
              
              {isAuthenticated && (
                <Link 
                  to="/account" 
                  className={`nav-link ${isActive('/account') ? 'active' : ''}`}
                >
                  MY ACCOUNT
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar - Only visible on small devices */}
      <nav className={`md:hidden sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-primary-100 transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img 
                src='/logo.png' 
                alt="Schengen" 
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-xl font-bold text-primary-600">Schengen</span>
            </Link>

            {/* Right Side - Profile Icon (if logged in) + Menu Button */}
            <div className="flex items-center gap-3">
              {/* Mobile Profile Icon */}
              {isAuthenticated && (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center hover:bg-primary-200 transition-colors duration-200"
                  >
                    <User size={20} />
                  </button>
                  
                  {/* Mobile Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 transform transition-all duration-300 ease-in-out">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-lg">
                            {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username}
                            </p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-1">
                        <Link 
                          to="/profile" 
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <User size={18} />
                          <span>View Profile</span>
                        </Link>
                        <Link 
                          to="/account" 
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <User size={18} />
                          <span>My Profile</span>
                        </Link>
                        <Link 
                          to="/account" 
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <Globe size={18} />
                          <span>My Applications</span>
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button 
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                        >
                          <LogOut size={18} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-10 h-10 flex flex-col items-center justify-center gap-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <span className={`w-5 h-0.5 bg-primary-600 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`w-5 h-0.5 bg-primary-600 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-5 h-0.5 bg-primary-600 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 z-40 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        
        {/* Menu Content */}
        <div className="absolute right-0 top-0 h-full w-80 max-w-sm bg-white shadow-xl mobile-menu-content">
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 py-4">
              <Link 
                to="/" 
                className={`flex items-center px-6 py-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 ${isActive('/') ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              <Link 
                to="/about" 
                className={`flex items-center px-6 py-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 ${isActive('/about') ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              
              {/* Countries Dropdown */}
              <div>
                <button 
                  onClick={() => setIsCountriesDropdownOpen(!isCountriesDropdownOpen)}
                  className="flex items-center justify-between w-full px-6 py-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <Globe size={20} />
                    <span>Countries</span>
                  </div>
                  <ChevronDown className={`transition-transform duration-200 ${isCountriesDropdownOpen ? 'rotate-180' : ''}`} size={20} />
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCountriesDropdownOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="bg-gray-50 px-4 py-2 transform transition-transform duration-300 ease-in-out" style={{
                    transform: isCountriesDropdownOpen ? 'translateY(0)' : 'translateY(-10px)'
                  }}>
                    <button
                      onClick={handleAllDestinations}
                      className="flex items-center gap-3 w-full p-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 mb-2 transform hover:scale-105 hover:shadow-lg"
                    >
                      <span className="text-lg">🌍</span>
                      <span className="flex-1 text-left font-medium">All Destinations</span>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{countries.length}</span>
                    </button>
                    
                    <div className="max-h-48 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {countries.slice(0, 10).map((country, index) => (
                        <button
                          key={country.id}
                          onClick={() => handleCountrySelect(country)}
                          className="flex items-center gap-3 w-full p-2 text-left hover:bg-white rounded-lg transition-all duration-200 transform hover:scale-102 hover:shadow-sm"
                          style={{
                            animationDelay: `${index * 50}ms`,
                            animation: isCountriesDropdownOpen ? 'slideInLeft 0.3s ease-out forwards' : 'none'
                          }}
                        >
                          <span className="text-lg">{getCountryFlag(country.code)}</span>
                          <span className="flex-1 font-medium text-gray-700">{country.name}</span>
                          <span className="text-xs text-gray-500">{country.types?.length || 0}</span>
                        </button>
                      ))}
                    </div>
                    
                    {countries.length > 10 && (
                      <button 
                        onClick={handleAllDestinations}
                        className="w-full mt-2 p-2 text-primary-600 text-center hover:bg-white rounded-lg transition-all duration-200 transform hover:scale-105"
                      >
                        View All Countries
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <Link 
                to="/gallery" 
                className={`flex items-center px-6 py-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 ${isActive('/gallery') ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Gallery
              </Link>
              
              <Link 
                to="/contact" 
                className={`flex items-center px-6 py-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 ${isActive('/contact') ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              {isAuthenticated && (
                <Link 
                  to="/account" 
                  className={`flex items-center px-6 py-4 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 ${isActive('/account') ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Account
                </Link>
              )}

              {/* Authentication options in menu bar */}
              {isAuthenticated ? (
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <button 
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-3 px-6 py-4 text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="">
                 
                </div>
              )}
            </div>

            {/* Auth Section */}
            {!isAuthenticated && (
              <div className="border-t border-gray-200 p-4 space-y-3">
                <Link 
                  to="/login" 
                  className="block w-full text-center py-3 px-4 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  className="block w-full text-center py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar