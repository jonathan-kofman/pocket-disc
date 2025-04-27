import React from 'react';
import { MoreVertical, Plus } from 'lucide-react';
import { ProfileActionMenu } from './ActionMenus';
import { ProfileForm } from './FamilyForms';

const FamilyProfiles = ({
  familyMembers,
  showAddProfile,
  editingProfileId,
  profileForm,
  setProfileForm,
  showProfileActions,
  setShowProfileActions,
  setShowChallengeActions,
  profileActionRef,
  startAddingProfile,
  saveProfile,
  cancelEditProfile,
  startEditingProfile,
  deleteProfile
}) => {
  const handleProfileActionClick = (e, memberId) => {
    e.stopPropagation();
    setShowProfileActions(showProfileActions === memberId ? null : memberId);
    setShowChallengeActions(null); // Close any open challenge menus
  };

  return (
    <div>
      {showAddProfile && (
        <ProfileForm
          profileForm={profileForm}
          setProfileForm={setProfileForm}
          onSave={saveProfile}
          onCancel={cancelEditProfile}
          isEditing={false}
          availableAvatars={['👤', '👩', '👨', '👧', '👦', '👵', '👴', '🧒', '👱‍♀️', '👱', '👩‍🦰', '👨‍🦰', '👩‍🦱', '👨‍🦱']}
        />
      )}
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Family Members</h3>
        <button
          onClick={startAddingProfile}
          className="bg-blue-500 text-white px-3 py-1 rounded-lg flex items-center text-sm"
          disabled={showAddProfile}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </button>
      </div>
      
      <div className="space-y-3">
        {familyMembers.map(member => (
          <div key={member.id} className="relative bg-white rounded-lg shadow-lg p-4">
            {editingProfileId === member.id ? (
              <ProfileForm
                profileForm={profileForm}
                setProfileForm={setProfileForm}
                onSave={saveProfile}
                onCancel={cancelEditProfile}
                isEditing={true}
                availableAvatars={['👤', '👩', '👨', '👧', '👦', '👵', '👴', '🧒', '👱‍♀️', '👱', '👩‍🦰', '👨‍🦰', '👩‍🦱', '👨‍🦱']}
              />
            ) : (
              <>
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => handleProfileActionClick(e, member.id)}
                    className="p-1 text-gray-500 hover:text-blue-500"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  <ProfileActionMenu 
                    memberId={member.id}
                    showProfileActions={showProfileActions}
                    profileActionRef={profileActionRef}
                    onEdit={startEditingProfile}
                    onDelete={deleteProfile}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-4xl mr-4">{member.avatar}</span>
                    <div>
                      <h3 className="text-lg font-semibold">{member.name}</h3>
                      <p className="text-sm text-gray-500">{member.achievements} achievements</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-500">{member.score}</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyProfiles;