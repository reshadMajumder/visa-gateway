import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
    fetch(`http://127.0.0.1:8000/api/visa-types/${visaTypeId}/`)
      .then(res => res.json())
      .then(data => setRequiredDocs(data.required_documents || []))
      .catch(() => setError('Failed to fetch required documents.'));
  }, [visaTypeId]);

  const handleFileChange = (docId, file) => {
    setDocFiles(prev => ({ ...prev, [docId]: file }));
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
    
    // Create the required_documents_files array
    const filesArray = requiredDocs.map(doc => ({
      required_document_id: doc.id,
      file: docFiles[doc.id]
    }));
    
    // Append the files array as JSON string
    formData.append('required_documents_files', JSON.stringify(filesArray));
    
    // Append each file with a unique key
    requiredDocs.forEach(doc => {
      formData.append(`file_${doc.id}`, docFiles[doc.id]);
    });
    
    try {
      const res = await fetch('http://127.0.0.1:8000/api/visa-applications/', {
        method: 'POST',
        body: formData,
        // Add auth headers if needed
      });
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/account'), 2000);
      } else {
        const errorData = await res.json();
        setError(errorData.required_documents_files?.[0] || 'Failed to submit application.');
      }
    } catch (err) {
      setError('Failed to submit application.');
    }
    setLoading(false);
  };

  if (!countryId || !visaTypeId) return <div>Invalid access.</div>;

  return (
    <div className="apply-docs-page">
      <h2>Apply with Documents</h2>
      {success ? (
        <div className="success-msg">Application submitted successfully!</div>
      ) : (
        <form onSubmit={handleSubmit}>
          {requiredDocs.map(doc => (
            <div key={doc.id} className="doc-upload-field">
              <label>{doc.document_name}</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                required
                onChange={e => handleFileChange(doc.id, e.target.files[0])}
              />
            </div>
          ))}
          {error && <div className="error-msg">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ApplyWithDocuments;



