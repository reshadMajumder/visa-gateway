
import React from 'react';
import './Sidebar.css';

export default function Sidebar({ currentView, setCurrentView, onLogout, user }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'applications', label: 'Applications', icon: '📋' },
    { id: 'countries', label: 'Countries', icon: '🌍' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Visa Admin</h2>
        {user && <p className="user-info">Welcome, Admin</p>}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => setCurrentView(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-button" onClick={onLogout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </div>
  );
}
