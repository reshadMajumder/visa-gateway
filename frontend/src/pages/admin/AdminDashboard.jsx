import { useState, useEffect } from 'react'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItems, setSelectedItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for demonstration
  const [stats, setStats] = useState({
    totalApplications: 1247,
    pendingApplications: 89,
    approvedApplications: 1098,
    rejectedApplications: 60,
    totalRevenue: 187500,
    monthlyGrowth: 12.5,
    totalUsers: 2156,
    activeUsers: 1987,
    totalCountries: 9
  })

  const [applications, setApplications] = useState([
    {
      id: 'VA001',
      applicant: 'John Doe',
      email: 'john@example.com',
      country: 'Romania',
      visaType: 'Work Visa',
      status: 'pending',
      submittedDate: '2024-01-15',
      amount: '$150',
      phone: '+1234567890',
      documents: 'Complete'
    },
    {
      id: 'VA002',
      applicant: 'Sarah Smith',
      email: 'sarah@example.com',
      country: 'Canada',
      visaType: 'Study Permit',
      status: 'approved',
      submittedDate: '2024-01-14',
      amount: '$300',
      phone: '+1234567891',
      documents: 'Complete'
    },
    {
      id: 'VA003',
      applicant: 'Mike Johnson',
      email: 'mike@example.com',
      country: 'USA',
      visaType: 'Tourist Visa',
      status: 'processing',
      submittedDate: '2024-01-13',
      amount: '$150',
      phone: '+1234567892',
      documents: 'Pending'
    },
    {
      id: 'VA004',
      applicant: 'Emma Wilson',
      email: 'emma@example.com',
      country: 'UK',
      visaType: 'Business Visa',
      status: 'rejected',
      submittedDate: '2024-01-12',
      amount: '$200',
      phone: '+1234567893',
      documents: 'Incomplete'
    },
    {
      id: 'VA005',
      applicant: 'David Brown',
      email: 'david@example.com',
      country: 'Australia',
      visaType: 'Work Visa',
      status: 'approved',
      submittedDate: '2024-01-11',
      amount: '$400',
      phone: '+1234567894',
      documents: 'Complete'
    }
  ])

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      country: 'Bangladesh',
      joinDate: '2024-01-10',
      applications: 3,
      status: 'active',
      lastLogin: '2024-01-20'
    },
    {
      id: 2,
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      phone: '+1234567891',
      country: 'India',
      joinDate: '2024-01-08',
      applications: 1,
      status: 'active',
      lastLogin: '2024-01-19'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1234567892',
      country: 'Pakistan',
      joinDate: '2024-01-05',
      applications: 2,
      status: 'inactive',
      lastLogin: '2024-01-15'
    }
  ])

  const [countries, setCountries] = useState([
    {
      id: 1,
      name: 'Romania',
      flag: '🇷🇴',
      visaTypes: 4,
      applications: 245,
      successRate: '95%',
      status: 'active',
      processingTime: '7-12 months'
    },
    {
      id: 2,
      name: 'United States',
      flag: '🇺🇸',
      visaTypes: 4,
      applications: 189,
      successRate: '87%',
      status: 'active',
      processingTime: '5-15 days'
    },
    {
      id: 3,
      name: 'Canada',
      flag: '🇨🇦',
      visaTypes: 4,
      applications: 156,
      successRate: '92%',
      status: 'active',
      processingTime: '7-21 days'
    }
  ])

  // Filter functions
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.country.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Action handlers
  const handleStatusChange = (id, newStatus, type = 'applications') => {
    setIsLoading(true)
    setTimeout(() => {
      if (type === 'applications') {
        setApplications(prev => prev.map(app => 
          app.id === id ? { ...app, status: newStatus } : app
        ))
        // Update stats
        setStats(prev => ({
          ...prev,
          pendingApplications: applications.filter(app => app.status === 'pending').length,
          approvedApplications: applications.filter(app => app.status === 'approved').length,
          rejectedApplications: applications.filter(app => app.status === 'rejected').length
        }))
      } else if (type === 'users') {
        setUsers(prev => prev.map(user => 
          user.id === id ? { ...user, status: newStatus } : user
        ))
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleBulkAction = (action) => {
    if (selectedItems.length === 0) return
    
    setIsLoading(true)
    setTimeout(() => {
      if (action === 'approve') {
        setApplications(prev => prev.map(app => 
          selectedItems.includes(app.id) ? { ...app, status: 'approved' } : app
        ))
      } else if (action === 'reject') {
        setApplications(prev => prev.map(app => 
          selectedItems.includes(app.id) ? { ...app, status: 'rejected' } : app
        ))
      } else if (action === 'delete') {
        setApplications(prev => prev.filter(app => !selectedItems.includes(app.id)))
      }
      setSelectedItems([])
      setIsLoading(false)
    }, 1000)
  }

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredApplications.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredApplications.map(app => app.id))
    }
  }

  const renderDashboard = () => (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon primary">📊</div>
          </div>
          <div className="stat-value">{stats.totalApplications.toLocaleString()}</div>
          <div className="stat-label">Total Applications</div>
          <div className="stat-change positive">
            <span>↗</span>
            +{stats.monthlyGrowth}% this month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon warning">⏳</div>
          </div>
          <div className="stat-value">{stats.pendingApplications}</div>
          <div className="stat-label">Pending Applications</div>
          <div className="stat-change positive">
            <span>↗</span>
            +5 today
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon success">✅</div>
          </div>
          <div className="stat-value">{stats.approvedApplications.toLocaleString()}</div>
          <div className="stat-label">Approved Applications</div>
          <div className="stat-change positive">
            <span>↗</span>
            +12 today
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon primary">💰</div>
          </div>
          <div className="stat-value">${stats.totalRevenue.toLocaleString()}</div>
          <div className="stat-label">Total Revenue</div>
          <div className="stat-change positive">
            <span>↗</span>
            +8.2% this month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon primary">👥</div>
          </div>
          <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
          <div className="stat-label">Total Users</div>
          <div className="stat-change positive">
            <span>↗</span>
            +15 this week
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon success">🌍</div>
          </div>
          <div className="stat-value">{stats.totalCountries}</div>
          <div className="stat-label">Active Countries</div>
          <div className="stat-change positive">
            <span>↗</span>
            +1 this month
          </div>
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-section-header">
          <h3 className="admin-section-title">Recent Applications</h3>
          <button className="admin-btn primary" onClick={() => setActiveTab('applications')}>
            View All Applications
          </button>
        </div>
        <div className="admin-section-content">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Applicant</th>
                <th>Country</th>
                <th>Visa Type</th>
                <th>Status</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 5).map((app) => (
                <tr key={app.id}>
                  <td><strong>{app.id}</strong></td>
                  <td>{app.applicant}</td>
                  <td>{app.country}</td>
                  <td>{app.visaType}</td>
                  <td>
                    <span className={`status-badge ${app.status}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>{app.submittedDate}</td>
                  <td><strong>{app.amount}</strong></td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-btn primary small">View</button>
                      <button className="admin-btn secondary small">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-section-header">
          <h3 className="admin-section-title">Application Analytics</h3>
        </div>
        <div className="admin-section-content">
          <div className="chart-container">
            📈 Chart visualization would be implemented here with a charting library like Chart.js or Recharts
          </div>
        </div>
      </div>
    </>
  )

  const renderApplications = () => (
    <div className="admin-section">
      <div className="admin-section-header">
        <h3 className="admin-section-title">All Visa Applications</h3>
        <div className="admin-actions">
          <button className="admin-btn secondary">Export CSV</button>
          <button className="admin-btn primary">Add New Application</button>
        </div>
      </div>
      
      <div className="search-filter-bar">
        <input
          type="text"
          placeholder="Search applications..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        
        {selectedItems.length > 0 && (
          <div className="bulk-actions">
            <button 
              className="admin-btn success small"
              onClick={() => handleBulkAction('approve')}
              disabled={isLoading}
            >
              Approve Selected ({selectedItems.length})
            </button>
            <button 
              className="admin-btn danger small"
              onClick={() => handleBulkAction('reject')}
              disabled={isLoading}
            >
              Reject Selected
            </button>
          </div>
        )}
      </div>
      
      <div className="admin-section-content">
        <table className="admin-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredApplications.length && filteredApplications.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Application ID</th>
              <th>Applicant</th>
              <th>Email</th>
              <th>Country</th>
              <th>Visa Type</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(app.id)}
                    onChange={() => handleSelectItem(app.id)}
                  />
                </td>
                <td><strong>{app.id}</strong></td>
                <td>{app.applicant}</td>
                <td>{app.email}</td>
                <td>{app.country}</td>
                <td>{app.visaType}</td>
                <td>
                  <span className={`status-badge ${app.status}`}>
                    {app.status}
                  </span>
                </td>
                <td>{app.submittedDate}</td>
                <td><strong>{app.amount}</strong></td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-btn primary small">View</button>
                    {app.status === 'pending' && (
                      <>
                        <button 
                          className="admin-btn success small"
                          onClick={() => handleStatusChange(app.id, 'approved')}
                          disabled={isLoading}
                        >
                          Approve
                        </button>
                        <button 
                          className="admin-btn danger small"
                          onClick={() => handleStatusChange(app.id, 'rejected')}
                          disabled={isLoading}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="table-pagination">
          <div className="pagination-info">
            Showing {filteredApplications.length} of {applications.length} applications
          </div>
          <div className="pagination-controls">
            <button className="pagination-btn" disabled={currentPage === 1}>
              Previous
            </button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <button className="pagination-btn">Next</button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderUsers = () => (
    <div className="admin-section">
      <div className="admin-section-header">
        <h3 className="admin-section-title">User Management</h3>
        <div className="admin-actions">
          <button className="admin-btn secondary">Export Users</button>
          <button className="admin-btn primary">Add New User</button>
        </div>
      </div>
      
      <div className="search-filter-bar">
        <input
          type="text"
          placeholder="Search users..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      
      <div className="admin-section-content">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Country</th>
              <th>Join Date</th>
              <th>Applications</th>
              <th>Last Login</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td><strong>{user.name}</strong></td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.country}</td>
                <td>{user.joinDate}</td>
                <td>{user.applications}</td>
                <td>{user.lastLogin}</td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-btn primary small">View</button>
                    <button className="admin-btn secondary small">Edit</button>
                    <button 
                      className={`admin-btn ${user.status === 'active' ? 'danger' : 'success'} small`}
                      onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'inactive' : 'active', 'users')}
                      disabled={isLoading}
                    >
                      {user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderCountries = () => (
    <div className="admin-section">
      <div className="admin-section-header">
        <h3 className="admin-section-title">Country Management</h3>
        <div className="admin-actions">
          <button className="admin-btn secondary">Import Countries</button>
          <button className="admin-btn primary">Add New Country</button>
        </div>
      </div>
      <div className="admin-section-content">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Country</th>
              <th>Visa Types</th>
              <th>Applications</th>
              <th>Success Rate</th>
              <th>Processing Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((country) => (
              <tr key={country.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.8rem' }}>{country.flag}</span>
                    <strong>{country.name}</strong>
                  </div>
                </td>
                <td>{country.visaTypes}</td>
                <td>{country.applications}</td>
                <td><strong style={{ color: '#059669' }}>{country.successRate}</strong></td>
                <td>{country.processingTime}</td>
                <td>
                  <span className={`status-badge ${country.status}`}>
                    {country.status}
                  </span>
                </td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-btn primary small">Edit</button>
                    <button className="admin-btn secondary small">Manage Visas</button>
                    <button className="admin-btn danger small">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="form-grid">
      <div className="admin-section">
        <div className="admin-section-header">
          <h3 className="admin-section-title">General Settings</h3>
        </div>
        <div className="admin-section-content">
          <div className="form-section">
            <h4>Company Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Company Name</label>
                <input type="text" defaultValue="Schengen" />
              </div>
              <div className="form-group">
                <label>Contact Email</label>
                <input type="email" defaultValue="info@Schengen.com" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" defaultValue="123 Business Center, NY 10001" />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h4>Processing Settings</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Default Processing Time</label>
                <select>
                  <option>5-7 days</option>
                  <option>7-10 days</option>
                  <option>10-15 days</option>
                  <option>15-30 days</option>
                </select>
              </div>
              <div className="form-group">
                <label>Service Fee (%)</label>
                <input type="number" defaultValue="10" min="0" max="100" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Auto-Approval Limit ($)</label>
                <input type="number" defaultValue="500" />
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h4>Notification Settings</h4>
            <div className="form-row">
              <div className="form-group">
                <label>
                  <input type="checkbox" defaultChecked /> Email notifications for new applications
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" defaultChecked /> SMS alerts for urgent matters
                </label>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <button className="admin-btn primary" style={{ marginRight: '1rem' }}>
              Save Settings
            </button>
            <button className="admin-btn secondary">
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard()
      case 'applications':
        return renderApplications()
      case 'users':
        return renderUsers()
      case 'countries':
        return renderCountries()
      case 'settings':
        return renderSettings()
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo">
            <div className="admin-logo-icon">⚡</div>
            <h1 className="admin-logo-text">Schengen Admin</h1>
          </div>
          
          <div className="admin-user-info">
            <div className="admin-user-avatar">AD</div>
            <div className="admin-user-details">
              <h3>Admin User</h3>
              <p>Super Administrator</p>
            </div>
            <button className="admin-logout">Logout</button>
          </div>
        </div>
      </div>

      <div className="admin-layout">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <li className="admin-nav-item">
              <a 
                href="#" 
                className={`admin-nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setActiveTab('dashboard') }}
              >
                <span className="admin-nav-icon">📊</span>
                Dashboard
              </a>
            </li>
            <li className="admin-nav-item">
              <a 
                href="#" 
                className={`admin-nav-link ${activeTab === 'applications' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setActiveTab('applications') }}
              >
                <span className="admin-nav-icon">📄</span>
                Applications
              </a>
            </li>
            <li className="admin-nav-item">
              <a 
                href="#" 
                className={`admin-nav-link ${activeTab === 'users' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setActiveTab('users') }}
              >
                <span className="admin-nav-icon">👥</span>
                Users
              </a>
            </li>
            <li className="admin-nav-item">
              <a 
                href="#" 
                className={`admin-nav-link ${activeTab === 'countries' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setActiveTab('countries') }}
              >
                <span className="admin-nav-icon">🌍</span>
                Countries
              </a>
            </li>
            <li className="admin-nav-item">
              <a 
                href="#" 
                className={`admin-nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setActiveTab('settings') }}
              >
                <span className="admin-nav-icon">⚙️</span>
                Settings
              </a>
            </li>
          </nav>
        </div>

        <div className="admin-content">
          <div className="admin-page-header">
            <h2 className="admin-page-title">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'applications' && 'Visa Applications Management'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'countries' && 'Country & Visa Management'}
              {activeTab === 'settings' && 'System Settings'}
            </h2>
            <p className="admin-page-subtitle">
              {activeTab === 'dashboard' && 'Monitor your visa business performance and key metrics'}
              {activeTab === 'applications' && 'Manage all visa applications, approve or reject requests, and track processing status'}
              {activeTab === 'users' && 'Manage registered users, view their activity, and control account status'}
              {activeTab === 'countries' && 'Configure countries, visa types, processing times, and requirements'}
              {activeTab === 'settings' && 'Configure system settings, company information, and business preferences'}
            </p>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard