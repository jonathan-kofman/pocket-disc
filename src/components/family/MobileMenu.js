import React from 'react';
import { X, Users, Trophy, Star } from 'lucide-react';

const MobileMenu = ({ show, activeTab, setActiveTab, onClose }) => {
  if (!show) return null;
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-end">
      <div className="bg-white rounded-t-xl p-4 w-full transform transition-transform">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Menu</h3>
          <button 
            onClick={onClose}
            className="text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={() => handleTabChange('profiles')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'profiles' ? 'bg-blue-100 text-blue-600' : 'bg-gray-50'}`}
          >
            <Users className="h-5 w-5 mr-3" />
            Family Profiles
          </button>
          <button
            onClick={() => handleTabChange('challenges')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'challenges' ? 'bg-blue-100 text-blue-600' : 'bg-gray-50'}`}
          >
            <Trophy className="h-5 w-5 mr-3" />
            Challenges
          </button>
          <button
            onClick={() => handleTabChange('quicklinks')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'quicklinks' ? 'bg-blue-100 text-blue-600' : 'bg-gray-50'}`}
          >
            <Star className="h-5 w-5 mr-3" />
            Resources
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;