import React from 'react';
import { MoreVertical, Plus } from 'lucide-react';
import { ChallengeActionMenu } from './ActionMenus';
import { ChallengeForm } from './FamilyForms';

const FamilyChallenges = ({
  challenges,
  showAddChallenge,
  editingChallengeId,
  challengeForm,
  setChallengeForm,
  showChallengeActions,
  setShowChallengeActions,
  setShowProfileActions,
  challengeActionRef,
  startAddingChallenge,
  saveChallenge,
  cancelEditChallenge,
  startEditingChallenge,
  deleteChallenge,
  setShowChallengeDetails,
  getIconComponent,
  availableIcons
}) => {
  const handleChallengeActionClick = (e, challengeId) => {
    e.stopPropagation();
    setShowChallengeActions(showChallengeActions === challengeId ? null : challengeId);
    setShowProfileActions(null); // Close any open profile menus
  };

  return (
    <div>
      {showAddChallenge && (
        <ChallengeForm
          challengeForm={challengeForm}
          setChallengeForm={setChallengeForm}
          onSave={saveChallenge}
          onCancel={cancelEditChallenge}
          isEditing={false}
          availableIcons={availableIcons}
        />
      )}
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Family Challenges</h3>
        <button
          onClick={startAddingChallenge}
          className="bg-blue-500 text-white px-3 py-1 rounded-lg flex items-center text-sm"
          disabled={showAddChallenge}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </button>
      </div>
      
      <div className="space-y-3">
        {challenges.map(challenge => (
          <div key={challenge.id} className="relative bg-white rounded-lg shadow-lg p-4">
            {editingChallengeId === challenge.id ? (
              <ChallengeForm
                challengeForm={challengeForm}
                setChallengeForm={setChallengeForm}
                onSave={saveChallenge}
                onCancel={cancelEditChallenge}
                isEditing={true}
                availableIcons={availableIcons}
              />
            ) : (
              <>
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => handleChallengeActionClick(e, challenge.id)}
                    className="p-1 text-gray-500 hover:text-blue-500"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  <ChallengeActionMenu 
                    challengeId={challenge.id}
                    showChallengeActions={showChallengeActions}
                    challengeActionRef={challengeActionRef}
                    onEdit={startEditingChallenge}
                    onDelete={deleteChallenge}
                  />
                </div>
                
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => setShowChallengeDetails(challenge)}
                >
                  <div className="p-2 rounded-full bg-blue-100 mr-4">
                    {getIconComponent(challenge.icon)}
                  </div>
                  <div className="flex-1 mr-2">
                    <h3 className="text-lg font-semibold">{challenge.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{challenge.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold text-yellow-500">{challenge.points}</p>
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

export default FamilyChallenges;