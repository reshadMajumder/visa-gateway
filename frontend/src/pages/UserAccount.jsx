import { useState, useEffect } from 'react'
import VisaApplicationCard from '../components/VisaApplicationCard'
import UserProfile from './UserProfile'
import { 
  User, 
  BarChart3, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  Plus,
  Settings,
  Bell,
  Shield,
  Calendar,
  UserCircle,
  FileEdit,
  Globe
} from 'lucide-react'

const UserAccount = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [applications, setApplications] = useState([])
  const [applicationsLoading, setApplicationsLoading] = useState(true)

  // Fetch user profile data
  useEffect(() => {
    fetchUserProfile()
  }, [])

  // Fetch visa applications when dashboard is active
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchVisaApplications()
    }
  }, [activeTab])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const accessToken = localStorage.getItem('accessToken')
      
      if (!accessToken) {
        setError('Please login to view your profile')
        setLoading(false)
        return
      }

      const response = await fetch('http://127.0.0.1:8000/api/accounts/profile/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        // Initialize edit form with current user data
        setEditForm({
          email: userData.email || '',
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          phone_number: userData.phone_number || '',
          date_of_birth: userData.date_of_birth || '',
          address: userData.address || ''
        })
      } else if (response.status === 401) {
        // Token expired, try to refresh
        const refreshSuccess = await refreshToken()
        if (refreshSuccess) {
          fetchUserProfile() // Retry with new token
        } else {
          setError('Session expired. Please login again.')
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
      } else {
        setError('Failed to fetch profile data')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchVisaApplications = async () => {
    try {
      setApplicationsLoading(true)
      const accessToken = localStorage.getItem('accessToken')
      
      if (!accessToken) {
        setApplications([])
        setApplicationsLoading(false)
        return
      }

      const response = await fetch('http://127.0.0.1:8000/api/v2/visa-applications/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Handle the new response structure where applications are under "Applications:" key
        setApplications(data['Applications:'] || [])
      } else if (response.status === 401) {
        // Token expired, try to refresh
        const refreshSuccess = await refreshToken()
        if (refreshSuccess) {
          fetchVisaApplications() // Retry with new token
        } else {
          setApplications([])
        }
      } else {
        setApplications([])
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error)
      setApplications([])
    } finally {
      setApplicationsLoading(false)
    }
  }

  const refreshToken = async () => {
    const refreshTokenValue = localStorage.getItem('refreshToken')
    if (!refreshTokenValue) return false

    try {
      const response = await fetch('http://127.0.0.1:8000/api/accounts/login/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshTokenValue })
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('accessToken', data.access)
        if (data.refresh) {
          localStorage.setItem('refreshToken', data.refresh)
        }
        return true
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
    }
    return false
  }

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEditForm({
        ...editForm,
        profile_picture: file
      })
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const accessToken = localStorage.getItem('accessToken')
      const formData = new FormData()
      
      // Add form fields to FormData
      Object.keys(editForm).forEach(key => {
        if (editForm[key]) {
          if (key === 'profile_picture' && editForm[key] instanceof File) {
            formData.append(key, editForm[key])
          } else if (key !== 'profile_picture') {
            formData.append(key, editForm[key])
          }
        }
      })

      const response = await fetch('http://127.0.0.1:8000/api/accounts/profile/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        setIsEditing(false)
        // Update edit form with new data
        setEditForm({
          email: updatedUser.email || '',
          first_name: updatedUser.first_name || '',
          last_name: updatedUser.last_name || '',
          phone_number: updatedUser.phone_number || '',
          date_of_birth: updatedUser.date_of_birth || '',
          address: updatedUser.address || ''
        })
      } else if (response.status === 401) {
        const refreshSuccess = await refreshToken()
        if (refreshSuccess) {
          handleEditSubmit(e) // Retry with new token
        } else {
          setError('Session expired. Please login again.')
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update profile')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    // Reset edit form to current user data
    setEditForm({
      email: user?.email || '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone_number: user?.phone_number || '',
      date_of_birth: user?.date_of_birth || '',
      address: user?.address || ''
    })
  }

  const handleUploadSuccess = () => {
    // Refresh applications after successful upload
    fetchVisaApplications()
  }

  const handleUploadError = (errorMessage) => {
    console.error('Upload error:', errorMessage)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full mx-auto text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 animate-spin" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Loading Your Profile</h3>
          <p className="text-sm sm:text-base text-gray-600">Please wait while we fetch your account details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full mx-auto text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Something went wrong</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchUserProfile} 
            className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2 mx-auto text-sm sm:text-base"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full mx-auto text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No Profile Found</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">No user data found. Please login again to continue.</p>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-300 text-sm sm:text-base"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100">
      {/* Header Section */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              {user.profile_picture ? (
                <img 
                  src={`http://127.0.0.1:8000${user.profile_picture}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white" />
              )}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Welcome back, {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}!
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 flex items-center justify-center sm:justify-start space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Member since {new Date(user.created_at).toLocaleDateString()}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Dashboard</span>
            </button>
            
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <UserCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Profile Settings</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-6 sm:space-y-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 sm:space-y-8">
              {/* Statistics Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">{applications.length}</p>
                      <p className="text-gray-600 text-xs sm:text-sm">Total Applications</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <FileEdit className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">{applications.filter(app => app.status === 'draft').length}</p>
                      <p className="text-gray-600 text-xs sm:text-sm">Draft</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">{applications.filter(app => app.status === 'submitted').length}</p>
                      <p className="text-gray-600 text-xs sm:text-sm">Submitted</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">{applications.filter(app => app.status === 'approved').length}</p>
                      <p className="text-gray-600 text-xs sm:text-sm">Approved</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-2xl transition-all duration-300 col-span-2 sm:col-span-1">
                  <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                      <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">{applications.filter(app => app.status === 'rejected').length}</p>
                      <p className="text-gray-600 text-xs sm:text-sm">Rejected</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Applications Section */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      <h2 className="text-lg sm:text-2xl font-bold text-white">Your Visa Applications</h2>
                    </div>
                    {applicationsLoading && (
                      <div className="flex items-center space-x-2 text-white">
                        <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        <span className="text-sm sm:text-base">Loading applications...</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  {!applicationsLoading && applications.length === 0 && (
                    <div className="text-center py-8 sm:py-12">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No Applications Yet</h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">You haven't submitted any visa applications yet. Start your journey today!</p>
                      <button 
                        onClick={() => window.location.href = '/'} 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg flex items-center space-x-2 mx-auto text-sm sm:text-base"
                      >
                        <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Apply for Visa</span>
                      </button>
                    </div>
                  )}

                  {!applicationsLoading && applications.length > 0 && (
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {applications.map((application) => (
                        <div key={application.id} className="transform hover:scale-105 transition-transform duration-300">
                          <VisaApplicationCard
                            application={application}
                            onUploadSuccess={handleUploadSuccess}
                            onUploadError={handleUploadError}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 sm:p-6">
                <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center space-x-3">
                  <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Profile Settings</span>
                </h2>
                <p className="text-blue-100 mt-2 text-sm sm:text-base">Update your personal information and preferences</p>
              </div>
              <div className="p-0">
                <UserProfile 
                  user={user}
                  error={error}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  editForm={editForm}
                  setEditForm={setEditForm}
                  saving={saving}
                  handleEditChange={handleEditChange}
                  handleFileChange={handleFileChange}
                  handleEditSubmit={handleEditSubmit}
                  handleEditCancel={handleEditCancel}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserAccount