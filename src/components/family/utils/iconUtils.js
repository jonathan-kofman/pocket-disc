import React from 'react';
import { Target, Trophy, Camera, Star, Zap, Award, Heart, Smile } from 'lucide-react';

// Available icons for challenges
export const availableIcons = [
  { name: 'Target', component: <Target className="h-6 w-6" /> },
  { name: 'Trophy', component: <Trophy className="h-6 w-6" /> },
  { name: 'Camera', component: <Camera className="h-6 w-6" /> },
  { name: 'Star', component: <Star className="h-6 w-6" /> },
  { name: 'Zap', component: <Zap className="h-6 w-6" /> },
  { name: 'Award', component: <Award className="h-6 w-6" /> },
  { name: 'Heart', component: <Heart className="h-6 w-6" /> },
  { name: 'Smile', component: <Smile className="h-6 w-6" /> }
];

// Get icon component by name
export const getIconComponent = (iconName) => {
  const icon = availableIcons.find(i => i.name === iconName);
  return icon ? icon.component : <Target className="h-6 w-6" />;
};