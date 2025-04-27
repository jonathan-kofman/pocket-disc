import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

export const ProfileActionMenu = ({ 
  memberId, 
  showProfileActions, 
  profileActionRef, 
  onEdit, 
  onDelete 
}) => {
  if (showProfileActions !== memberId) return null;
  
  return (
    <div 
      ref={profileActionRef}
      className="absolute right-2 top-10 bg-white shadow-lg rounded-lg p-2 z-10"
    >
      <button
        onClick={() => onEdit(memberId)}
        className="w-full text-left px-4 py-2 hover:bg-blue-50 rounded flex items-center text-blue-600"
      >
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </button>
      <button
        onClick={() => onDelete(memberId)}
        className="w-full text-left px-4 py-2 hover:bg-red-50 rounded flex items-center text-red-600"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </button>
    </div>
  );
};

export const ChallengeActionMenu = ({
  challengeId,
  showChallengeActions,
  challengeActionRef,
  onEdit,
  onDelete
}) => {
  if (showChallengeActions !== challengeId) return null;
  
  return (
    <div 
      ref={challengeActionRef}
      className="absolute right-2 top-10 bg-white shadow-lg rounded-lg p-2 z-10"
    >
      <button
        onClick={() => onEdit(challengeId)}
        className="w-full text-left px-4 py-2 hover:bg-blue-50 rounded flex items-center text-blue-600"
      >
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </button>
      <button
        onClick={() => onDelete(challengeId)}
        className="w-full text-left px-4 py-2 hover:bg-red-50 rounded flex items-center text-red-600"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </button>
    </div>
  );
};