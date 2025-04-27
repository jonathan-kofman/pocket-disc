import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Trophy, Star, Target, Clock, Zap, Smile, Heart, Flag, Award, Sparkles, Gamepad2, Leaf, Activity } from 'lucide-react';

const KidsMode = ({ onBack }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);
  
  // Target states
  const [targets, setTargets] = useState([false, false, false]);
  
  // Treasures and animals state
  const [foundItems, setFoundItems] = useState({});
  
  // Track achievements
  const [achievementsList, setAchievementsList] = useState([
    {
      id: 'first-game',
      name: 'First Game!',
      icon: <Star className="h-5 w-5 text-yellow-500" />,
      description: 'Played your first game',
      unlocked: true
    },
    {
      id: 'target-master',
      name: 'Target Master',
      icon: <Target className="h-5 w-5 text-red-500" />,
      description: 'Hit 10 targets in a row',
      unlocked: false
    },
    {
      id: 'speed-demon',
      name: 'Speed Demon',
      icon: <Zap className="h-5 w-5 text-blue-500" />,
      description: 'Complete a course in under 5 minutes',
      unlocked: false
    },
    {
      id: 'nature-explorer',
      name: 'Nature Explorer',
      icon: <Leaf className="h-5 w-5 text-green-500" />,
      description: 'Spot 5 different animals',
      unlocked: false
    }
  ]);

  const games = [
    {
      id: 'target-challenge',
      name: 'Target Challenge',
      icon: <Target className="h-6 w-6 text-red-500" />,
      description: 'Hit the target 3 times in a row!',
      points: 50,
      color: 'red'
    },
    {
      id: 'speed-challenge',
      name: 'Speed Challenge',
      icon: <Clock className="h-6 w-6 text-blue-500" />,
      description: 'Complete the course as fast as you can!',
      points: 100,
      color: 'blue'
    },
    {
      id: 'treasure-hunt',
      name: 'Treasure Hunt',
      icon: <Flag className="h-6 w-6 text-yellow-500" />,
      description: 'Find hidden treasures around the course!',
      points: 75,
      color: 'yellow'
    },
    {
      id: 'animal-spotting',
      name: 'Animal Spotting',
      icon: <Heart className="h-6 w-6 text-green-500" />,
      description: 'Spot and identify animals you see!',
      points: 25,
      color: 'green'
    }
  ];

  // Game color styles - explicitly defined since template literals won't work with Tailwind
  const gameColors = {
    red: {
      border: 'border-red-500',
      bg: 'bg-red-100',
      text: 'text-red-500'
    },
    blue: {
      border: 'border-blue-500',
      bg: 'bg-blue-100',
      text: 'text-blue-500'
    },
    yellow: {
      border: 'border-yellow-500',
      bg: 'bg-yellow-100',
      text: 'text-yellow-500'
    },
    green: {
      border: 'border-green-500',
      bg: 'bg-green-100',
      text: 'text-green-500'
    }
  };

  // Reset game state when a game is selected
  useEffect(() => {
    if (selectedGame) {
      setStreak(prev => prev + 1);  // Increment streak when starting a game
      setTargets([false, false, false]);
      setTime(0);
      setIsTimerRunning(false);
      setFoundItems({});
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [selectedGame]);

  // Timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10); // Update every 10ms
      }, 10);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  // Confetti effect
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleScoreUpdate = (points) => {
    setScore(prev => prev + points);
    setShowConfetti(true);
  };
  
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };
  
  const handleTargetClick = () => {
    const newTargets = [...targets];
    const nextTargetIndex = newTargets.findIndex(t => !t);
    
    if (nextTargetIndex !== -1) {
      newTargets[nextTargetIndex] = true;
      setTargets(newTargets);
      
      // If all targets hit
      if (nextTargetIndex === 2 || newTargets.every(t => t)) {
        handleScoreUpdate(games[0].points);
        
        // Check if we should unlock the Target Master achievement
        if (streak >= 10) {
          const newAchievements = [...achievementsList];
          const targetMasterIndex = newAchievements.findIndex(a => a.id === 'target-master');
          if (targetMasterIndex !== -1 && !newAchievements[targetMasterIndex].unlocked) {
            newAchievements[targetMasterIndex].unlocked = true;
            setAchievementsList(newAchievements);
          }
        }
        
        setTimeout(() => {
          setTargets([false, false, false]);
        }, 1500);
      }
    }
  };
  
  const handleTimerComplete = () => {
    setIsTimerRunning(false);
    handleScoreUpdate(games[1].points);
    
    // Check for Speed Demon achievement
    if (time < 300000) { // Less than 5 minutes
      const newAchievements = [...achievementsList];
      const speedDemonIndex = newAchievements.findIndex(a => a.id === 'speed-demon');
      if (speedDemonIndex !== -1) {
        newAchievements[speedDemonIndex] = {
          ...newAchievements[speedDemonIndex],
          unlocked: true
        };
        setAchievementsList(newAchievements);
      }
    }
  };
  
  const handleItemFound = (item, gameId, points) => {
    if (!foundItems[item]) {
      setFoundItems(prev => ({...prev, [item]: true}));
      handleScoreUpdate(points);
      
      // Check for Nature Explorer achievement if it's animal spotting
      if (gameId === 'animal-spotting') {
        const animalCount = Object.keys(foundItems).filter(key => key.startsWith('animal-')).length + 1;
        if (animalCount >= 5) {
          const newAchievements = [...achievementsList];
          const natureExplorerIndex = newAchievements.findIndex(a => a.id === 'nature-explorer');
          if (natureExplorerIndex !== -1) {
            newAchievements[natureExplorerIndex] = {
              ...newAchievements[natureExplorerIndex],
              unlocked: true
            };
            setAchievementsList(newAchievements);
          }
        }
      }
    }
  };

  const renderGameSelection = () => (
    <div>
      <div className="flex flex-col mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Choose a Game!</h2>
        <div className="flex space-x-2">
          <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-bold">{score}</span>
          </div>
          <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
            <Trophy className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-sm font-bold">{streak}</span>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {games.map(game => (
          <button
            key={game.id}
            onClick={() => setSelectedGame(game)}
            className={`w-full relative overflow-hidden bg-white rounded-lg p-4 shadow-md transform active:scale-95 transition-all border-l-4 ${gameColors[game.color].border}`}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${gameColors[game.color].bg} mr-3`}>
                {game.icon}
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">{game.name}</h3>
                <p className="text-xs text-gray-600">{game.description}</p>
                <div className="flex items-center mt-1">
                  <Star className="h-3 w-3 text-yellow-500 mr-1" />
                  <span className="text-xs text-yellow-500">{game.points} points</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderGame = (game) => {
    switch (game.id) {
      case 'target-challenge':
        return (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-gray-900">{game.name}</h3>
            <div className="bg-gray-100 p-4 rounded-lg mb-3">
              <p className="text-sm mb-3">Hit the target 3 times in a row!</p>
              <div className="flex justify-center space-x-3">
                {targets.map((hit, i) => (
                  <div key={i} className="relative">
                    <div className={`w-14 h-14 ${hit ? 'bg-red-500' : 'bg-white'} rounded-full flex items-center justify-center shadow-md transform transition-transform duration-300 ${hit ? 'scale-110' : ''}`}>
                      {hit ? '🎯' : '○'}
                    </div>
                    {hit && (
                      <div className="absolute -top-1 -right-1">
                        <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleTargetClick}
              className={`px-6 py-3 ${targets.every(t => t) ? 'bg-green-500' : 'bg-red-500'} text-white rounded-lg active:scale-95 transition-all shadow-md w-full`}
            >
              {targets.every(t => t) ? 'All Targets Hit!' : 'Hit Target!'}
            </button>
          </div>
        );

      case 'speed-challenge':
        return (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-gray-900">{game.name}</h3>
            <div className="bg-gray-100 p-4 rounded-lg mb-3">
              <p className="text-sm mb-3">Complete the course as fast as you can!</p>
              <div className={`text-4xl font-bold my-3 ${isTimerRunning ? 'text-blue-500' : 'text-gray-700'} ${isTimerRunning ? 'animate-pulse' : ''}`}>
                {formatTime(time)}
              </div>
            </div>
            {isTimerRunning ? (
              <button
                onClick={handleTimerComplete}
                className="px-6 py-3 bg-green-500 text-white rounded-lg active:scale-95 transition-all shadow-md w-full"
              >
                Finish Course!
              </button>
            ) : (
              <button
                onClick={() => setIsTimerRunning(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg active:scale-95 transition-all shadow-md w-full"
              >
                Start Timer!
              </button>
            )}
          </div>
        );

      case 'treasure-hunt':
        return (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-gray-900">{game.name}</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {[
                {icon: '🌳', id: 'treasure-tree'}, 
                {icon: '🏞️', id: 'treasure-landscape'}, 
                {icon: '🌊', id: 'treasure-water'}, 
                {icon: '🪨', id: 'treasure-rock'}, 
                {icon: '🌺', id: 'treasure-flower'}, 
                {icon: '🦋', id: 'treasure-butterfly'}
              ].map((treasure) => (
                <div
                  key={treasure.id}
                  className={`bg-white p-4 rounded-lg shadow-md active:scale-95 transition-all cursor-pointer ${foundItems[treasure.id] ? 'border-2 border-yellow-400 bg-yellow-50' : ''}`}
                  onClick={() => handleItemFound(treasure.id, game.id, 15)}
                >
                  <span className="text-3xl block">{treasure.icon}</span>
                  {foundItems[treasure.id] && <p className="text-xs mt-1 text-green-500">Found!</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'animal-spotting':
        return (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-gray-900">{game.name}</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {[
                {icon: '🦊', id: 'animal-fox'}, 
                {icon: '🐦', id: 'animal-bird'}, 
                {icon: '🦋', id: 'animal-butterfly'}, 
                {icon: '🐿️', id: 'animal-squirrel'}, 
                {icon: '🦆', id: 'animal-duck'}, 
                {icon: '🐇', id: 'animal-rabbit'}
              ].map((animal) => (
                <div
                  key={animal.id}
                  className={`bg-white p-3 rounded-lg shadow-md active:scale-95 transition-all cursor-pointer ${foundItems[animal.id] ? 'border-2 border-green-400 bg-green-50' : ''}`}
                  onClick={() => handleItemFound(animal.id, game.id, 5)}
                >
                  <span className="text-3xl block">{animal.icon}</span>
                  <p className="text-xs mt-1">
                    {foundItems[animal.id] ? (
                      <span className="text-green-500">Spotted!</span>
                    ) : (
                      "Tap when spotted!"
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderAchievements = () => (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-3">Your Achievements</h3>
      <div className="grid grid-cols-2 gap-3">
        {achievementsList.map(achievement => (
          <div
            key={achievement.id}
            className={`p-3 rounded-lg ${
              achievement.unlocked ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
            } active:scale-95 transition-all`}
          >
            <div className="flex items-center mb-1">
              {achievement.icon}
              <span className="text-sm font-semibold ml-1">{achievement.name}</span>
            </div>
            <p className="text-xs text-gray-600">{achievement.description}</p>
            {achievement.unlocked && (
              <div className="mt-1 text-green-500 flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                <span className="text-xs">Unlocked!</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="ml-1">Back</span>
          </button>

          {!selectedGame && (
            <div className="flex items-center space-x-1">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-bold text-gray-900">{score}</span>
            </div>
          )}
        </div>

        <div className="bg-white backdrop-blur-sm rounded-lg shadow-md p-4 mb-4">
          {selectedGame ? (
            <div>
              <button
                onClick={() => setSelectedGame(null)}
                className="mb-3 text-blue-500 text-sm flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Games
              </button>
              {renderGame(selectedGame)}
            </div>
          ) : (
            renderGameSelection()
          )}
        </div>

        {!selectedGame && (
          <div className="bg-white backdrop-blur-sm rounded-lg shadow-md p-4">
            {renderAchievements()}
          </div>
        )}

        {showConfetti && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="animate-bounce">
              <Sparkles className="h-12 w-12 text-yellow-500" />
            </div>
            <div className="absolute top-1/4 left-1/4 animate-ping delay-75">
              <Star className="h-6 w-6 text-pink-500" />
            </div>
            <div className="absolute top-1/3 right-1/3 animate-ping delay-150">
              <Star className="h-6 w-6 text-blue-500" />
            </div>
            <div className="absolute bottom-1/3 left-1/3 animate-ping delay-300">
              <Star className="h-6 w-6 text-green-500" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KidsMode;