import { useState, useEffect } from 'react'
import VisaApplicationCard from '../components/VisaApplicationCard'
import './UserAccount.css'

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
          full_name: userData.full_name || '',
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

      const response = await fetch('http://127.0.0.1:8000/api/visa-applications/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
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
          full_name: updatedUser.full_name || '',
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
      full_name: user?.full_name || '',
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
      <div className="user-account-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="user-account-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchUserProfile} className="retry-button">Try Again</button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="user-account-page">
        <div className="error-container">
          <p className="error-message">No user data found. Please login again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="user-account-page">
      <div className="account-header">
        <div className="container">
          <div className="header-content">
            <div className="user-info">
              <div className="user-avatar">
                {user.profile_picture ? (
                  <img src={`http://127.0.0.1:8000${user.profile_picture}`} alt="Profile" />
                ) : (
                <span className="avatar-icon">👤</span>
                )}
              </div>
              <div className="user-details">
                <h1>Welcome back, {user.full_name || user.username}</h1>
                <p>Member since {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="account-content">
          <div className="account-tabs">
            <button 
              className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
          </div>

          {activeTab === 'dashboard' && (
            <div className="dashboard-content">
              <div className="stats-overview">
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <h3>{applications.length}</h3>
                    <p>Total Applications</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📄</div>
                  <div className="stat-info">
                    <h3>{applications.filter(app => app.status === 'draft').length}</h3>
                    <p>Draft</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-info">
                    <h3>{applications.filter(app => app.status === 'submitted').length}</h3>
                    <p>Submitted</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <h3>{applications.filter(app => app.status === 'approved').length}</h3>
                    <p>Approved</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">❌</div>
                  <div className="stat-info">
                    <h3>{applications.filter(app => app.status === 'rejected').length}</h3>
                    <p>Rejected</p>
                  </div>
                </div>
              </div>

              <div className="visa-applications">
                <div className="applications-header">
                <h2>Your Visa Applications</h2>
                  {applicationsLoading && (
                    <div className="loading-indicator">
                      <div className="loading-spinner small"></div>
                      <span>Loading applications...</span>
                          </div>
                        )}
                      </div>

                {!applicationsLoading && applications.length === 0 && (
                  <div className="no-applications">
                    <div className="no-applications-icon">📋</div>
                    <h3>No Applications Yet</h3>
                    <p>You haven't submitted any visa applications yet.</p>
                    <button className="primary-button" onClick={() => window.location.href = '/'}>
                      Apply for Visa
                    </button>
                              </div>
                )}

                {!applicationsLoading && applications.length > 0 && (
                  <div className="applications-grid">
                    {applications.map((application) => (
                      <VisaApplicationCard
                        key={application.id}
                        application={application}
                        onUploadSuccess={handleUploadSuccess}
                        onUploadError={handleUploadError}
                      />
                          ))}
                        </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-content">
              <div className="profile-section">
                <div className="profile-header">
                <h2>Personal Information</h2>
                  {!isEditing && (
                    <button 
                      className="edit-profile-button"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleEditSubmit} className="profile-form">
                  <div className="form-group">
                    <label>Username</label>
                    <input type="text" value={user.username} readOnly />
                  </div>
                  
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={isEditing ? editForm.email : (user.email || '')} 
                      onChange={handleEditChange}
                      readOnly={!isEditing}
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      name="full_name"
                      value={isEditing ? editForm.full_name : (user.full_name || '')} 
                      onChange={handleEditChange}
                      readOnly={!isEditing}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone_number"
                      value={isEditing ? editForm.phone_number : (user.phone_number || '')} 
                      onChange={handleEditChange}
                      readOnly={!isEditing}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input 
                      type="date" 
                      name="date_of_birth"
                      value={isEditing ? editForm.date_of_birth : (user.date_of_birth || '')} 
                      onChange={handleEditChange}
                      readOnly={!isEditing}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Address</label>
                    <textarea 
                      name="address"
                      value={isEditing ? editForm.address : (user.address || '')} 
                      onChange={handleEditChange}
                      readOnly={!isEditing}
                      placeholder="Enter your address"
                      rows="3"
                    />
                  </div>
                  
                  {isEditing && (
                    <div className="form-group">
                      <label>Profile Picture</label>
                      <input 
                        type="file" 
                        name="profile_picture"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input"
                      />
                      {user.profile_picture && (
                        <div className="current-profile-pic">
                          <p>Current: {user.profile_picture.split('/').pop()}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label>Member Since</label>
                    <input 
                      type="text" 
                      value={new Date(user.created_at).toLocaleDateString()} 
                      readOnly 
                    />
                  </div>
                  
                  {isEditing && (
                    <div className="edit-actions">
                      <button 
                        type="submit" 
                        className="save-button"
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button 
                        type="button" 
                        className="cancel-button"
                        onClick={handleEditCancel}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                </div>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserAccount