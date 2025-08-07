
import React, { useState, useEffect } from 'react';
import './Applications.css';
import { apiRequest } from '../utils/api';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await apiRequest('/visa-applications/');

      if (response && response.ok) {
        const data = await response.json();
        setApplications(data.Applications || []);
      } else if (response) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Failed to fetch applications: ${response.status} ${response.statusText}${errorData.message ? ' - ' + errorData.message : ''}`);
        setApplications([]);
      } else {
        console.error('Request failed');
        setApplications([]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus, adminNotes = '', rejectionReason = '') => {
    try {
      const response = await apiRequest(`/visa-applications/${applicationId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ 
          status: newStatus,
          admin_notes: adminNotes,
          rejection_reason: rejectionReason
        }),
      });

      if (response && response.ok) {
        // Update local state
        setApplications(applications.map(app => 
          app.id === applicationId ? { 
            ...app, 
            status: newStatus,
            admin_notes: adminNotes,
            rejection_reason: rejectionReason
          } : app
        ));
      } else {
        console.error('Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const updateDocumentStatus = async (applicationId, documentId, newStatus, adminNotes = '', rejectionReason = '') => {
    try {
      const response = await apiRequest(`/visa-applications/${applicationId}/documents/${documentId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ 
          status: newStatus,
          admin_notes: adminNotes,
          rejection_reason: rejectionReason
        }),
      });

      if (response && response.ok) {
        // Update local state
        setApplications(applications.map(app => 
          app.id === applicationId ? {
            ...app,
            visa_type: {
              ...app.visa_type,
              required_documents: app.visa_type.required_documents.map(doc =>
                doc.id === documentId ? {
                  ...doc,
                  status: newStatus,
                  admin_notes: adminNotes,
                  rejection_reason: rejectionReason
                } : doc
              )
            }
          } : app
        ));
      } else {
        console.error('Failed to update document status');
      }
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'draft': return 'status-draft';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedApplication(null);
  };

  if (loading) {
    return <div className="loading">Loading applications...</div>;
  }

  return (
    <div className="applications">
      <div className="applications-header">
        <h1>Applications Management</h1>
        <div className="applications-filters">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'draft' ? 'active' : ''}
            onClick={() => setFilter('draft')}
          >
            Draft
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={filter === 'approved' ? 'active' : ''}
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
          <button 
            className={filter === 'rejected' ? 'active' : ''}
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      <div className="applications-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Country</th>
              <th>Visa Type</th>
              <th>Status</th>
              <th>Documents</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((application) => (
              <tr key={application.id}>
                <td>{application.id}</td>
                <td>{application.user.username}</td>
                <td>
                  <div className="country-info">
                    {application.country.image && (
                      <img 
                        src={`https://spring.rexhad.co${application.country.image}`} 
                        alt={application.country.name}
                        className="country-flag"
                      />
                    )}
                    {application.country.name}
                  </div>
                </td>
                <td>
                  <div className="visa-type-info">
                    {application.visa_type.image && (
                      <img 
                        src={`https://spring.rexhad.co${application.visa_type.image}`} 
                        alt={application.visa_type.name}
                        className="visa-type-image"
                      />
                    )}
                    {application.visa_type.name}
                  </div>
                </td>
                <td>
                  <span className={`status ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                </td>
                <td>
                  <div className="documents-list">
                    {application.visa_type.required_documents.length > 0 ? (
                      application.visa_type.required_documents.map((doc) => (
                        <div key={doc.id} className="document-item">
                          <span className="document-name">{doc.document_name}</span>
                          <span className={`status ${getStatusColor(doc.status)}`}>
                            {doc.status}
                          </span>
                          <div className="document-actions">
                            {doc.status === 'pending' && (
                              <>
                                <button 
                                  className="approve-btn small"
                                  onClick={() => updateDocumentStatus(application.id, doc.id, 'approved')}
                                >
                                  ✓
                                </button>
                                <button 
                                  className="reject-btn small"
                                  onClick={() => updateDocumentStatus(application.id, doc.id, 'rejected')}
                                >
                                  ✗
                                </button>
                              </>
                            )}
                            {doc.document_file && (
                              <a 
                                href={`https://spring.rexhad.co${doc.document_file}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="view-doc-btn"
                              >
                                📄
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="no-documents">No documents</span>
                    )}
                  </div>
                </td>
                <td>{formatDate(application.created_at)}</td>
                <td>
                  <div className="action-buttons">
                    {application.status === 'pending' && (
                      <>
                        <button 
                          className="approve-btn"
                          onClick={() => updateApplicationStatus(application.id, 'approved')}
                        >
                          Approve
                        </button>
                        <button 
                          className="reject-btn"
                          onClick={() => updateApplicationStatus(application.id, 'rejected')}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button 
                      className="view-btn"
                      onClick={() => handleViewDetails(application)}
                    >
                      View Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredApplications.length === 0 && (
        <div className="no-data">
          No applications found for the selected filter.
        </div>
      )}

      {showDetailsModal && selectedApplication && (
        <div className="modal-overlay" onClick={closeDetailsModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Application Details</h2>
              <button className="close-btn" onClick={closeDetailsModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3>Application Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Application ID:</strong> {selectedApplication.id}
                  </div>
                  <div className="detail-item">
                    <strong>User:</strong> {selectedApplication.user.username}
                  </div>
                  <div className="detail-item">
                    <strong>Email:</strong> {selectedApplication.user.email || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Status:</strong> 
                    <span className={`status ${getStatusColor(selectedApplication.status)}`}>
                      {selectedApplication.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <strong>Created:</strong> {formatDate(selectedApplication.created_at)}
                  </div>
                  <div className="detail-item">
                    <strong>Updated:</strong> {formatDate(selectedApplication.updated_at)}
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Country & Visa Type</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Country:</strong>
                    <div className="country-info">
                      {selectedApplication.country.image && (
                        <img 
                          src={`https://spring.rexhad.co${selectedApplication.country.image}`} 
                          alt={selectedApplication.country.name}
                          className="country-flag"
                        />
                      )}
                      {selectedApplication.country.name}
                    </div>
                  </div>
                  <div className="detail-item">
                    <strong>Visa Type:</strong>
                    <div className="visa-type-info">
                      {selectedApplication.visa_type.image && (
                        <img 
                          src={`https://spring.rexhad.co${selectedApplication.visa_type.image}`} 
                          alt={selectedApplication.visa_type.name}
                          className="visa-type-image"
                        />
                      )}
                      {selectedApplication.visa_type.name}
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Required Documents</h3>
                {selectedApplication.visa_type.required_documents.length > 0 ? (
                  <div className="documents-detail-list">
                    {selectedApplication.visa_type.required_documents.map((doc) => (
                      <div key={doc.id} className="document-detail-item">
                        <div className="document-header">
                          <h4>{doc.document_name}</h4>
                          <span className={`status ${getStatusColor(doc.status)}`}>
                            {doc.status}
                          </span>
                        </div>
                        {doc.description && (
                          <p className="document-description">{doc.description}</p>
                        )}
                        <div className="document-detail-actions">
                          {doc.document_file && (
                            <a 
                              href={`https://spring.rexhad.co${doc.document_file}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="view-document-btn"
                            >
                              📄 View Document
                            </a>
                          )}
                          {doc.status === 'pending' && (
                            <div className="document-status-actions">
                              <button 
                                className="approve-btn"
                                onClick={() => updateDocumentStatus(selectedApplication.id, doc.id, 'approved')}
                              >
                                Approve
                              </button>
                              <button 
                                className="reject-btn"
                                onClick={() => updateDocumentStatus(selectedApplication.id, doc.id, 'rejected')}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                        {doc.admin_notes && (
                          <div className="admin-notes">
                            <strong>Admin Notes:</strong> {doc.admin_notes}
                          </div>
                        )}
                        {doc.rejection_reason && (
                          <div className="rejection-reason">
                            <strong>Rejection Reason:</strong> {doc.rejection_reason}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No documents required for this visa type.</p>
                )}
              </div>

              {selectedApplication.admin_notes && (
                <div className="detail-section">
                  <h3>Admin Notes</h3>
                  <p>{selectedApplication.admin_notes}</p>
                </div>
              )}

              {selectedApplication.rejection_reason && (
                <div className="detail-section">
                  <h3>Rejection Reason</h3>
                  <p>{selectedApplication.rejection_reason}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              {selectedApplication.status === 'pending' && (
                <div className="modal-actions">
                  <button 
                    className="approve-btn"
                    onClick={() => {
                      updateApplicationStatus(selectedApplication.id, 'approved');
                      closeDetailsModal();
                    }}
                  >
                    Approve Application
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => {
                      updateApplicationStatus(selectedApplication.id, 'rejected');
                      closeDetailsModal();
                    }}
                  >
                    Reject Application
                  </button>
                </div>
              )}
              <button className="close-modal-btn" onClick={closeDetailsModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
