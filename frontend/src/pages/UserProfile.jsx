import { Edit3, Save, X, User, Mail, Phone, Calendar, MapPin, Camera } from 'lucide-react'

const UserProfile = ({ user, error, isEditing, setIsEditing, editForm, saving, handleEditChange, handleFileChange, handleEditSubmit, handleEditCancel }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-6 bg-transparent">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-2xl font-bold mb-1">Personal Information</h2>
                <p className="text-sm sm:text-base text-blue-100">Manage your account details</p>
              </div>
            </div>
            {!isEditing && (
              <button 
                className="bg-white/20 hover:bg-white/30 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 backdrop-blur-sm hover:scale-105 text-sm sm:text-base"
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
          <div className="mx-4 sm:mx-6 mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 font-medium text-sm sm:text-base">{error}</p>
            </div>
          </div>
        )}
        
        {/* Form Section */}
        <form onSubmit={handleEditSubmit} className="p-4 sm:p-6 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <User className="w-4 h-4 text-gray-500" />
                <span>Username</span>
              </label>
              <input 
                type="text" 
                value={user.username} 
                readOnly 
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
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
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl transition-all duration-300 text-sm sm:text-base ${
                  isEditing 
                    ? 'bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
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
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl transition-all duration-300 text-sm sm:text-base ${
                  isEditing 
                    ? 'bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
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
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl transition-all duration-300 text-sm sm:text-base ${
                  isEditing 
                    ? 'bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
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
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl transition-all duration-300 text-sm sm:text-base ${
                  isEditing 
                    ? 'bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>Date of Birth</span>
              </label>
              <input 
                type="date" 
                name="date_of_birth"
                value={isEditing ? editForm.date_of_birth : (user.date_of_birth || '')} 
                onChange={handleEditChange}
                readOnly={!isEditing}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl transition-all duration-300 text-sm sm:text-base ${
                  isEditing 
                    ? 'bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>
          </div>

          {/* Address - Full Width */}
          <div className="mt-4 sm:mt-6 space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
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
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl transition-all duration-300 resize-none text-sm sm:text-base ${
                isEditing 
                  ? 'bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            />
          </div>

          {/* Profile Picture Upload */}
          {isEditing && (
            <div className="mt-4 sm:mt-6 space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Camera className="w-4 h-4 text-gray-500" />
                <span>Profile Picture</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-6 hover:border-blue-400 transition-colors duration-300">
                <input 
                  type="file" 
                  name="profile_picture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs sm:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:sm:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
                />
                {user.profile_picture && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600">
                      <span className="font-medium">Current:</span> {user.profile_picture.split('/').pop()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Member Since */}
          <div className="mt-4 sm:mt-6 space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>Member Since</span>
            </label>
            <input 
              type="text" 
              value={new Date(user.created_at).toLocaleDateString()} 
              readOnly 
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none text-sm sm:text-base"
            />
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
              <button 
                type="submit" 
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100 text-sm sm:text-base"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button 
                type="button" 
                onClick={handleEditCancel}
                disabled={saving}
                className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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
