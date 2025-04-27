import React from 'react';
import { BookOpen, Sun, Music, Calendar, Map, Award, Heart, Smile, Camera, Star, Target, Users } from 'lucide-react';

export const quickLinksData = [
  { 
    icon: <BookOpen className="h-6 w-6 text-green-600" />, 
    title: 'Family Rules', 
    color: 'bg-green-100',
    description: 'Create your own family disc golf rules',
    content: {
      type: 'custom-rules',
      suggestions: [
        'Shorter distances for kids',
        'Extra throws allowed for beginners',
        'Special family scoring system',
        'Handicap system for different ages',
        'Unique obstacles or challenges',
        'Team play formats',
        'Modified par values',
        'Fun penalties or bonuses'
      ]
    }
  },
  { 
    icon: <Sun className="h-6 w-6 text-blue-600" />, 
    title: 'Weather Check', 
    color: 'bg-blue-100',
    description: 'Check local weather conditions for your disc golf outing',
    content: [
      { title: 'Current Weather', url: 'https://weather.com' },
      { title: 'How Wind Affects Disc Flight', url: '#' },
      { title: 'Rain Plans', url: '#' },
      { title: 'Best Times to Play', url: '#' }
    ]
  },
  { 
    icon: <Music className="h-6 w-6 text-purple-600" />, 
    title: 'Sound Effects', 
    color: 'bg-purple-100',
    description: 'Fun sounds for when the disc goes into the basket',
    content: {
      type: 'sound-effects',
      sounds: [
        { name: 'Classic Chain Rattle', icon: '🔊' },
        { name: 'Crowd Cheering', icon: '👏' },
        { name: 'Magic Sparkle', icon: '✨' },
        { name: 'Victory Trumpet', icon: '🎺' },
        { name: 'Arcade Success', icon: '🎮' },
        { name: 'Custom Recording', icon: '🎤' }
      ]
    }
  },
  { 
    icon: <Calendar className="h-6 w-6 text-pink-600" />, 
    title: 'Family Events', 
    color: 'bg-pink-100',
    description: 'Schedule and track family disc golf events',
    content: [
      { title: 'Create Family Tournament', url: '#' },
      { title: 'Weekly Challenge Day', url: '#' },
      { title: 'Birthday Special Games', url: '#' },
      { title: 'Family vs Family Match', url: '#' }
    ]
  },
  { 
    icon: <Map className="h-6 w-6 text-red-600" />, 
    title: 'Course Finder', 
    color: 'bg-red-100',
    description: 'Find family-friendly disc golf courses nearby',
    content: [
      { title: 'Search Nearby Courses', url: '#' },
      { title: 'Family-Friendly Filters', url: '#' },
      { title: 'Save Favorite Courses', url: '#' },
      { title: 'Rate Course Difficulty', url: '#' }
    ]
  },
  { 
    icon: <Award className="h-6 w-6 text-indigo-600" />, 
    title: 'Printables', 
    color: 'bg-indigo-100',
    description: 'Download and print family scorecards and games',
    content: [
      { title: 'Family Scorecard', url: '#' },
      { title: 'Achievement Tracker', url: '#' },
      { title: 'Disc Golf Bingo', url: '#' },
      { title: 'Course Design Sheet', url: '#' }
    ]
  },
  { 
    icon: <Heart className="h-6 w-6 text-yellow-600" />, 
    title: 'Safety Tips', 
    color: 'bg-yellow-100',
    description: 'Safety guidelines for family disc golf outings',
    content: [
      { title: 'Course Etiquette', url: '#' },
      { title: 'Throwing Safety', url: '#' },
      { title: 'Playing in Groups', url: '#' },
      { title: 'First Aid Basics', url: '#' }
    ]
  },
  { 
    icon: <Smile className="h-6 w-6 text-orange-600" />, 
    title: 'Fun Challenges', 
    color: 'bg-orange-100',
    description: 'Creative games to make disc golf more fun for kids',
    content: {
      type: 'fun-challenges',
      challenges: [
        { 
          id: 'trick-shot', 
          title: 'Trick Shot Contest', 
          description: 'Take turns doing trick shots and vote for the winner',
          icon: <Camera className="h-5 w-5" />,
          points: 35
        },
        { 
          id: 'themed-round', 
          title: 'Themed Rounds', 
          description: 'Play a round with a fun theme like "pirates" or "superheroes"',
          icon: <Star className="h-5 w-5" />,
          points: 25
        },
        { 
          id: 'team-challenge', 
          title: 'Team Challenges', 
          description: 'Parents vs kids or other team formats',
          icon: <Users className="h-5 w-5" />,
          points: 40
        },
        { 
          id: 'skill-building', 
          title: 'Skill-Building Games', 
          description: 'Fun mini-games that improve disc golf skills',
          icon: <Target className="h-5 w-5" />,
          points: 30
        }
      ]
    }
  }
];