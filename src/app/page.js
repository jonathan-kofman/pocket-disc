"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import { Flag, BarChart2, Target, Disc, Trophy, Users, Home, Smile, User, Lock, X } from 'lucide-react';

// Import your components (you'll need to create these files in your Next.js project)
import CourseList from '../components/CourseList';
import RoundTracker from '../components/RoundTracker';
import PracticeMode from '../components/PracticeMode.js';
import Statistics from '../components/Statistics.js';
import ShareRound from '../components/ShareRound';
import Achievements from '../components/Achievements';
import FamilyMode from '../components/family/FamilyMode';
import BackyardDesigner from '../components/BackyardDesigner';
import KidsMode from '../components/KidsMode';
import FrisbeeTracker from '../components/FrisbeeTracker';
import ThreeDScene from '../components/ThreeDScene';
import LoginModal from '../components/LoginModal';

// Import your hooks (you'll need to create these files in your Next.js project)
import useCourses from '../hooks/useCourses';
import useRounds from '../hooks/useRounds';
import usePracticeStats from '../hooks/usePracticeStats';

export default function Logo() {
  const { courses = [], addCourse, coursesLoading, coursesError, clearCoursesError } = useCourses();
  const [showFrisbeeTracker, setShowFrisbeeTracker] = useState(false);
  const { completedRounds = [], addRound } = useRounds();
  const { practiceStats = {
    targetChallenge: { bestAccuracy: 0, gamesPlayed: 0, lastScore: 0 },
    speedChallenge: { bestTime: null, gamesPlayed: 0, lastTime: null },
    consistencyChallenge: { bestStreak: 0, totalThrows: 0, gamesPlayed: 0 },
    achievements: []
  }, updateStats } = usePracticeStats();
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentRound, setCurrentRound] = useState(null);
  const [showNewCourseForm, setShowNewCourseForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [shareMode, setShareMode] = useState(false);
  const [selectedRoundForShare, setSelectedRoundForShare] = useState(null);
  const [showPracticeMode, setShowPracticeMode] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showFamilyMode, setShowFamilyMode] = useState(false);
  const [showBackyardDesigner, setShowBackyardDesigner] = useState(false);
  const [showKidsMode, setShowKidsMode] = useState(false);

  // Add state for login modal and user
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);

  // Add state for confirmation dialogs
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  // Check if user is already logged in on initial render
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Show login modal if no user is found
        setShowLoginModal(true);
      }
      
      const savedRounds = localStorage.getItem('completedRounds');
      const savedCourses = localStorage.getItem('courses');
      const savedPracticeStats = localStorage.getItem('practiceStats');
      
      if (savedRounds) {
        const parsedRounds = JSON.parse(savedRounds);
        if (Array.isArray(parsedRounds)) {
          parsedRounds.forEach(round => addRound(round));
        }
      }
      
      if (savedCourses) {
        const parsedCourses = JSON.parse(savedCourses);
        if (Array.isArray(parsedCourses)) {
          parsedCourses.forEach(course => addCourse(course));
        }
      }
      
      if (savedPracticeStats) {
        const parsedStats = JSON.parse(savedPracticeStats);
        if (parsedStats && typeof parsedStats === 'object') {
          updateStats(parsedStats);
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
      setShowLoginModal(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('completedRounds', JSON.stringify(completedRounds));
    }
  }, [completedRounds]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('courses', JSON.stringify(courses));
    }
  }, [courses]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('practiceStats', JSON.stringify(practiceStats));
    }
  }, [practiceStats]);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  // Handle user login
  const handleLogin = (userData) => {
    setUser(userData);
    setShowLoginModal(false);
  };

  // Handle user logout
  const handleLogout = () => {
    handleConfirmDialogOpen('Are you sure you want to log out?', () => {
      localStorage.removeItem('user');
      setUser(null);
      setShowLoginModal(true);
    });
  };

  // Confirmation dialog handlers
  const handleConfirmDialogOpen = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirmDialog(true);
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirmDialog(false);
  };

  const startRound = (course) => {
    setSelectedCourse(course);
    setCurrentRound({
      courseId: course.id,
      courseName: course.name,
      date: new Date().toISOString(),
      scores: course.holes.map(hole => ({
        holeId: hole.id,
        distance: hole.distance,
        par: hole.par,
        throws: 0
      }))
    });
  };

  const updateScore = (holeIndex, change) => {
    if (!currentRound) return;
    
    const newScores = [...currentRound.scores];
    const newThrows = Math.max(0, newScores[holeIndex].throws + change);
    newScores[holeIndex] = { ...newScores[holeIndex], throws: newThrows };
    
    setCurrentRound({
      ...currentRound,
      scores: newScores
    });
  };

  const finishRound = () => {
    if (!currentRound) return;
    
    // Check if all holes have scores
    const allHolesScored = currentRound.scores.every(score => score.throws > 0);
    
    if (!allHolesScored) {
      alert('Please enter scores for all holes before finishing the round.');
      return;
    }
    
    addRound({ ...currentRound, scores: currentRound.scores });
    setCurrentRound(null);
    setSelectedCourse(null);
  };

  const cancelRound = () => {
    handleConfirmDialogOpen('Are you sure you want to cancel this round? All scores will be lost.', () => {
      setCurrentRound(null);
      setSelectedCourse(null);
    });
  };
  
  const goBack = (source) => {
    if (currentRound) {
      handleConfirmDialogOpen('Are you sure you want to go back? Your current round will be lost.', () => {
        setCurrentRound(null);
        setSelectedCourse(null);
      });
    } else if (showNewCourseForm) {
      setShowNewCourseForm(false);
    } else if (showStats) {
      setShowStats(false);
    } else if (shareMode) {
      setShareMode(false);
      setSelectedRoundForShare(null);
    } else if (showPracticeMode) {
      setShowPracticeMode(false);
    } else if (showAchievements) {
      setShowAchievements(false);
    } else if (showFamilyMode) {
      setShowFamilyMode(false);
    } else if (showBackyardDesigner) {
      setShowBackyardDesigner(false);
    } else if (showKidsMode) {
      setShowKidsMode(false);
    } else if (showFrisbeeTracker) {
      setShowFrisbeeTracker(false);
    }
  };

  const calculateStats = () => {
    if (completedRounds.length === 0) return null;
    
    let totalHoles = 0;
    let totalThrows = 0;
    let totalPar = 0;
    let birdies = 0;
    let eagles = 0;
    let albatrosses = 0;
    let pars = 0;
    let bogeys = 0;
    let doubleBogeys = 0;
    let tripleBogeyPlus = 0;
    let bestRound = null;
    let averageRoundScore = 0;
    
    const courseStats = {};
    
    completedRounds.forEach(round => {
      let roundTotalThrows = 0;
      let roundTotalPar = 0;
      
      round.scores.forEach(score => {
        totalHoles++;
        totalThrows += score.throws;
        totalPar += score.par;
        roundTotalThrows += score.throws;
        roundTotalPar += score.par;
        
        const diff = score.throws - score.par;
        if (diff <= -3) albatrosses++;
        else if (diff === -2) eagles++;
        else if (diff === -1) birdies++;
        else if (diff === 0) pars++;
        else if (diff === 1) bogeys++;
        else if (diff === 2) doubleBogeys++;
        else if (diff > 2) tripleBogeyPlus++;
      });
      
      if (!courseStats[round.courseId]) {
        courseStats[round.courseId] = {
          name: round.courseName,
          roundCount: 0,
          totalThrows: 0,
          totalPar: 0,
          bestScore: null
        };
      }
      
      courseStats[round.courseId].roundCount++;
      courseStats[round.courseId].totalThrows += roundTotalThrows;
      courseStats[round.courseId].totalPar += roundTotalPar;
      
      const roundScore = roundTotalThrows - roundTotalPar;
      if (courseStats[round.courseId].bestScore === null || roundScore < courseStats[round.courseId].bestScore) {
        courseStats[round.courseId].bestScore = roundScore;
      }
      
      if (bestRound === null || roundScore < bestRound.score) {
        bestRound = {
          courseId: round.courseId,
          courseName: round.courseName,
          date: round.date,
          score: roundScore,
          throws: roundTotalThrows
        };
      }
    });
    
    const averageThrowsPerHole = totalHoles > 0 ? (totalThrows / totalHoles).toFixed(2) : 0;
    averageRoundScore = completedRounds.length > 0 ? ((totalThrows - totalPar) / completedRounds.length).toFixed(2) : 0;
    
    const formattedCourseStats = Object.keys(courseStats).map(courseId => {
      const stat = courseStats[courseId];
      return {
        id: courseId,
        name: stat.name,
        roundCount: stat.roundCount,
        averageScore: stat.roundCount > 0 ? ((stat.totalThrows - stat.totalPar) / stat.roundCount).toFixed(2) : 0,
        bestScore: stat.bestScore === 0 ? 'E' : (stat.bestScore > 0 ? `+${stat.bestScore}` : stat.bestScore)
      };
    });
    
    return {
      totalRounds: completedRounds.length,
      totalHoles,
      totalThrows,
      averageThrowsPerHole,
      averageRoundScore: averageRoundScore === '0.00' ? 'E' : (averageRoundScore > 0 ? `+${averageRoundScore}` : averageRoundScore),
      scoreCounts: {
        albatrosses,
        eagles,
        birdies,
        pars,
        bogeys,
        doubleBogeys,
        tripleBogeyPlus
      },
      bestRound: bestRound ? {
        ...bestRound,
        score: bestRound.score === 0 ? 'E' : (bestRound.score > 0 ? `+${bestRound.score}` : bestRound.score),
        date: new Date(bestRound.date).toLocaleDateString()
      } : null,
      courseStats: formattedCourseStats
    };
  };

  const renderMainMenu = () => (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-blue-50 to-purple-50 p-4 overflow-hidden">
      <div className="max-w-md mx-auto">
        {/* User Profile Section */}
        {user && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md mb-6 relative">
            <div className="flex items-center">
              <div className="flex items-center justify-center p-2 rounded-full bg-green-100 mr-3">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user.username}</p>
                <p className="text-xs text-gray-600">Disc Golf Enthusiast</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* 3D Background Scene */}
        <div className="absolute inset-0 -z-10 opacity-20">
          <ThreeDScene sceneUrl="https://prod.spline.design/your-main-menu-scene" />
        </div>

        {/* Hero Section with Animated Background */}
        <div className="relative overflow-hidden rounded-xl mb-6 bg-white/60 backdrop-blur-sm shadow-md">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjEgMS43OSA0IDQgNHM0LTEuNzkgNC00LTEuNzktNC00LTQtNCAxLjc5LTQgNHoiIGZpbGw9IiNlOGY1ZjAiLz48L2c+PC9zdmc+')] opacity-10 animate-pulse"></div>
          <div className="relative p-6 text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/40 backdrop-blur-sm mb-3">
              <Disc className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              <span className="block">Pocket</span>
              <span className="block">Disc</span>
            </h1>
            <p className="text-base text-gray-600 max-w-xs mx-auto">
              Fun, mini disc golf adventures for the whole family - backyard to park!
            </p>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-center p-2 rounded-full bg-green-100 mb-2 mx-auto w-12 h-12">
              <Flag className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center">{courses.length}</h3>
            <p className="text-xs text-gray-600 text-center">Courses</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-center p-2 rounded-full bg-blue-100 mb-2 mx-auto w-12 h-12">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center">{completedRounds.length}</h3>
            <p className="text-xs text-gray-600 text-center">Rounds Played</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-center p-2 rounded-full bg-purple-100 mb-2 mx-auto w-12 h-12">
              <Trophy className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center">{practiceStats.achievements.length}</h3>
            <p className="text-xs text-gray-600 text-center">Achievements</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-center p-2 rounded-full bg-yellow-100 mb-2 mx-auto w-12 h-12">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center">4</h3>
            <p className="text-xs text-gray-600 text-center">Family Members</p>
          </div>
        </div>

        {/* Main Menu Grid */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowPracticeMode(true)}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md focus:outline-none"
          >
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-green-100 mb-2">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Practice</span>
            </div>
          </button>

          <button
            onClick={() => setShowFamilyMode(true)}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md focus:outline-none"
          >
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-purple-100 mb-2">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Family</span>
            </div>
          </button>

          <button
            onClick={() => setShowKidsMode(true)}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md focus:outline-none"
          >
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-yellow-100 mb-2">
                <Smile className="h-6 w-6 text-yellow-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Kids</span>
            </div>
          </button>

          <button
            onClick={() => setShowBackyardDesigner(true)}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md focus:outline-none"
          >
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-red-100 mb-2">
                <Home className="h-6 w-6 text-red-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Designer</span>
            </div>
          </button>

          <button
            onClick={() => setShowStats(true)}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md focus:outline-none"
          >
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-indigo-100 mb-2">
                <BarChart2 className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Stats</span>
            </div>
          </button>

          <button
            onClick={() => setShowFrisbeeTracker(true)}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md focus:outline-none"
          >
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-teal-100 mb-2">
                <Disc className="h-6 w-6 text-teal-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Tracker</span>
            </div>
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-lg max-w-sm w-full mx-4 p-6 shadow-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Action</h3>
            <p className="text-gray-600 mb-6">{confirmMessage}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Main conditional rendering
  if (showLoginModal) {
    return <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />;
  }

  if (showFrisbeeTracker) {
    return <FrisbeeTracker onBack={() => goBack('frisbeeTracker')} />;
  }

  if (showPracticeMode) {
    return <PracticeMode onBack={() => goBack('practice')} />;
  }

  if (showAchievements) {
    return <Achievements onBack={() => goBack('achievements')} />;
  }

  if (showStats) {
    return <Statistics onBack={() => goBack('stats')} />;
  }

  if (shareMode) {
    return (
      <ShareRound
        selectedRound={selectedRoundForShare}
        onBack={() => goBack('share')}
      />
    );
  }

  if (currentRound) {
    return (
      <RoundTracker
        round={currentRound}
        onBack={() => goBack('round')}
      />
    );
  }

  if (showNewCourseForm) {
    return (
      <CourseList
        onAddCourse={addCourse}
        onBack={() => goBack('newCourse')}
        isLoading={coursesLoading}
        error={coursesError}
        onClearError={clearCoursesError}
      />
    );
  }

  if (showFamilyMode) {
    return <FamilyMode onBack={() => goBack('family')} />;
  }

  if (showBackyardDesigner) {
    return <BackyardDesigner onBack={() => goBack('designer')} />;
  }

  if (showKidsMode) {
    return <KidsMode onBack={() => goBack('kids')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        {renderMainMenu()}
      </div>
    </div>
  );
}