import React from 'react';
import { ChevronLeft, Trash2, Music } from 'lucide-react';

const ResourceDetails = ({
  resource,
  onBack,
  newRule,
  setNewRule,
  addRule,
  removeRule,
  familyRules,
  selectedSound,
  setSelectedSound,
  startFunChallenge
}) => {
  
  // Family Rules resource view
  if (resource.title === 'Family Rules') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-xl font-semibold mb-4">Create Your Family Rules</h3>
        <p className="text-gray-600 mb-4">Customize your disc golf experience with special rules that make the game fun for the whole family.</p>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">Suggested Rules:</h4>
          <div className="space-y-2 mb-4">
            {resource.content.suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => setNewRule(suggestion)}
                className="w-full text-left px-3 py-2 bg-green-50 hover:bg-green-100 rounded-lg text-sm transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex mb-2">
            <input
              type="text"
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="Enter your custom rule"
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={addRule}
              className="bg-green-500 text-white px-4 py-2 rounded-r-lg"
            >
              Add
            </button>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Your Family Rules:</h4>
          {familyRules.length === 0 ? (
            <p className="text-gray-500 italic">No rules added yet. Add some rules to get started!</p>
          ) : (
            <ul className="space-y-2">
              {familyRules.map((rule, idx) => (
                <li key={idx} className="flex items-center justify-between bg-green-50 px-4 py-3 rounded-lg">
                  <span className="flex-1 mr-2 text-sm">{rule}</span>
                  <button
                    onClick={() => removeRule(idx)}
                    className="text-red-500 hover:text-red-700 flex-shrink-0"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="mt-6">
          <button className="w-full bg-green-500 text-white py-2 rounded-lg font-medium">
            Save Family Rules
          </button>
        </div>
      </div>
    );
  }
  
  // Sound Effects resource view
  if (resource.title === 'Sound Effects') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-xl font-semibold mb-4">Basket Sound Effects</h3>
        <p className="text-gray-600 mb-4">Choose a fun sound to play when the disc lands in the basket!</p>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          {resource.content.sounds.map((sound, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSound(sound.name)}
              className={`flex items-center p-3 rounded-lg border-2 transition-all ${
                selectedSound === sound.name
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <span className="text-2xl mr-2">{sound.icon}</span>
              <span className="font-medium text-sm">{sound.name}</span>
            </button>
          ))}
        </div>
        
        <div className="bg-purple-50 rounded-lg p-3 mb-4">
          <h4 className="font-medium mb-2 text-sm">Currently Selected:</h4>
          <div className="flex items-center justify-between">
            <span className="font-semibold">{selectedSound}</span>
            <button className="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm flex items-center">
              <Music className="h-4 w-4 mr-1" />
              Test
            </button>
          </div>
        </div>
        
        <div>
          <button className="w-full bg-purple-500 text-white py-2 rounded-lg font-medium">
            Save Sound Preference
          </button>
        </div>
      </div>
    );
  }
  
  // Fun Challenges resource view
  if (resource.title === 'Fun Challenges') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-xl font-semibold mb-4">Fun Challenges</h3>
        <p className="text-gray-600 mb-4">Creative games to make disc golf more fun for the whole family!</p>
        
        <div className="space-y-3">
          {resource.content.challenges.map((challenge, idx) => (
            <div 
              key={idx} 
              className="bg-orange-50 rounded-lg p-4 hover:bg-orange-100 transition-colors cursor-pointer"
              onClick={() => startFunChallenge(challenge)}
            >
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-orange-100 mr-3">
                  {challenge.icon}
                </div>
                <div>
                  <h4 className="font-semibold">{challenge.title}</h4>
                  <p className="text-sm text-gray-600">{challenge.description}</p>
                </div>
                <div className="ml-auto">
                  <span className="font-bold text-yellow-500">{challenge.points}</span>
                  <span className="text-xs text-gray-500 block text-right">points</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Default resource view (for links)
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-xl font-semibold mb-4">{resource.title}</h3>
      <p className="text-gray-600 mb-4">{resource.description}</p>
      
      <ul className="space-y-2">
        {Array.isArray(resource.content) && resource.content.map((item, idx) => (
          <li key={idx}>
            <a 
              href={item.url} 
              className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className={`p-2 rounded-full ${resource.color} mr-3`}>
                {resource.icon}
              </div>
              <span className="text-sm">{item.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ResourceDetailsWrapper = ({
  showResourceDetails,
  setShowResourceDetails,
  newRule,
  setNewRule,
  addRule,
  removeRule,
  familyRules,
  selectedSound,
  setSelectedSound,
  startFunChallenge
}) => {
  if (!showResourceDetails) return null;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-4">
          <button
            onClick={() => setShowResourceDetails(null)}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-bold">{showResourceDetails.title}</h2>
        </div>
        
        <ResourceDetails
          resource={showResourceDetails}
          onBack={() => setShowResourceDetails(null)}
          newRule={newRule}
          setNewRule={setNewRule}
          addRule={addRule}
          removeRule={removeRule}
          familyRules={familyRules}
          selectedSound={selectedSound}
          setSelectedSound={setSelectedSound}
          startFunChallenge={startFunChallenge}
        />
      </div>
    </div>
  );
};

export default ResourceDetailsWrapper;