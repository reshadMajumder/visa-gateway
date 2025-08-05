
import React, { useState, useEffect } from 'react';
import './VisaTypes.css';
import { apiRequest } from '../utils/api';

export default function VisaTypes({ countryId, onBack }) {
  const [visaTypes, setVisaTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingVisaType, setEditingVisaType] = useState(null);
  
  // Options for dropdowns
  const [notes, setNotes] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [overviews, setOverviews] = useState([]);
  const [requiredDocuments, setRequiredDocuments] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    headings: '',
    description: '',
    price: '',
    expected_processing_time: '',
    active: true,
    image: null,
    process_ids: [],
    overview_ids: [],
    note_ids: [],
    required_document_ids: []
  });

  useEffect(() => {
    fetchVisaTypes();
    fetchDropdownOptions();
  }, [countryId]);

  const fetchVisaTypes = async () => {
    try {
      const response = await apiRequest(`/countries/${countryId}/visa-types/`);
      
      if (response && response.ok) {
        const data = await response.json();
        setVisaTypes(data);
      } else if (response) {
        const errorData = await response.json().catch(() => ({}));
        setError(`Failed to fetch visa types: ${response.status} ${response.statusText}${errorData.message ? ' - ' + errorData.message : ''}`);
      } else {
        setError('Request failed');
      }
    } catch (error) {
      setError('Error fetching visa types');
      console.error('Error fetching visa types:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownOptions = async () => {
    try {
      const [notesRes, processesRes, overviewsRes, docsRes] = await Promise.all([
        apiRequest('/notes/'),
        apiRequest('/visa-process/'),
        apiRequest('/visa-overview/'),
        apiRequest('/required-documents/')
      ]);

      if (notesRes?.ok) {
        const notesData = await notesRes.json();
        setNotes(notesData);
      }
      
      if (processesRes?.ok) {
        const processesData = await processesRes.json();
        setProcesses(processesData);
      }
      
      if (overviewsRes?.ok) {
        const overviewsData = await overviewsRes.json();
        setOverviews(overviewsData);
      }
      
      if (docsRes?.ok) {
        const docsData = await docsRes.json();
        setRequiredDocuments(docsData);
      }
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Basic fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('headings', formData.headings);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('expected_processing_time', formData.expected_processing_time);
      formDataToSend.append('active', formData.active);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      // Process arrays and objects as JSON strings
      formDataToSend.append('process_ids', formData.process_ids.join(','));
      formDataToSend.append('overview_ids', formData.overview_ids.join(','));
      formDataToSend.append('note_ids', formData.note_ids.join(','));
      formDataToSend.append('required_document_ids', formData.required_document_ids.join(','));

      const endpoint = editingVisaType 
        ? `/countries/${countryId}/visa-types/${editingVisaType.id}/`
        : `/countries/${countryId}/visa-types/`;
      
      const method = editingVisaType ? 'PUT' : 'POST';

      const response = await apiRequest(endpoint, {
        method,
        body: formDataToSend,
        headers: {}, // Don't set Content-Type for FormData
      });

      if (response.ok) {
        await fetchVisaTypes();
        setShowForm(false);
        setEditingVisaType(null);
        resetForm();
      } else {
        setError('Failed to save visa type');
      }
    } catch (error) {
      setError('Error saving visa type');
      console.error('Error saving visa type:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (visaType) => {
    setEditingVisaType(visaType);
    setFormData({
      name: visaType.name,
      headings: visaType.headings,
      description: visaType.description || '',
      price: visaType.price,
      expected_processing_time: visaType.expected_processing_time || '',
      active: visaType.active,
      image: null,
      process_ids: visaType.processes?.map(p => p.id) || [],
      overview_ids: visaType.overviews?.map(o => o.id) || [],
      note_ids: visaType.notes?.map(n => n.id) || [],
      required_document_ids: visaType.required_documents?.map(d => d.id) || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this visa type?')) return;

    try {
      const response = await apiRequest(`/countries/${countryId}/visa-types/${id}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchVisaTypes();
      } else {
        setError('Failed to delete visa type');
      }
    } catch (error) {
      setError('Error deleting visa type');
      console.error('Error deleting visa type:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : type === 'checkbox' ? checked : value
    }));
  };

  const handleMultiSelectChange = (fieldName, value) => {
    const currentValues = formData[fieldName];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(id => id !== value)
      : [...currentValues, value];
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: newValues
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      headings: '',
      description: '',
      price: '',
      expected_processing_time: '',
      active: true,
      image: null,
      process_ids: [],
      overview_ids: [],
      note_ids: [],
      required_document_ids: []
    });
  };

  if (loading && !showForm) {
    return <div className="loading">Loading visa types...</div>;
  }

  return (
    <div className="visa-types-container">
      <div className="visa-types-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Countries
        </button>
        <h1>Visa Types Management</h1>
        <button 
          className="add-button"
          onClick={() => {
            setShowForm(true);
            setEditingVisaType(null);
            resetForm();
          }}
        >
          Add New Visa Type
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h2>{editingVisaType ? 'Edit Visa Type' : 'Add New Visa Type'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Visa Type Name</label>
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
                <label htmlFor="headings">Headings</label>
                <input
                  type="text"
                  id="headings"
                  name="headings"
                  value={formData.headings}
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
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="expected_processing_time">Expected Processing Time</label>
                <input
                  type="text"
                  id="expected_processing_time"
                  name="expected_processing_time"
                  value={formData.expected_processing_time}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Visa Type Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                  />
                  Active
                </label>
              </div>

              <div className="form-group">
                <label>Visa Processes</label>
                <div className="multi-select-container">
                  {processes.map((process) => (
                    <label key={process.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.process_ids.includes(process.id)}
                        onChange={() => handleMultiSelectChange('process_ids', process.id)}
                      />
                      {process.points}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Visa Overviews</label>
                <div className="multi-select-container">
                  {overviews.map((overview) => (
                    <label key={overview.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.overview_ids.includes(overview.id)}
                        onChange={() => handleMultiSelectChange('overview_ids', overview.id)}
                      />
                      {overview.points} - {overview.overview}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <div className="multi-select-container">
                  {notes.map((note) => (
                    <label key={note.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.note_ids.includes(note.id)}
                        onChange={() => handleMultiSelectChange('note_ids', note.id)}
                      />
                      {note.notes}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Required Documents</label>
                <div className="multi-select-container">
                  {requiredDocuments.map((doc) => (
                    <label key={doc.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.required_document_ids.includes(doc.id)}
                        onChange={() => handleMultiSelectChange('required_document_ids', doc.id)}
                      />
                      {doc.document_name} - {doc.description}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingVisaType ? 'Update' : 'Create')}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingVisaType(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="visa-types-list">
        {visaTypes.length === 0 ? (
          <div className="no-data">No visa types found</div>
        ) : (
          <div className="visa-types-grid">
            {visaTypes.map((visaType) => (
              <div key={visaType.id} className="visa-type-card">
                {visaType.image && (
                  <img src={visaType.image} alt={visaType.name} className="visa-type-image" />
                )}
                <div className="visa-type-details">
                  <h3>{visaType.name}</h3>
                  <p><strong>Headings:</strong> {visaType.headings}</p>
                  <p><strong>Price:</strong> ${visaType.price}</p>
                  <p><strong>Processing Time:</strong> {visaType.expected_processing_time || 'N/A'}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status ${visaType.active ? 'active' : 'inactive'}`}>
                      {visaType.active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                  {visaType.description && <p><strong>Description:</strong> {visaType.description}</p>}
                  
                  <div className="visa-type-actions">
                    <button 
                      className="edit-button"
                      onClick={() => handleEdit(visaType)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(visaType.id)}
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
