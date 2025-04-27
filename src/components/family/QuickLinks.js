import React from 'react';

const QuickLinks = ({ quickLinks, setShowResourceDetails }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {quickLinks.map((link, index) => (
        <div 
          key={index} 
          className="bg-white rounded-lg shadow-lg p-4 text-center transform hover:scale-105 transition-transform cursor-pointer"
          onClick={() => setShowResourceDetails(link)}
        >
          <div className={`inline-flex items-center justify-center p-3 rounded-full ${link.color} mb-2`}>
            {link.icon}
          </div>
          <h3 className="text-base font-semibold">{link.title}</h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{link.description}</p>
        </div>
      ))}
    </div>
  );
};

export default QuickLinks;