import { useState } from 'react'
import './UserAccount.css'

const UserAccount = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    joinDate: 'January 2024'
  }

  // Mock booked visas data
  const bookedVisas = [
    {
      id: 1,
      country: 'United States',
      flag: '🇺🇸',
      visaType: 'Tourist Visa',
      applicationDate: '2024-01-15',
      status: 'In Progress',
      processingSteps: [
        { step: 'Application Submitted', completed: true, date: '2024-01-15' },
        { step: 'Document Review', completed: true, date: '2024-01-17' },
        { step: 'Biometric Appointment', completed: true, date: '2024-01-20' },
        { step: 'Embassy Interview', completed: false, date: '2024-01-25' },
        { step: 'Visa Decision', completed: false, date: 'Pending' },
        { step: 'Visa Collection', completed: false, date: 'Pending' }
      ],
      estimatedCompletion: '2024-02-05',
      price: '$150'
    },
    {
      id: 2,
      country: 'Canada',
      flag: '🇨🇦',
      visaType: 'Study Permit',
      applicationDate: '2024-01-10',
      status: 'Approved',
      processingSteps: [
        { step: 'Application Submitted', completed: true, date: '2024-01-10' },
        { step: 'Document Review', completed: true, date: '2024-01-12' },
        { step: 'Biometric Appointment', completed: true, date: '2024-01-15' },
        { step: 'Embassy Interview', completed: true, date: '2024-01-18' },
        { step: 'Visa Decision', completed: true, date: '2024-01-22' },
        { step: 'Visa Collection', completed: true, date: '2024-01-24' }
      ],
      estimatedCompletion: '2024-01-24',
      price: '$300'
    },
    {
      id: 3,
      country: 'United Kingdom',
      flag: '🇬🇧',
      visaType: 'Business Visa',
      applicationDate: '2024-01-05',
      status: 'Rejected',
      processingSteps: [
        { step: 'Application Submitted', completed: true, date: '2024-01-05' },
        { step: 'Document Review', completed: true, date: '2024-01-07' },
        { step: 'Biometric Appointment', completed: true, date: '2024-01-10' },
        { step: 'Embassy Interview', completed: true, date: '2024-01-12' },
        { step: 'Visa Decision', completed: true, date: '2024-01-15' },
        { step: 'Visa Collection', completed: false, date: 'N/A' }
      ],
      estimatedCompletion: '2024-01-15',
      price: '$200',
      rejectionReason: 'Insufficient financial documentation'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return '#fbbf24'
      case 'Approved': return '#10b981'
      case 'Rejected': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'In Progress': return '⏳'
      case 'Approved': return '✅'
      case 'Rejected': return '❌'
      default: return '📄'
    }
  }

  return (
    <div className="user-account-page">
      <div className="account-header">
        <div className="container">
          <div className="header-content">
            <div className="user-info">
              <div className="user-avatar">
                <span className="avatar-icon">👤</span>
              </div>
              <div className="user-details">
                <h1>Welcome back, {user.name}</h1>
                <p>Member since {user.joinDate}</p>
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
                    <h3>{bookedVisas.length}</h3>
                    <p>Total Applications</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-info">
                    <h3>{bookedVisas.filter(v => v.status === 'In Progress').length}</h3>
                    <p>In Progress</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <h3>{bookedVisas.filter(v => v.status === 'Approved').length}</h3>
                    <p>Approved</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">❌</div>
                  <div className="stat-info">
                    <h3>{bookedVisas.filter(v => v.status === 'Rejected').length}</h3>
                    <p>Rejected</p>
                  </div>
                </div>
              </div>

              <div className="visa-applications">
                <h2>Your Visa Applications</h2>
                <div className="applications-grid">
                  {bookedVisas.map((visa) => (
                    <div key={visa.id} className="application-card">
                      <div className="application-header">
                        <div className="country-info">
                          <span className="country-flag">{visa.flag}</span>
                          <div>
                            <h3>{visa.country}</h3>
                            <p>{visa.visaType}</p>
                          </div>
                        </div>
                        <div className="status-badge" style={{ backgroundColor: getStatusColor(visa.status) }}>
                          <span className="status-icon">{getStatusIcon(visa.status)}</span>
                          {visa.status}
                        </div>
                      </div>

                      <div className="application-details">
                        <div className="detail-item">
                          <span className="label">Application Date:</span>
                          <span className="value">{visa.applicationDate}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Processing Fee:</span>
                          <span className="value">{visa.price}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Expected Completion:</span>
                          <span className="value">{visa.estimatedCompletion}</span>
                        </div>
                        {visa.rejectionReason && (
                          <div className="detail-item rejection-reason">
                            <span className="label">Rejection Reason:</span>
                            <span className="value">{visa.rejectionReason}</span>
                          </div>
                        )}
                      </div>

                      <div className="processing-timeline">
                        <h4>Processing Timeline</h4>
                        <div className="timeline">
                          {visa.processingSteps.map((step, index) => (
                            <div key={index} className={`timeline-item ${step.completed ? 'completed' : 'pending'}`}>
                              <div className="timeline-marker">
                                {step.completed ? '✓' : index + 1}
                              </div>
                              <div className="timeline-content">
                                <h5>{step.step}</h5>
                                <p>{step.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="application-actions">
                        <button className="action-button primary">View Details</button>
                        {visa.status === 'In Progress' && (
                          <button className="action-button secondary">Track Status</button>
                        )}
                        {visa.status === 'Rejected' && (
                          <button className="action-button secondary">Reapply</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-content">
              <div className="profile-section">
                <h2>Personal Information</h2>
                <div className="profile-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" value={user.name} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" value={user.email} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" value={user.phone} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Member Since</label>
                    <input type="text" value={user.joinDate} readOnly />
                  </div>
                  <button className="edit-profile-button">Edit Profile</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserAccount