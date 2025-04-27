import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Users, Trophy, Star, Menu } from 'lucide-react';
import { ChallengeImplementation } from '../ChallengeImplementations';

// Import separated components
import FamilyProfiles from './FamilyProfiles';
import FamilyChallenges from './FamilyChallenges';
import QuickLinks from './QuickLinks';
import ResourceDetailsWrapper from './ResourceDetails';
import ConfirmDialog from './ConfirmDialog';
import MobileMenu from './MobileMenu';

// Import data and utilities
import { quickLinksData } from './data/quickLinksData';
import { availableIcons, getIconComponent } from './utils/iconUtils';

const FamilyMode = ({ onBack }) => {
  // Tab navigation state
  const [activeTab, setActiveTab] = useState('profiles');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Detail view states
  const [showChallengeDetails, setShowChallengeDetails] = useState(null);
  const [showResourceDetails, setShowResourceDetails] = useState(null);
  
  // Resource-specific states
  const [familyRules, setFamilyRules] = useState([]);
  const [newRule, setNewRule] = useState('');
  const [selectedSound, setSelectedSound] = useState('Classic Chain Rattle');
  
  // Challenge states
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [activeFunChallenge, setActiveFunChallenge] = useState(null);
  
  // Action menu refs and states
  const profileActionRef = useRef(null);
  const challengeActionRef = useRef(null);
  const [showProfileActions, setShowProfileActions] = useState(null);
  const [showChallengeActions, setShowChallengeActions] = useState(null);
  
  // Confirmation dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogMessage, setConfirmDialogMessage] = useState('');
  const [confirmDialogAction, setConfirmDialogAction] = useState(null);
  
  // Family profiles state
  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: 'Mom', avatar: '👩', score: 120, achievements: 5 },
    { id: 2, name: 'Dad', avatar: '👨', score: 150, achievements: 8 },
    { id: 3, name: 'Emma', avatar: '👧', score: 80, achievements: 3 },
    { id: 4, name: 'Liam', avatar: '👦', score: 95, achievements: 4 }
  ]);
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: '', avatar: '👤', score: 0, achievements: 0 });
  const [showAddProfile, setShowAddProfile] = useState(false);
  
  // Challenge state
  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: 'Around the World',
      description: 'Complete throws from 5 different spots in your backyard',
      icon: 'Target',
      points: 50
    },
    {
      id: 2,
      title: 'Trick Shot Master',
      description: 'Record and share your best trick shot',
      icon: 'Camera',
      points: 75
    },
    {
      id: 3,
      title: 'Family Tournament',
      description: 'Compete in a family tournament',
      icon: 'Trophy',
      points: 100
    }
  ]);
  const [editingChallengeId, setEditingChallengeId] = useState(null);
  const [challengeForm, setChallengeForm] = useState({ 
    title: '', 
    description: '', 
    icon: 'Target', 
    points: 50 
  });
  const [showAddChallenge, setShowAddChallenge] = useState(false);

  // Handle outside clicks to close menus
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileActionRef.current && !profileActionRef.current.contains(event.target)) {
        setShowProfileActions(null);
      }
      if (challengeActionRef.current && !challengeActionRef.current.contains(event.target)) {
        setShowChallengeActions(null);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Profile Functions
  const startEditingProfile = (profileId) => {
    const profile = familyMembers.find(member => member.id === profileId);
    setEditingProfileId(profile.id);
    setProfileForm({
      name: profile.name,
      avatar: profile.avatar,
      score: profile.score,
      achievements: profile.achievements
    });
    setShowProfileActions(null);
  };

  const startAddingProfile = () => {
    setShowAddProfile(true);
    setProfileForm({
      name: '',
      avatar: '👤',
      score: 0,
      achievements: 0
    });
  };

  const saveProfile = () => {
    if (profileForm.name.trim() === '') return;
    
    if (editingProfileId) {
      // Update existing profile
      setFamilyMembers(familyMembers.map(member => 
        member.id === editingProfileId ? { ...member, ...profileForm } : member
      ));
      setEditingProfileId(null);
    } else if (showAddProfile) {
      // Add new profile
      const newId = Math.max(0, ...familyMembers.map(m => m.id)) + 1;
      setFamilyMembers([...familyMembers, { id: newId, ...profileForm }]);
      setShowAddProfile(false);
    }
  };

  const cancelEditProfile = () => {
    setEditingProfileId(null);
    setShowAddProfile(false);
  };

  // Confirmation dialog functions
  const showConfirmationDialog = (message, action) => {
    setConfirmDialogMessage(message);
    setConfirmDialogAction(() => action);
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = () => {
    if (confirmDialogAction) {
      confirmDialogAction();
    }
    setShowConfirmDialog(false);
  };

  const handleCancelConfirm = () => {
    setShowConfirmDialog(false);
  };

  const deleteProfile = (id) => {
    showConfirmationDialog(
      'Are you sure you want to remove this family member?',
      () => {
        setFamilyMembers(familyMembers.filter(member => member.id !== id));
        setShowProfileActions(null);
      }
    );
  };

  // Challenge Functions
  const startEditingChallenge = (challengeId) => {
    const challenge = challenges.find(c => c.id === challengeId);
    setEditingChallengeId(challenge.id);
    setChallengeForm({
      title: challenge.title,
      description: challenge.description,
      icon: challenge.icon,
      points: challenge.points
    });
    setShowChallengeActions(null);
  };

  const startAddingChallenge = () => {
    setShowAddChallenge(true);
    setChallengeForm({
      title: '',
      description: '',
      icon: 'Target',
      points: 50
    });
  };

  const saveChallenge = () => {
    if (challengeForm.title.trim() === '') return;
    
    if (editingChallengeId) {
      // Update existing challenge
      setChallenges(challenges.map(challenge => 
        challenge.id === editingChallengeId ? { ...challenge, ...challengeForm } : challenge
      ));
      setEditingChallengeId(null);
    } else if (showAddChallenge) {
      // Add new challenge
      const newId = Math.max(0, ...challenges.map(c => c.id)) + 1;
      setChallenges([...challenges, { id: newId, ...challengeForm }]);
      setShowAddChallenge(false);
    }
  };

  const cancelEditChallenge = () => {
    setEditingChallengeId(null);
    setShowAddChallenge(false);
  };

  const deleteChallenge = (id) => {
    showConfirmationDialog(
      'Are you sure you want to delete this challenge?',
      () => {
        setChallenges(challenges.filter(challenge => challenge.id !== id));
        setShowChallengeActions(null);
      }
    );
  };

  // State for fun challenges
  const startFunChallenge = (challenge) => {
    // Convert fun challenge to format expected by ChallengeImplementation
    const formattedChallenge = {
      id: challenges.length + 1, // Give it a new ID
      title: challenge.title,
      description: challenge.description,
      icon: 'Star', // Default icon
      points: challenge.points
    };
    setActiveFunChallenge(formattedChallenge);
    setActiveChallenge(formattedChallenge);
  };
  
  // Challenge implementation functions
  const startChallenge = (challenge) => {
    setActiveChallenge(challenge);
  };
  
  const completeChallenge = (results) => {
    // Update the score for the relevant family member (first one for now as an example)
    if (results && results.points) {
      const updatedMembers = [...familyMembers];
      // For simplicity, we'll add points to the first family member
      // In a real app, you'd determine which family member completed the challenge
      if (updatedMembers.length > 0) {
        updatedMembers[0].score += results.points;
        updatedMembers[0].achievements += 1;
        setFamilyMembers(updatedMembers);
      }
    }
    
    // Reset active challenge states
    setActiveChallenge(null);
    setActiveFunChallenge(null);
    
    // Reset detail views
    setShowChallengeDetails(null);
    setShowResourceDetails(null);
  };

  // Rule Functions
  const addRule = () => {
    if (newRule.trim() !== '') {
      setFamilyRules([...familyRules, newRule]);
      setNewRule('');
    }
  };

  const removeRule = (index) => {
    const updatedRules = [...familyRules];
    updatedRules.splice(index, 1);
    setFamilyRules(updatedRules);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Challenge details view
  const renderChallengeDetailsView = () => {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-4">
            <button
              onClick={() => setShowChallengeDetails(null)}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold">{showChallengeDetails.title}</h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-blue-100 mr-4">
                {getIconComponent(showChallengeDetails.icon)}
              </div>
              <div>
                <p className="text-gray-600">{showChallengeDetails.description}</p>
                <p className="text-yellow-500 font-bold mt-2">{showChallengeDetails.points} points</p>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <button 
                onClick={() => startChallenge(showChallengeDetails)}
                className="w-full bg-green-500 text-white py-2 rounded-lg font-medium"
              >
                Start Challenge
              </button>
              <button className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium">
                Share with Family
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main Render Logic
  if (activeChallenge) {
    return (
      <ChallengeImplementation 
        challenge={activeChallenge}
        onBack={() => setActiveChallenge(null)}
        onComplete={completeChallenge}
        familyMembers={familyMembers}
      />
    );
  }

  if (showResourceDetails) {
    return (
      <ResourceDetailsWrapper
        showResourceDetails={showResourceDetails}
        setShowResourceDetails={setShowResourceDetails}
        newRule={newRule}
        setNewRule={setNewRule}
        addRule={addRule}
        removeRule={removeRule}
        familyRules={familyRules}
        selectedSound={selectedSound}
        setSelectedSound={setSelectedSound}
        startFunChallenge={startFunChallenge}
      />
    );
  }

  if (showChallengeDetails) {
    return renderChallengeDetailsView();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Render confirmation dialog */}
        <ConfirmDialog 
          show={showConfirmDialog}
          message={confirmDialogMessage}
          onConfirm={handleConfirmAction}
          onCancel={handleCancelConfirm}
        />
        
        {/* Mobile menu */}
        <MobileMenu 
          show={showMobileMenu}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={() => setShowMobileMenu(false)}
        />
        
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Family Mode</h1>
          <button
            onClick={toggleMobileMenu}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile tab pills */}
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4">
          <button
            onClick={() => setActiveTab('profiles')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm ${activeTab === 'profiles' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
          >
            <Users className="h-4 w-4 inline-block mr-1" />
            Profiles
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm ${activeTab === 'challenges' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
          >
            <Trophy className="h-4 w-4 inline-block mr-1" />
            Challenges
          </button>
          <button
            onClick={() => setActiveTab('quicklinks')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm ${activeTab === 'quicklinks' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
          >
            <Star className="h-4 w-4 inline-block mr-1" />
            Resources
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          {activeTab === 'profiles' && (
            <FamilyProfiles
              familyMembers={familyMembers}
              showAddProfile={showAddProfile}
              editingProfileId={editingProfileId}
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              showProfileActions={showProfileActions}
              setShowProfileActions={setShowProfileActions}
              setShowChallengeActions={setShowChallengeActions}
              profileActionRef={profileActionRef}
              startAddingProfile={startAddingProfile}
              saveProfile={saveProfile}
              cancelEditProfile={cancelEditProfile}
              startEditingProfile={startEditingProfile}
              deleteProfile={deleteProfile}
            />
          )}
          
          {activeTab === 'challenges' && (
            <FamilyChallenges
              challenges={challenges}
              showAddChallenge={showAddChallenge}
              editingChallengeId={editingChallengeId}
              challengeForm={challengeForm}
              setChallengeForm={setChallengeForm}
              showChallengeActions={showChallengeActions}
              setShowChallengeActions={setShowChallengeActions}
              setShowProfileActions={setShowProfileActions}
              challengeActionRef={challengeActionRef}
              startAddingChallenge={startAddingChallenge}
              saveChallenge={saveChallenge}
              cancelEditChallenge={cancelEditChallenge}
              startEditingChallenge={startEditingChallenge}
              deleteChallenge={deleteChallenge}
              setShowChallengeDetails={setShowChallengeDetails}
              getIconComponent={getIconComponent}
              availableIcons={availableIcons}
            />
          )}
          
          {activeTab === 'quicklinks' && (
            <QuickLinks
              quickLinks={quickLinksData}
              setShowResourceDetails={setShowResourceDetails}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FamilyMode;