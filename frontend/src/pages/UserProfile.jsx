import { Edit3, Save, X, User, Mail, Phone, Calendar, MapPin, Camera } from 'lucide-react'

const UserProfile = ({ user, error, isEditing, setIsEditing, editForm, saving, handleEditChange, handleFileChange, handleEditSubmit, handleEditCancel }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between mx-auto">
            <div className="flex items-center space-x-4 mb-4 md:mb-0 mx-auto">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mx-auto">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="mx-auto">
                <h2 className="text-2xl font-bold mb-1">Personal Information</h2>
                <p className="text-blue-100">Manage your account details</p>
              </div>
            </div>
            {!isEditing && (
              <button 
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 backdrop-blur-sm hover:scale-105 mx-auto"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 mx-auto">
              <X className="w-5 h-5 text-red-500" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}
        
        {/* Form Section */}
        <form onSubmit={handleEditSubmit} className="p-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto">
            {/* Username */}
            <div className="space-y-2 mx-auto">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mx-auto">
                <User className="w-4 h-4 text-gray-500" />
                <span>Username</span>
              </label>
              <input 
                type="text" 
                value={user.username} 
                readOnly 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 mx-auto"
              />
            </div>

            {/* Email */}
            <div className="space-y-2 mx-auto">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mx-auto">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>Email Address</span>
              </label>
              <input 
                type="email" 
                name="email"
                value={isEditing ? editForm.email : (user.email || '')} 
                onChange={handleEditChange}
                readOnly={!isEditing}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 mx-auto ${
                  isEditing 
                    ? 'bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>

            {/* First Name */}
            <div className="space-y-2 mx-auto">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mx-auto">
                <User className="w-4 h-4 text-gray-500" />
                <span>First Name</span>
              </label>
              <input 
                type="text" 
                name="first_name"
                value={isEditing ? editForm.first_name : (user.first_name || '')} 
                onChange={handleEditChange}
                readOnly={!isEditing}
                placeholder="Enter your first name"
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 mx-auto ${
                  isEditing 
                    ? 'bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2 mx-auto">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mx-auto">
                <User className="w-4 h-4 text-gray-500" />
                <span>Last Name</span>
              </label>
              <input 
                type="text" 
                name="last_name"
                value={isEditing ? editForm.last_name : (user.last_name || '')} 
                onChange={handleEditChange}
                readOnly={!isEditing}
                placeholder="Enter your last name"
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 mx-auto ${
                  isEditing 
                    ? 'bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2 mx-auto">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mx-auto">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>Phone Number</span>
              </label>
              <input 
                type="tel" 
                name="phone_number"
                value={isEditing ? editForm.phone_number : (user.phone_number || '')} 
                onChange={handleEditChange}
                readOnly={!isEditing}
                placeholder="Enter your phone number"
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 mx-auto ${
                  isEditing 
                    ? 'bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2 mx-auto">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mx-auto">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>Date of Birth</span>
              </label>
              <input 
                type="date" 
                name="date_of_birth"
                value={isEditing ? editForm.date_of_birth : (user.date_of_birth || '')} 
                onChange={handleEditChange}
                readOnly={!isEditing}
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 mx-auto ${
                  isEditing 
                    ? 'bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>
          </div>

          {/* Address - Full Width */}
          <div className="mt-6 space-y-2 mx-auto">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mx-auto">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>Address</span>
            </label>
            <textarea 
              name="address"
              value={isEditing ? editForm.address : (user.address || '')} 
              onChange={handleEditChange}
              readOnly={!isEditing}
              placeholder="Enter your address"
              rows="3"
              className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 resize-none mx-auto ${
                isEditing 
                  ? 'bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            />
          </div>

          {/* Profile Picture Upload */}
          {isEditing && (
            <div className="mt-6 space-y-2 mx-auto">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mx-auto">
                <Camera className="w-4 h-4 text-gray-500" />
                <span>Profile Picture</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors duration-300 mx-auto">
                <input 
                  type="file" 
                  name="profile_picture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer mx-auto"
                />
                {user.profile_picture && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg mx-auto">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Current:</span> {user.profile_picture.split('/').pop()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Member Since */}
          <div className="mt-6 space-y-2 mx-auto">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mx-auto">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>Member Since</span>
            </label>
            <input 
              type="text" 
              value={new Date(user.created_at).toLocaleDateString()} 
              readOnly 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none mx-auto"
            />
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 mx-auto">
              <button 
                type="submit" 
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100 mx-auto"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button 
                type="button" 
                onClick={handleEditCancel}
                disabled={saving}
                className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default UserProfile
