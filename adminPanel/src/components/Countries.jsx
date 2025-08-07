
import React, { useState, useEffect } from 'react';
import './Countries.css';
import { apiRequest } from '../utils/api';

export default function Countries({ onManageVisaTypes }) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    image: null
  });

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await apiRequest('/countries/');
      
      if (response && response.ok) {
        const data = await response.json();
        setCountries(data);
      } else if (response) {
        const errorData = await response.json().catch(() => ({}));
        setError(`Failed to fetch countries: ${response.status} ${response.statusText}${errorData.message ? ' - ' + errorData.message : ''}`);
      } else {
        setError('Request failed');
      }
    } catch (error) {
      setError('Error fetching countries');
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('code', formData.code);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const endpoint = editingCountry 
        ? `/countries/${editingCountry.id}/`
        : '/countries/';
      
      const method = editingCountry ? 'PUT' : 'POST';

      const response = await apiRequest(endpoint, {
        method,
        body: formDataToSend,
        headers: {}, // Don't set Content-Type for FormData
      });

      if (response.ok) {
        await fetchCountries();
        setShowForm(false);
        setEditingCountry(null);
        setFormData({ name: '', description: '', code: '', image: null });
      } else {
        setError('Failed to save country');
      }
    } catch (error) {
      setError('Error saving country');
      console.error('Error saving country:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (country) => {
    setEditingCountry(country);
    setFormData({
      name: country.name,
      description: country.description,
      code: country.code,
      image: null
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this country?')) return;

    try {
      const response = await apiRequest(`/countries/${id}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCountries();
      } else {
        setError('Failed to delete country');
      }
    } catch (error) {
      setError('Error deleting country');
      console.error('Error deleting country:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  if (loading && !showForm) {
    return <div className="loading">Loading countries...</div>;
  }

  return (
    <div className="countries-container">
      <div className="countries-header">
        <h1>Countries Management</h1>
        <button 
          className="add-button"
          onClick={() => {
            setShowForm(true);
            setEditingCountry(null);
            setFormData({ name: '', description: '', code: '', image: null });
          }}
        >
          Add New Country
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h2>{editingCountry ? 'Edit Country' : 'Add New Country'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Country Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="code">Country Code</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Country Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                />
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingCountry ? 'Update' : 'Create')}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingCountry(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="countries-list">
        {countries.length === 0 ? (
          <div className="no-data">No countries found</div>
        ) : (
          <div className="countries-grid">
            {countries.map((country) => (
              <div key={country.id} className="country-card">
                {country.image && (
                  <img src={country.image} alt={country.name} className="country-image" />
                )}
                <div className="country-details">
                  <h3>{country.name}</h3>
                  <p><strong>Code:</strong> {country.code}</p>
                  <p><strong>Description:</strong> {country.description}</p>
                  <div className="country-actions">
                    <button 
                      className="edit-button"
                      onClick={() => handleEdit(country)}
                    >
                      Edit
                    </button>
                    <button 
                      className="visa-types-button"
                      onClick={() => onManageVisaTypes && onManageVisaTypes(country.id)}
                    >
                      Manage Visa Types
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(country.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
