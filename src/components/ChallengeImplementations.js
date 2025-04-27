import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Trophy, Star, Target, Camera, Disc, Award, Smile, Heart, Flag, Map, Zap, X, Check, ArrowLeft, ArrowRight, Clock, Users, RotateCw, Save, Smartphone } from 'lucide-react';

// Implementation for the "Around the World" challenge
export const AroundTheWorldChallenge = ({ onBack, onComplete }) => {
  const [currentStation, setCurrentStation] = useState(0);
  const [completedStations, setCompletedStations] = useState([false, false, false, false, false]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const timerRef = useRef(null);

  const stations = [
    { name: "Backyard Corner", description: "Stand in the far corner of your backyard" },
    { name: "Near the Tree", description: "Position yourself next to the largest tree" },
    { name: "Behind the Shed", description: "Go to the area behind the garden shed" },
    { name: "Patio Spot", description: "Throw from the edge of the patio" },
    { name: "Final Position", description: "Return to your starting position for the final throw" }
  ];

  useEffect(() => {
    if (isTimerActive) {
      timerRef.current = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerActive]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const markStationComplete = () => {
    const newCompletedStations = [...completedStations];
    newCompletedStations[currentStation] = true;
    setCompletedStations(newCompletedStations);
    
    // Check if all stations are completed
    if (currentStation === stations.length - 1 || newCompletedStations.every(station => station)) {
      setIsTimerActive(false);
      setShowSuccess(true);
      // Allow time for animation before completing
      setTimeout(() => {
        onComplete && onComplete({
          challengeName: "Around the World",
          time: timer,
          stationsCompleted: 5,
          points: 50
        });
      }, 2000);
    } else {
      // Move to next station
      setCurrentStation(prevStation => prevStation + 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <h2 className="text-xl font-bold text-center">Around the World</h2>
        <div className="px-6"></div>
      </div>

      {/* Timer */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">Time</p>
          <p className="text-xl font-bold">{formatTime(timer)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-xl font-bold text-green-600">{completedStations.filter(Boolean).length}/5</p>
        </div>
      </div>

      {/* Current Station */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Station {currentStation + 1}</h3>
          <div className="flex space-x-1">
            {completedStations.map((completed, idx) => (
              <div 
                key={idx} 
                className={`w-2 h-2 rounded-full ${idx === currentStation ? 'bg-blue-500' : completed ? 'bg-green-500' : 'bg-gray-300'}`}
              ></div>
            ))}
          </div>
        </div>
        <h3 className="text-lg font-bold mb-1">{stations[currentStation].name}</h3>
        <p className="text-gray-600 mb-3">{stations[currentStation].description}</p>
        <div className="h-40 bg-blue-100 rounded-lg mb-3 flex items-center justify-center">
          <Map className="h-12 w-12 text-blue-500 opacity-50" />
        </div>
        <button
          onClick={markStationComplete}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-medium flex items-center justify-center"
        >
          <Check className="h-5 w-5 mr-2" />
          Mark Complete
        </button>
      </div>

      {/* Progress */}
      <div className="grid grid-cols-5 gap-1 mb-4">
        {stations.map((station, idx) => (
          <div 
            key={idx}
            className={`text-center p-2 rounded ${
              completedStations[idx] 
                ? 'bg-green-100 text-green-700'
                : idx === currentStation
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-500'
            }`}
          >
            <p className="text-xs">{idx + 1}</p>
          </div>
        ))}
      </div>

      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Challenge Complete!</h3>
            <p className="text-gray-600 mb-4">
              You&apos;ve completed all 5 stations in {formatTime(timer)}!
            </p>
            <p className="font-bold text-yellow-500 text-lg mb-4">+50 Points</p>
            <button
              onClick={() => onComplete && onComplete({
                challengeName: "Around the World",
                time: timer,
                stationsCompleted: 5,
                points: 50
              })}
              className="w-full bg-blue-500 text-white py-2 rounded-lg"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Implementation for the "Trick Shot Master" challenge
export const TrickShotChallenge = ({ onBack, onComplete }) => {
  const [currentStep, setCurrentStep] = useState('instructions');
  const [selectedShot, setSelectedShot] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedClip, setRecordedClip] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const timerRef = useRef(null);
  
  const trickShots = [
    { 
      id: 'through-legs', 
      name: 'Between the Legs',
      difficulty: 'Easy',
      points: 15,
      description: 'Throw the disc between your legs and hit the target.'
    },
    { 
      id: 'behind-back', 
      name: 'Behind the Back',
      difficulty: 'Medium',
      points: 25,
      description: 'Throw from behind your back without looking at the target.'
    },
    { 
      id: 'over-shoulder', 
      name: 'Over the Shoulder',
      difficulty: 'Medium',
      points: 25,
      description: 'Toss the disc over your shoulder without looking.'
    },
    { 
      id: 'spin-throw', 
      name: 'Spin and Throw',
      difficulty: 'Hard',
      points: 40,
      description: 'Spin around 360° and throw while still spinning.'
    },
    { 
      id: 'bounce-shot', 
      name: 'Bounce Shot',
      difficulty: 'Hard',
      points: 35,
      description: 'Make the disc bounce off the ground and into the basket.'
    }
  ];
  
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 30) { // 30 second max recording
            clearInterval(timerRef.current);
            stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);
  
  const selectTrickShot = (trick) => {
    setSelectedShot(trick);
    setCurrentStep('prepare');
  };
  
  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setCurrentStep('recording');
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    // Simulate recording a clip
    setRecordedClip({
      id: selectedShot.id,
      duration: recordingTime,
      timestamp: new Date().toISOString()
    });
    setCurrentStep('review');
  };
  
  const saveAndComplete = () => {
    setShowSuccess(true);
    // Allow time for animation before completing
    setTimeout(() => {
      onComplete && onComplete({
        challengeName: "Trick Shot Master",
        trickName: selectedShot.name,
        points: selectedShot.points,
        clipDuration: recordingTime,
      });
    }, 2000);
  };
  
  const formatTime = (seconds) => {
    return `${seconds.toString().padStart(2, '0')}`;
  };
  
  const renderContent = () => {
    switch (currentStep) {
      case 'instructions':
        return (
          <div>
            <h3 className="text-lg font-bold mb-3">Choose Your Trick Shot</h3>
            <p className="text-gray-600 mb-4">
              Select a trick shot to record. Harder tricks are worth more points!
            </p>
            
            <div className="space-y-3 mb-4">
              {trickShots.map(trick => (
                <button
                  key={trick.id}
                  onClick={() => selectTrickShot(trick)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h4 className="font-semibold">{trick.name}</h4>
                    <p className="text-xs text-gray-500">{trick.description}</p>
                  </div>
                  <div className="flex items-center text-yellow-500 font-bold">
                    <Star className="h-4 w-4 mr-1" />
                    {trick.points}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      
      case 'prepare':
        return (
          <div>
            <div className="flex items-center mb-2">
              <button
                onClick={() => setCurrentStep('instructions')}
                className="text-blue-500 flex items-center mr-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </button>
              <h3 className="text-lg font-bold">{selectedShot.name}</h3>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Difficulty</p>
                  <p className={`font-bold ${
                    selectedShot.difficulty === 'Easy' ? 'text-green-600' :
                    selectedShot.difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {selectedShot.difficulty}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Points</p>
                  <p className="font-bold text-yellow-600">{selectedShot.points}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold mb-2">Instructions</h4>
              <p className="text-gray-600 mb-3">
                {selectedShot.description}
              </p>
              
              <div className="h-40 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                <Disc className="h-12 w-12 text-blue-500 opacity-50" />
              </div>
              
              <h4 className="font-semibold mb-2">Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li>• Find a clear space with no obstacles</li>
                <li>• Practice the motion a few times before recording</li>
                <li>• Have a friend hold the camera if possible</li>
                <li>• Make sure the target is visible in the video</li>
              </ul>
            </div>
            
            <button
              onClick={startRecording}
              className="w-full bg-red-500 text-white py-3 rounded-lg font-medium flex items-center justify-center"
            >
              <Camera className="h-5 w-5 mr-2" />
              Start Recording
            </button>
          </div>
        );
      
      case 'recording':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-red-500">Recording</h3>
              <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full flex items-center">
                <div className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></div>
                {formatTime(recordingTime)}s
              </div>
            </div>
            
            <div className="bg-black rounded-lg mb-4 relative overflow-hidden">
              <div className="aspect-video flex items-center justify-center">
                <Camera className="h-16 w-16 text-white opacity-20" />
              </div>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="px-3 py-1 bg-black bg-opacity-70 rounded-full text-white text-sm flex items-center">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></div>
                  REC {formatTime(recordingTime)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center mb-4">
              <p className="text-gray-600 text-sm">
                Recording &quot;{selectedShot.name} trick shot
              </p>
            </div>
            
            <button
              onClick={stopRecording}
              className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium flex items-center justify-center"
            >
              <X className="h-5 w-5 mr-2" />
              Stop Recording
            </button>
            
            <div className="text-center mt-3">
              <p className="text-xs text-gray-500">
                Max recording time: 30 seconds
              </p>
            </div>
          </div>
        );
      
      case 'review':
        return (
          <div>
            <div className="flex items-center mb-3">
              <button
                onClick={() => setCurrentStep('prepare')}
                className="text-blue-500 flex items-center mr-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </button>
              <h3 className="text-lg font-bold">Review & Submit</h3>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <h4 className="font-semibold mb-2">{selectedShot.name}</h4>
              <div className="bg-black rounded-lg mb-3 overflow-hidden">
                <div className="aspect-video flex items-center justify-center relative">
                  <Disc className="h-16 w-16 text-white opacity-20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-60 rounded-full p-3">
                      <RotateCw className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <p>Duration: {recordingTime} seconds</p>
                <p>Shot: {selectedShot.difficulty}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Did you make the shot?</h4>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  className="py-3 bg-green-100 text-green-700 rounded-lg font-medium flex items-center justify-center"
                  onClick={saveAndComplete}
                >
                  <Check className="h-5 w-5 mr-2" />
                  Yes
                </button>
                <button 
                  className="py-3 bg-red-100 text-red-700 rounded-lg font-medium flex items-center justify-center"
                  onClick={() => setCurrentStep('prepare')}
                >
                  <X className="h-5 w-5 mr-2" />
                  No
                </button>
              </div>
            </div>
            
            <button
              onClick={saveAndComplete}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium flex items-center justify-center"
            >
              <Save className="h-5 w-5 mr-2" />
              Save & Submit
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <h2 className="text-xl font-bold text-center">Trick Shot Master</h2>
        <div className="px-6"></div>
      </div>
      
      {renderContent()}
      
      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Awesome Shot!</h3>
            <p className="text-gray-600 mb-4">
              Your {selectedShot.name} trick shot has been saved!
            </p>
            <p className="font-bold text-yellow-500 text-lg mb-4">+{selectedShot.points} Points</p>
            <button
              onClick={() => onComplete && onComplete({
                challengeName: "Trick Shot Master",
                trickName: selectedShot.name,
                points: selectedShot.points,
                clipDuration: recordingTime,
              })}
              className="w-full bg-blue-500 text-white py-2 rounded-lg"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Implementation for the "Family Tournament" challenge
export const FamilyTournamentChallenge = ({ onBack, onComplete, familyMembers }) => {
  const [currentStep, setCurrentStep] = useState('setup');
  const [tournamentName, setTournamentName] = useState('Family Mini Disc Tournament');
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [winner, setWinner] = useState(null);
  
  // Use the provided familyMembers or fallback to defaults
  const availablePlayers = familyMembers || [
    { id: 1, name: 'Mom', avatar: '👩' },
    { id: 2, name: 'Dad', avatar: '👨' },
    { id: 3, name: 'Emma', avatar: '👧' },
    { id: 4, name: 'Liam', avatar: '👦' }
  ];
  
  const togglePlayerSelection = (player) => {
    if (selectedPlayers.find(p => p.id === player.id)) {
      setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id));
    } else {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };
  
  const generateTournament = () => {
    if (selectedPlayers.length < 2) {
      alert('Please select at least 2 players for the tournament.');
      return;
    }
    
    // Shuffle players
    const shuffledPlayers = [...selectedPlayers].sort(() => Math.random() - 0.5);
    
    // Generate rounds
    let tournamentRounds = [];
    let currentPlayers = shuffledPlayers;
    
    while (currentPlayers.length > 1) {
      const roundMatches = [];
      const advancing = [];
      
      // Create matches
      for (let i = 0; i < currentPlayers.length; i += 2) {
        if (i + 1 < currentPlayers.length) {
          roundMatches.push({
            player1: currentPlayers[i],
            player2: currentPlayers[i + 1],
            winner: null,
            scores: {
              player1: 0,
              player2: 0
            }
          });
        } else {
          // Odd number of players, this player gets a bye
          advancing.push(currentPlayers[i]);
        }
      }
      
      tournamentRounds.push({
        matches: roundMatches,
        completed: false
      });
      
      // Set up next round with winners + byes
      currentPlayers = advancing;
    }
    
    setRounds(tournamentRounds);
    setCurrentRound(0);
    setCurrentMatch(0);
    setCurrentStep('tournament');
  };
  
  const updateMatchScore = (player, change) => {
    const updatedRounds = [...rounds];
    const match = updatedRounds[currentRound].matches[currentMatch];
    
    if (player === 'player1') {
      match.scores.player1 = Math.max(0, match.scores.player1 + change);
    } else {
      match.scores.player2 = Math.max(0, match.scores.player2 + change);
    }
    
    setRounds(updatedRounds);
  };
  
  const completeMatch = (winnerId) => {
    const updatedRounds = [...rounds];
    const match = updatedRounds[currentRound].matches[currentMatch];
    const winningPlayer = winnerId === match.player1.id ? match.player1 : match.player2;
    match.winner = winningPlayer;
    
    // Check if this round is complete
    const isRoundComplete = updatedRounds[currentRound].matches.every(m => m.winner);
    
    if (isRoundComplete) {
      updatedRounds[currentRound].completed = true;
      
      // If this is the final round, we have an overall winner
      if (currentRound === updatedRounds.length - 1) {
        setWinner(winningPlayer);
        setShowSuccess(true);
      } else {
        // Set up next round
        const winners = updatedRounds[currentRound].matches.map(m => m.winner);
        
        // If next round exists, add these winners to it
        if (currentRound + 1 < updatedRounds.length) {
          const nextRound = updatedRounds[currentRound + 1];
          let matchIndex = 0;
          
          for (let i = 0; i < winners.length; i += 2) {
            if (i + 1 < winners.length) {
              if (matchIndex < nextRound.matches.length) {
                nextRound.matches[matchIndex].player1 = winners[i];
                nextRound.matches[matchIndex].player2 = winners[i + 1];
                matchIndex++;
              }
            }
          }
        }
      }
    }
    
    setRounds(updatedRounds);
    
    // Move to next match or round
    if (currentMatch < updatedRounds[currentRound].matches.length - 1) {
      setCurrentMatch(currentMatch + 1);
    } else if (!isRoundComplete) {
      // Stay on the current round if it's not complete
    } else if (currentRound < updatedRounds.length - 1) {
      setCurrentRound(currentRound + 1);
      setCurrentMatch(0);
    }
  };
  
  const renderSetupPhase = () => (
    <div>
      <h3 className="text-lg font-bold mb-3">Family Tournament Setup</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tournament Name
        </label>
        <input
          type="text"
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="Family Disc Golf Tournament"
        />
      </div>
      
      <h4 className="font-semibold mb-2">Select Players</h4>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {availablePlayers.map(player => (
          <button
            key={player.id}
            onClick={() => togglePlayerSelection(player)}
            className={`p-3 border rounded-lg flex items-center ${
              selectedPlayers.find(p => p.id === player.id)
                ? 'bg-blue-50 border-blue-300'
                : 'border-gray-200'
            }`}
          >
            <div className="text-3xl mr-3">{player.avatar}</div>
            <div className="text-left">
              <p className="font-medium">{player.name}</p>
            </div>
          </button>
        ))}
      </div>
      
      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <h4 className="font-semibold mb-2">Tournament Format</h4>
        <p className="text-sm text-gray-600">
          Players will compete in a bracket tournament. Winners advance to the next round until a champion is crowned!
        </p>
        <div className="mt-2 flex items-center text-blue-600">
          <Users className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">
            {selectedPlayers.length} players selected
          </span>
        </div>
      </div>
      
      <button
        onClick={generateTournament}
        disabled={selectedPlayers.length < 2}
        className={`w-full py-3 rounded-lg font-medium flex items-center justify-center ${
          selectedPlayers.length < 2
            ? 'bg-gray-200 text-gray-500'
            : 'bg-blue-500 text-white'
        }`}
      >
        <Trophy className="h-5 w-5 mr-2" />
        Start Tournament
      </button>
    </div>
  );
  
  const renderTournamentPhase = () => {
    if (rounds.length === 0) return null;
    
    const currentRoundData = rounds[currentRound];
    const currentMatchData = currentRoundData.matches[currentMatch];
    
    return (
      <div>
        <h3 className="text-lg font-bold mb-3">{tournamentName}</h3>
        
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Round</p>
              <p className="font-bold">{currentRound + 1} of {rounds.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Match</p>
              <p className="font-bold">{currentMatch + 1} of {currentRoundData.matches.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-3 text-center">Current Match</h4>
          
          <div className="flex items-center justify-between mb-6">
            <div className="text-center flex-1">
              <div className="text-5xl mb-2">{currentMatchData.player1.avatar}</div>
              <p className="font-medium">{currentMatchData.player1.name}</p>
              <div className="mt-2 flex items-center justify-center">
                <button
                  onClick={() => updateMatchScore('player1', -1)}
                  className="h-8 w-8 flex items-center justify-center bg-gray-200 rounded-l-full"
                >
                  -
                </button>
                <div className="px-3 py-1 bg-gray-100 font-bold">
                  {currentMatchData.scores.player1}
                </div>
                <button
                  onClick={() => updateMatchScore('player1', 1)}
                  className="h-8 w-8 flex items-center justify-center bg-gray-200 rounded-r-full"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="px-4 py-2 rounded-full bg-gray-200 font-semibold">
              VS
            </div>
            
            <div className="text-center flex-1">
              <div className="text-5xl mb-2">{currentMatchData.player2.avatar}</div>
              <p className="font-medium">{currentMatchData.player2.name}</p>
              <div className="mt-2 flex items-center justify-center">
                <button
                  onClick={() => updateMatchScore('player2', -1)}
                  className="h-8 w-8 flex items-center justify-center bg-gray-200 rounded-l-full"
                >
                  -
                </button>
                <div className="px-3 py-1 bg-gray-100 font-bold">
                  {currentMatchData.scores.player2}
                </div>
                <button
                  onClick={() => updateMatchScore('player2', 1)}
                  className="h-8 w-8 flex items-center justify-center bg-gray-200 rounded-r-full"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Who won this match?</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => completeMatch(currentMatchData.player1.id)}
                className="py-2 bg-blue-100 text-blue-700 rounded-lg font-medium"
              >
                {currentMatchData.player1.name}
              </button>
              <button 
                onClick={() => completeMatch(currentMatchData.player2.id)}
                className="py-2 bg-blue-100 text-blue-700 rounded-lg font-medium"
              >
                {currentMatchData.player2.name}
              </button>
            </div>
          </div>
        </div>
        
        {/* Tournament Bracket (Simplified) */}
        <h4 className="font-semibold mb-2">Tournament Bracket</h4>
        <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4 overflow-x-auto">
          <div className="flex min-w-max">
            {rounds.map((round, roundIdx) => (
              <div key={roundIdx} className="flex-shrink-0 w-40 pr-4">
                <div className={`text-center mb-2 font-medium py-1 rounded ${
                  roundIdx === currentRound ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                }`}>
                  Round {roundIdx + 1}
                </div>
                <div className="space-y-3">
                  {round.matches.map((match, matchIdx) => (
                    <div 
                      key={matchIdx} 
                      className={`border rounded-lg p-2 ${
                        roundIdx === currentRound && matchIdx === currentMatch
                          ? 'border-blue-500 bg-blue-50'
                          : match.winner ? 'border-green-300 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        <div className="text-lg mr-1">{match.player1?.avatar || '?'}</div>
                        <p className="text-sm truncate">
                          {match.player1?.name || 'TBD'}
                        </p>
                        {match.winner?.id === match.player1?.id && (
                          <div className="ml-auto text-green-600">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <div className="text-lg mr-1">{match.player2?.avatar || '?'}</div>
                        <p className="text-sm truncate">
                          {match.player2?.name || 'TBD'}
                        </p>
                        {match.winner?.id === match.player2?.id && (
                          <div className="ml-auto text-green-600">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <h2 className="text-xl font-bold text-center">Family Tournament</h2>
        <div className="px-6"></div>
      </div>
      
      {currentStep === 'setup' ? renderSetupPhase() : renderTournamentPhase()}
      
      {/* Success Overlay */}
      {showSuccess && winner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-10 w-10 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Tournament Champion!</h3>
            <div className="text-5xl mb-3">{winner.avatar}</div>
            <p className="text-xl font-bold mb-4">{winner.name}</p>
            <p className="text-gray-600 mb-4">
              Congratulations to {winner.name} for winning the {tournamentName}!
            </p>
            <p className="font-bold text-yellow-500 text-lg mb-4">+100 Points</p>
            <button
              onClick={() => onComplete && onComplete({
                challengeName: "Family Tournament",
                winner: winner.name,
                tournamentName: tournamentName,
                participants: selectedPlayers.length,
                points: 100
              })}
              className="w-full bg-blue-500 text-white py-2 rounded-lg"
            >
              Finish Tournament
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main challenge selector component that renders the appropriate challenge
export const ChallengeImplementation = ({ challenge, onBack, onComplete, familyMembers }) => {
  switch (challenge?.id) {
    case 1: // "Around the World"
      return <AroundTheWorldChallenge onBack={onBack} onComplete={onComplete} />;
    case 2: // "Trick Shot Master"
      return <TrickShotChallenge onBack={onBack} onComplete={onComplete} />;
    case 3: // "Family Tournament"
      return <FamilyTournamentChallenge onBack={onBack} onComplete={onComplete} familyMembers={familyMembers} />;
    default:
      return (
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="py-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Challenge not found</h3>
            <p className="text-gray-600 mb-4">
              The selected challenge is not available.
            </p>
            <button
              onClick={onBack}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg"
            >
              Back to Challenges
            </button>
          </div>
        </div>
      );
  }
};

// Example usage in the FamilyMode component:
// 
// // In your FamilyMode component
// const [activeChallenge, setActiveChallenge] = useState(null);
//
// // When a challenge is clicked
// const startChallenge = (challenge) => {
//   setActiveChallenge(challenge);
// };
//
// // When a challenge is completed
// const completeChallenge = (results) => {
//   console.log('Challenge completed:', results);
//   // Update scores, show success message, etc.
//   setActiveChallenge(null);
// };
//
// // In your render method
// if (activeChallenge) {
//   return (
//     <ChallengeImplementation 
//       challenge={activeChallenge}
//       onBack={() => setActiveChallenge(null)}
//       onComplete={completeChallenge}
//       familyMembers={familyMembers}
//     />
//   );
// }