import React from 'react';
import { ChevronLeft, Award, BarChart2 } from 'lucide-react';

const Statistics = ({ stats, onBack }) => {
  // Create default stats object when no stats are available
  const defaultStats = {
    totalRounds: 0,
    totalHoles: 0,
    averageThrowsPerHole: 0,
    averageRoundScore: 0,
    scoreCounts: {
      albatrosses: 0,
      eagles: 0,
      birdies: 0,
      pars: 0,
      bogeys: 0,
      doubleBogeys: 0,
      tripleBogeyPlus: 0
    },
    courseStats: [],
    bestRound: null
  };

  // Use provided stats or default stats
  const displayStats = stats || defaultStats;

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg min-h-screen">
      <div className="flex items-center mb-4">
        <button 
          onClick={onBack}
          className="mr-2 bg-gray-200 p-3 rounded-full" // Increased touch target size
          aria-label="Go back"
        >
          <ChevronLeft size={24} /> {/* Increased icon size */}
        </button>
        <h1 className="text-2xl font-bold">Statistics</h1>
      </div>
      
      <div className="space-y-4">
        {/* Overview section - always shown */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-bold mb-3">Overview</h2>
          
          {!stats && (
            <p className="text-gray-500 mb-3">No completed rounds yet. Play a round to see your stats!</p>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"> {/* Single column on small screens */}
            <div className="bg-blue-50 p-4 rounded"> {/* Increased padding */}
              <p className="text-sm text-gray-500">Total Rounds</p>
              <p className="text-xl font-bold">{displayStats.totalRounds}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-500">Total Holes</p>
              <p className="text-xl font-bold">{displayStats.totalHoles}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-500">Avg. Throws/Hole</p>
              <p className="text-xl font-bold">{displayStats.averageThrowsPerHole}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-500">Avg. Round Score</p>
              <p className="text-xl font-bold">{displayStats.averageRoundScore}</p>
            </div>
          </div>
        </div>
        
        {/* Best Round section - always shown */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-bold mb-3 flex items-center">
            <Award size={20} className="mr-2 text-yellow-500" /> Best Round
          </h2>
          
          {displayStats.bestRound ? (
            <div className="bg-yellow-50 p-4 rounded"> {/* Increased padding */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center"> {/* Stack on mobile */}
                <div className="mb-2 sm:mb-0"> {/* Add margin on mobile */}
                  <p className="font-bold">{displayStats.bestRound.courseName}</p>
                  <p className="text-sm text-gray-500">{displayStats.bestRound.date}</p>
                </div>
                <div className="sm:text-right"> {/* Only right-align on larger screens */}
                  <p className="font-bold text-xl">{displayStats.bestRound.score}</p>
                  <p className="text-sm text-gray-500">{displayStats.bestRound.throws} throws</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 p-4 rounded text-center">
              <p className="text-gray-500">Complete a round to see your best performance!</p>
            </div>
          )}
        </div>
        
        {/* Score Distribution - always shown */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-bold mb-3">Score Distribution</h2>
          <div className="space-y-3"> {/* Increased spacing between items */}
            <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"> {/* Added padding and hover effect */}
              <span className="flex items-center">🦅🦅 Albatross or better</span>
              <span className="font-bold">{displayStats.scoreCounts.albatrosses}</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
              <span className="flex items-center">🦅 Eagle</span>
              <span className="font-bold">{displayStats.scoreCounts.eagles}</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
              <span className="flex items-center">🐦 Birdie</span>
              <span className="font-bold">{displayStats.scoreCounts.birdies}</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
              <span className="flex items-center">🟢 Par</span>
              <span className="font-bold">{displayStats.scoreCounts.pars}</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
              <span className="flex items-center">🟡 Bogey</span>
              <span className="font-bold">{displayStats.scoreCounts.bogeys}</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
              <span className="flex items-center">🟠 Double Bogey</span>
              <span className="font-bold">{displayStats.scoreCounts.doubleBogeys}</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
              <span className="flex items-center">🔴 Triple Bogey+</span>
              <span className="font-bold">{displayStats.scoreCounts.tripleBogeyPlus}</span>
            </div>
          </div>
        </div>
        
        {/* Course Stats - always shown with informative message when empty */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-bold mb-3">Course Stats</h2>
          {displayStats.courseStats.length > 0 ? (
            <div className="space-y-3">
              {displayStats.courseStats.map(course => (
                <div key={course.id} className="border-b last:border-b-0 pb-3 last:pb-0"> {/* Increased padding */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center"> {/* Stack on mobile */}
                    <div className="mb-2 sm:mb-0"> {/* Add margin on mobile */}
                      <p className="font-bold">{course.name}</p>
                      <p className="text-sm text-gray-500">{course.roundCount} rounds</p>
                    </div>
                    <div className="sm:text-right"> {/* Only right-align on larger screens */}
                      <p className="font-bold">Best: {course.bestScore}</p>
                      <p className="text-sm text-gray-500">Avg: {course.averageScore}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-3 bg-gray-50 rounded">
              <p className="text-gray-500">Play rounds on different courses to see course-specific stats!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics;