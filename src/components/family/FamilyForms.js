import React from 'react';
import { Save, X } from 'lucide-react';

export const ProfileForm = ({ 
  profileForm, 
  setProfileForm, 
  onSave, 
  onCancel, 
  isEditing, 
  availableAvatars 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? 'Edit Family Member' : 'Add Family Member'}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={profileForm.name}
            onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
          <div className="grid grid-cols-4 gap-2">
            {availableAvatars.slice(0, 8).map((avatar, idx) => (
              <button
                key={idx}
                onClick={() => setProfileForm({...profileForm, avatar})}
                className={`text-2xl p-2 rounded-lg ${profileForm.avatar === avatar ? 'bg-blue-100 border-2 border-blue-500' : 'border border-gray-200'}`}
              >
                {avatar}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {availableAvatars.slice(8).map((avatar, idx) => (
              <button
                key={idx + 8}
                onClick={() => setProfileForm({...profileForm, avatar})}
                className={`text-2xl p-2 rounded-lg ${profileForm.avatar === avatar ? 'bg-blue-100 border-2 border-blue-500' : 'border border-gray-200'}`}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
            <input
              type="number"
              value={profileForm.score}
              onChange={(e) => setProfileForm({...profileForm, score: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Achievements</label>
            <input
              type="number"
              value={profileForm.achievements}
              onChange={(e) => setProfileForm({...profileForm, achievements: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
        </div>
      </div>
      
      <div className="flex space-x-3 mt-6">
        <button
          onClick={onSave}
          className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-medium flex items-center justify-center"
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium flex items-center justify-center"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </button>
      </div>
    </div>
  );
};

export const ChallengeForm = ({
  challengeForm,
  setChallengeForm,
  onSave,
  onCancel,
  isEditing,
  availableIcons
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? 'Edit Challenge' : 'Add Challenge'}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={challengeForm.title}
            onChange={(e) => setChallengeForm({...challengeForm, title: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Challenge title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={challengeForm.description}
            onChange={(e) => setChallengeForm({...challengeForm, description: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the challenge"
            rows="3"
          ></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
          <div className="grid grid-cols-4 gap-2">
            {availableIcons.map((icon, idx) => (
              <button
                key={idx}
                onClick={() => setChallengeForm({...challengeForm, icon: icon.name})}
                className={`p-3 rounded-lg flex items-center justify-center ${
                  challengeForm.icon === icon.name 
                    ? 'bg-blue-100 border-2 border-blue-500' 
                    : 'border border-gray-200'
                }`}
              >
                {icon.component}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
          <input
            type="number"
            value={challengeForm.points}
            onChange={(e) => setChallengeForm({...challengeForm, points: parseInt(e.target.value) || 0})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>
      </div>
      
      <div className="flex space-x-3 mt-6">
        <button
          onClick={onSave}
          className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-medium flex items-center justify-center"
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium flex items-center justify-center"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </button>
      </div>
    </div>
  );
};