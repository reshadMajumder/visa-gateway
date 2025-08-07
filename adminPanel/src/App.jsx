
import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Applications from './components/Applications';
import Countries from './components/Countries';
import VisaTypes from './components/VisaTypes';
import Sidebar from './components/Sidebar';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [selectedCountryId, setSelectedCountryId] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Validate token by making a test request
      validateToken();
    }
  }, []);

  const validateToken = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://spring.rexhad.co/api/admin/countries/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else if (response.status === 401) {
        // Token expired, try to refresh
        await refreshToken();
      } else {
        // Other error, logout
        handleLogout();
      }
    } catch (error) {
      console.error('Token validation error:', error);
      handleLogout();
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('adminRefreshToken');
      if (!refreshToken) {
        handleLogout();
        return;
      }

      const response = await fetch('https://spring.rexhad.co/api/admin/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.access);
        setIsAuthenticated(true);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      handleLogout();
    }
  };

  const handleLogin = (userData, tokens) => {
    localStorage.setItem('adminToken', tokens.access || tokens);
    if (tokens.refresh) {
      localStorage.setItem('adminRefreshToken', tokens.refresh);
    }
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch('https://spring.rexhad.co/api/admin/logout/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRefreshToken');
      setIsAuthenticated(false);
      setUser(null);
      setCurrentView('dashboard');
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'applications':
        return <Applications />;
      case 'countries':
        return <Countries onManageVisaTypes={(countryId) => {
          setSelectedCountryId(countryId);
          setCurrentView('visa-types');
        }} />;
      case 'visa-types':
        return <VisaTypes 
          countryId={selectedCountryId}
          onBack={() => {
            setCurrentView('countries');
            setSelectedCountryId(null);
          }}
        />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-panel">
      <Sidebar 
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={handleLogout}
        user={user}
      />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}
