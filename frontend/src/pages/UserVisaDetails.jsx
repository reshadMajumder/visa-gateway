import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { API_ENDPOINTS, buildMediaUrl } from '../config/api.js'
import { Upload, RefreshCw } from 'lucide-react'
import './css/UserVisaDetails.css'

const UserVisaDetails = () => {
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingDocuments, setUpdatingDocuments] = useState({})
  const [documentFiles, setDocumentFiles] = useState({})
  const [updateStatus, setUpdateStatus] = useState({ loading: false, success: null, error: null })

  const fetchApplicationDetails = useCallback(async () => {
    try {
      setLoading(true)
      const accessToken = localStorage.getItem('accessToken')
      
      if (!accessToken) {
        setError('Please login to view application details')
        setLoading(false)
        return
      }

      const response = await fetch(`${API_ENDPOINTS.VISA_APPLICATIONS}${applicationId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        setApplication(data)
      } else if (response.status === 401) {
        setError('Session expired. Please login again.')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
      } else {
        setError('Failed to fetch application details')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [applicationId])

  useEffect(() => {
    fetchApplicationDetails()
  }, [fetchApplicationDetails])

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return '#6b7280'
      case 'submitted': return '#fbbf24'
      case 'approved': return '#10b981'
      case 'rejected': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft': return '📄'
      case 'submitted': return '⏳'
      case 'approved': return '✅'
      case 'rejected': return '❌'
      default: return '📄'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'draft': return 'Draft'
      case 'submitted': return 'Submitted'
      case 'approved': return 'Approved'
      case 'rejected': return 'Rejected'
      default: return status
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#fbbf24'
      case 'approved': return '#10b981'
      case 'rejected': return '#ef4444'
      default: return '#6b7280'
    }
  }
  
  const handleDocumentFileChange = (documentId, e) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFiles(prev => ({
        ...prev,
        [documentId]: e.target.files[0]
      }))
    }
  }
  
  // Clear notification after a few seconds
  useEffect(() => {
    if (updateStatus.success || updateStatus.error) {
      const timer = setTimeout(() => {
        setUpdateStatus({ loading: false, success: null, error: null })
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [updateStatus.success, updateStatus.error])
  
  const handleUpdateDocument = async (documentId) => {
    if (!documentFiles[documentId]) {
      setUpdateStatus({
        loading: false,
        success: null,
        error: 'Please select a file to upload'
      })
      return
    }
    
    try {
      setUpdateStatus({ loading: true, success: null, error: null })
      setUpdatingDocuments(prev => ({ ...prev, [documentId]: true }))
      
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        setError('Please login to update documents')
        return
      }
      
      const formData = new FormData()
      // match v2 API: send PUT to same endpoint as GET with required_documents[docId]
      formData.append('visa_type_id', application.visa_type.id)
      formData.append('country_id', application.country.id)
      formData.append(`required_documents[${documentId}]`, documentFiles[documentId])
      
      const response = await fetch(`${API_ENDPOINTS.VISA_APPLICATIONS}${applicationId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData
      })
      
      if (response.ok) {
        setUpdateStatus({
          loading: false,
          success: 'Document updated successfully',
          error: null
        })
        // Refresh application data
        fetchApplicationDetails()
      } else if (response.status === 401) {
        setError('Session expired. Please login again.')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
      } else {
        const errorData = await response.json()
        setUpdateStatus({
          loading: false,
          success: null,
          error: errorData.detail || 'Failed to update document'
        })
      }
    } catch (err) {
      setUpdateStatus({
        loading: false,
        success: null,
        error: 'Network error. Please try again.'
      })
    } finally {
      setUpdatingDocuments(prev => ({ ...prev, [documentId]: false }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Loading application details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full text-center">
          <p className="text-red-600 font-medium mb-4 text-sm sm:text-base">{error}</p>
          <button 
            onClick={fetchApplicationDetails} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-300 text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full text-center">
          <p className="text-gray-600 font-medium text-sm sm:text-base">Application not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <button 
            className="mb-4 sm:mb-6 flex items-center space-x-2 text-blue-100 hover:text-white transition-colors duration-300 text-sm sm:text-base" 
            onClick={() => navigate('/account')}
          >
            <span>←</span>
            <span>Back to Account</span>
          </button>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white/20 flex items-center justify-center">
                <img 
                  src={buildMediaUrl(application.country.image)} 
                  alt={application.country.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'block'
                  }}
                />
                <span className="text-2xl sm:text-3xl" style={{ display: 'none' }}>
                  {application.country.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">
                  {application.country.name} - {application.visa_type.name}
                </h1>
                <p className="text-sm sm:text-base text-blue-100">Application #{application.id}</p>
              </div>
            </div>
            <div 
              className="px-3 sm:px-4 py-2 sm:py-3 rounded-full text-white font-semibold flex items-center space-x-2 text-sm sm:text-base"
              style={{ backgroundColor: getStatusColor(application.status) }}
            >
              <span>{getStatusIcon(application.status)}</span>
              <span>{getStatusText(application.status)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 lg:p-8">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Application Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                  <div className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Application ID</div>
                  <div className="text-sm sm:text-base font-semibold text-gray-900">#{application.id}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                  <div className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Application Date</div>
                  <div className="text-sm sm:text-base font-semibold text-gray-900">{formatDate(application.created_at)}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                  <div className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Last Updated</div>
                  <div className="text-sm sm:text-base font-semibold text-gray-900">{formatDate(application.updated_at)}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                  <div className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Status</div>
                  <div 
                    className="text-sm sm:text-base font-semibold flex items-center space-x-2"
                    style={{ color: getStatusColor(application.status) }}
                  >
                    <span>{getStatusIcon(application.status)}</span>
                    <span>{getStatusText(application.status)}</span>
                  </div>
                </div>
              </div>
            </div>

            {application.admin_notes && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 lg:p-8">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4">Admin Notes</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm sm:text-base text-gray-700">{application.admin_notes}</p>
                </div>
              </div>
            )}

            {application.rejection_reason && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 lg:p-8">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4">Rejection Reason</h2>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm sm:text-base text-red-700">{application.rejection_reason}</p>
                </div>
              </div>
            )}

            {/* Success/Error Notification */}
            {(updateStatus.success || updateStatus.error) && (
              <div className={`bg-white rounded-2xl shadow-xl border ${updateStatus.success ? 'border-green-200' : 'border-red-200'} p-4 sm:p-6 mb-4 sm:mb-6`}>
                <div className={`flex items-center space-x-2 ${updateStatus.success ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="text-sm sm:text-base font-medium">
                    {updateStatus.success || updateStatus.error}
                  </span>
                </div>
              </div>
            )}
            
            {application.visa_type.required_documents && application.visa_type.required_documents.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 lg:p-8">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Uploaded Documents</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {application.visa_type.required_documents.map((doc) => (
                    <div key={doc.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">{doc.document_name}</span>
                        <span 
                          className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-white"
                          style={{ backgroundColor: getDocumentStatusColor(doc.status) }}
                        >
                          {doc.status}
                        </span>
                      </div>
                      {doc.document_file && (
                        <a 
                          href={buildMediaUrl(doc.document_file)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
                        >
                          View Document
                        </a>
                      )}
                      {doc.rejection_reason && (
                        <div className="mt-3 p-3 bg-red-50 rounded-lg">
                          <span className="text-xs sm:text-sm font-medium text-red-700">Rejection: </span>
                          <span className="text-xs sm:text-sm text-red-600">{doc.rejection_reason}</span>
                        </div>
                      )}
                      
                      {doc.admin_notes && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <span className="text-xs sm:text-sm font-medium text-blue-700">Admin Notes: </span>
                          <span className="text-xs sm:text-sm text-blue-600">{doc.admin_notes}</span>
                        </div>
                      )}
                      
                      {/* Document update section for rejected documents */}
                      {doc.status === 'rejected' && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">Update Document</p>
                          <div className="flex flex-col space-y-3">
                            <label className="flex items-center justify-center w-full px-4 py-2 bg-white border-2 border-blue-300 border-dashed rounded-lg cursor-pointer hover:bg-blue-50 transition-colors duration-300">
                              <input 
                                type="file" 
                                className="hidden" 
                                onChange={(e) => handleDocumentFileChange(doc.id, e)}
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                              <div className="flex items-center space-x-2">
                                <Upload className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-blue-600">
                                  {documentFiles[doc.id] ? documentFiles[doc.id].name : 'Choose File'}
                                </span>
                              </div>
                            </label>
                            
                            <button
                              onClick={() => handleUpdateDocument(doc.id)}
                              disabled={!documentFiles[doc.id] || updatingDocuments[doc.id]}
                              className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
                            >
                              {updatingDocuments[doc.id] ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  <span>Updating...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4" />
                                  <span>Update Document</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Visa Information</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-xs sm:text-sm font-medium text-gray-500">Country</span>
                  <div className="text-sm sm:text-base font-semibold text-gray-900">{application.country.name}</div>
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-medium text-gray-500">Visa Type</span>
                  <div className="text-sm sm:text-base font-semibold text-gray-900">{application.visa_type.name}</div>
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-medium text-gray-500">Required Documents</span>
                  <div className="text-sm sm:text-base font-semibold text-gray-900">{application.visa_type.required_documents?.length || 0}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                {application.status === 'draft' && (
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base">
                    Complete Application
                  </button>
                )}
                {application.status === 'rejected' && (
                  <button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base">
                    Reapply
                  </button>
                )}
                <button className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base">
                  Download Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserVisaDetails
