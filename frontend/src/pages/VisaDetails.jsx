import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ChildHero from '../components/ChildHero'
import Swal from 'sweetalert2'
import { API_ENDPOINTS } from '../config/api.js'
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
    fetch(`${API_ENDPOINTS.VISA_TYPES}/${visaId}/`)
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

  const handleContactExpert = () => {
    navigate('/contact')
  }

  const handleBack = () => {
    navigate(`/country/${countryId}`, { state: { country } })
  }

  const handleApplyNow = () => {
    // Check if user is logged in by checking for access token
    const token = localStorage.getItem('accessToken')

    if (!token) {
      // Automatically redirect to login page for non-logged-in users
      navigate('/login', {
        state: {
          from: `/country/${countryId}/visa/${visaId}`,
          country: country
        }
      })
      return
    }

    // If user is logged in, show the apply modal
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

      const response = await fetch(API_ENDPOINTS.VISA_APPLICATIONS, {
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
    } catch {
      alert('Failed to create application. Please try again.')
    }
  }

  if (!visaDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading visa details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 md:w-[85vw] w-[98vw] mx-auto">
      {/* Breadcrumbs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm">
            <a href="/" className="text-blue-600 hover:text-blue-700 transition-colors">Home</a>
            <span className="text-gray-400">/</span>
            <a href={`/country/${countryId}`} className="text-blue-600 hover:text-blue-700 transition-colors">{country.name}</a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate">{details.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      {/* <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-8 sm:py-12 rounded-lg mt-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={handleBack}
            className="mb-4 sm:mb-6 inline-flex items-center text-blue-200 hover:text-white transition-colors text-sm sm:text-base"
          >
            ← Back to {country.name}
          </button>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
            <span className="text-3xl sm:text-4xl">{country.flag}</span>
            <div>
              <div className="text-blue-200 text-xs sm:text-sm font-medium">{country.name}</div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{details.name}</h1>
            </div>
          </div>
          <p className="text-blue-100 text-base sm:text-lg">Complete visa application guide and requirements</p>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Quick Information Cards */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-blue-600 text-base sm:text-lg">⚡</span>
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Quick Information</h2>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
                <span className="text-3xl sm:text-4xl">{country.flag}</span>
                <div>
                  <div className="text-blue-200 text-xs sm:text-sm font-medium">{country.name}</div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{details.name}</h1>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6 border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg sm:text-xl">⏱️</span>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-blue-700">Processing Time</div>
                      <div className="text-sm sm:text-lg font-bold text-blue-900">{details.processingTime}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 sm:p-6 border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg sm:text-xl">💰</span>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-green-700">Processing Fee</div>
                      <div className="text-sm sm:text-lg font-bold text-green-900">${details.price}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overview Section */}
            {overviews.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-blue-600 text-base sm:text-lg">📋</span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Visa Overview</h2>
                </div>
                <div className="space-y-4 sm:space-y-6">
                  {overviews.map((item, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 sm:pl-6 py-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{item.overview}</h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.points}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Required Documents Section */}
            {documents.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <span className="text-yellow-600 text-base sm:text-lg">📄</span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Required Documents</h2>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs sm:text-sm">📋</span>
                      </div>
                      <span className="text-sm sm:text-base text-gray-800 font-medium">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Application Process Section */}
            {process.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <span className="text-purple-600 text-base sm:text-lg">🔄</span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Application Process</h2>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {process.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl border border-blue-100">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="text-sm sm:text-base text-gray-700 leading-relaxed">{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Important Notes Section */}
            {notes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <span className="text-orange-600 text-base sm:text-lg">⚠️</span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Important Notes</h2>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {notes.map((note, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 sm:p-4 bg-orange-50 rounded-xl border border-orange-200">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs">💡</span>
                      </div>
                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg sm:text-xl font-bold">Visa Processing Fee</h3>
                  <span className="bg-white bg-opacity-20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">Best Value</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold">${details.price || 'Contact for price'}</div>
                <div className="text-blue-100 text-sm sm:text-base">Per Application</div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="w-4 h-4 sm:w-5 sm:h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs">✅</span>
                    </span>
                    <span className="text-sm sm:text-base text-gray-700">Expert guidance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-4 h-4 sm:w-5 sm:h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs">✅</span>
                    </span>
                    <span className="text-sm sm:text-base text-gray-700">Document review</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-4 h-4 sm:w-5 sm:h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs">✅</span>
                    </span>
                    <span className="text-sm sm:text-base text-gray-700">Application tracking</span>
                  </div>
                </div>

                <button
                  onClick={handleApplyNow}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  Apply Now
                </button>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 sm:p-6 border border-blue-200">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-white text-xl sm:text-2xl">🎯</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Need Expert Help?</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                  Our visa experts are here to assist you with your application. Get personalized guidance and support throughout the process.
                </p>
                <button
                  onClick={handleContactExpert}
                  className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Contact Expert
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 transform transition-all">
            <div className="text-center mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Choose Your Application Method</h3>
              <p className="text-sm sm:text-base text-gray-600">Select how you'd like to proceed with your visa application</p>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <button
                onClick={handleApplyWithDocuments}
                className="w-full p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white text-lg sm:text-xl">📁</span>
                  </div>
                  <div className="text-left">
                    <div className="text-base sm:text-lg font-bold text-blue-900">Apply with Documents</div>
                    <div className="text-sm sm:text-base text-blue-700">Upload all required documents now</div>
                  </div>
                </div>
              </button>

              <button
                onClick={handleApplyWithoutDocuments}
                className="w-full p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white text-lg sm:text-xl">⏳</span>
                  </div>
                  <div className="text-left">
                    <div className="text-base sm:text-lg font-bold text-gray-900">Apply without Documents</div>
                    <div className="text-sm sm:text-base text-gray-700">Upload documents later from your account</div>
                  </div>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowApplyModal(false)}
              className="w-full py-2.5 sm:py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default VisaDetails