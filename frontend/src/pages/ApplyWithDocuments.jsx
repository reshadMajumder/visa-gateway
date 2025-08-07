import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api.js';
import './css/ApplyWithDocuments.css';

const ApplyWithDocuments = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { countryId, visaTypeId } = location.state || {};
  const [requiredDocs, setRequiredDocs] = useState([]);
  const [docFiles, setDocFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visaTypeId) return;
    fetch(`${API_ENDPOINTS.VISA_TYPES}/${visaTypeId}/`)
      .then(res => res.json())
      .then(data => setRequiredDocs(data.required_documents || []))
      .catch(() => setError('Failed to fetch required documents.'));
  }, [visaTypeId]);

  const handleFileChange = (docId, file) => {
    setDocFiles(prev => ({ ...prev, [docId]: file }));
  };

  const handleRemoveFile = (docId) => {
    setDocFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[docId];
      return newFiles;
    });
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png': return '🖼️';
      default: return '📎';
    }
  };

  const getUploadProgress = () => {
    const uploadedCount = Object.keys(docFiles).length;
    const totalCount = requiredDocs.length;
    return {
      uploaded: uploadedCount,
      total: totalCount,
      percentage: totalCount > 0 ? (uploadedCount / totalCount) * 100 : 0
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Check if all required documents are uploaded
    const missingDocs = requiredDocs.filter(doc => !docFiles[doc.id]);
    if (missingDocs.length > 0) {
      setError(`Please upload all required documents: ${missingDocs.map(doc => doc.document_name).join(', ')}`);
      setLoading(false);
      return;
    }
    
    const formData = new FormData();
    formData.append('country_id', countryId);
    formData.append('visa_type_id', visaTypeId);
    
    // Append each file with the correct key format: required_documents[document_id]
    requiredDocs.forEach(doc => {
      if (docFiles[doc.id]) {
        formData.append(`required_documents[${doc.id}]`, docFiles[doc.id]);
      }
    });
    
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    
    try {
      const res = await fetch(API_ENDPOINTS.VISA_APPLICATIONS, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/account'), 2000);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to submit application.');
      }
    } catch (err) {
      setError('Failed to submit application.');
    }
    setLoading(false);
  };

  const progress = getUploadProgress();

  if (!countryId || !visaTypeId) return <div>Invalid access.</div>;

  return (
    <div className="apply-docs-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        Back to Visa Details
      </button>
      
      <h2>Upload Required Documents</h2>
      <p className="subtitle">
        Please upload all required documents for your visa application. 
        Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max 10MB each)
      </p>

      {success ? (
        <div className="success-msg">
          Application submitted successfully! Redirecting to your account...
        </div>
      ) : (
        <>
          <div className="upload-status">
            <span className="status-text">Upload Progress</span>
            <span className="status-count">
              {progress.uploaded}/{progress.total}
            </span>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>

          <form onSubmit={handleSubmit}>
            {requiredDocs.map(doc => (
              <div 
                key={doc.id} 
                className={`doc-upload-field ${docFiles[doc.id] ? 'has-file' : ''}`}
              >
                <label>{doc.document_name}</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  required
                  onChange={e => handleFileChange(doc.id, e.target.files[0])}
                />
                
                {docFiles[doc.id] && (
                  <div className="file-info">
                    <span className="file-icon">
                      {getFileIcon(docFiles[doc.id].name)}
                    </span>
                    <span className="file-name">
                      {docFiles[doc.id].name}
                    </span>
                    <button
                      type="button"
                      className="remove-file"
                      onClick={() => handleRemoveFile(doc.id)}
                      title="Remove file"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {error && <div className="error-msg">{error}</div>}
            
            <button type="submit" disabled={loading || progress.uploaded < progress.total}>
              {loading ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ApplyWithDocuments;



