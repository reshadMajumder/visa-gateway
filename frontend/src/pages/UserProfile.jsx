import { useState } from 'react'
import './UserAccount.css'

const UserProfile = ({ user, error, isEditing, setIsEditing, editForm, setEditForm, saving, handleEditChange, handleFileChange, handleEditSubmit, handleEditCancel }) => {
  return (
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
  )
}

export default UserProfile
