import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, Plus, Trash2, Save, Share2, Leaf, Sofa, Target, 
  RotateCcw, Ruler, Copy, Download, Upload, Eye, EyeOff, Settings,
  Move, Maximize, CornerDownRight, ArrowRight, Wind, ZoomIn, ZoomOut,
  Droplets, Mountain, Flag, GripHorizontal, Palmtree, Shrub,
  Snowflake, Umbrella, Shovel, Flower, Webhook, CircleDot,
  Menu, X, ChevronDown, ChevronUp, MapPin, User, Info
} from 'lucide-react';

const BackyardDesigner = ({ onBack }) => {
  const [courseName, setCourseName] = useState('My Backyard Course');
  const [holes, setHoles] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [measurementMode, setMeasurementMode] = useState(false);
  const [selectedHole, setSelectedHole] = useState(null);
  const [activeDesignMode, setActiveDesignMode] = useState('layout'); // 'layout', 'terrain', 'obstacles'
  const [currentObstacle, setCurrentObstacle] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [showDistanceLines, setShowDistanceLines] = useState(true);
  const [windDirection, setWindDirection] = useState(45); // degrees
  const [windSpeed, setWindSpeed] = useState(5); // mph
  const [terrainFeatures, setTerrainFeatures] = useState([]);
  const [elevationMode, setElevationMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [courseNotes, setCourseNotes] = useState('');
  const [environmentType, setEnvironmentType] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState('map'); // 'map', 'course', 'settings', 'holes'
  const [isDragging, setIsDragging] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 });
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const mapRef = useRef(null);
  
  // Available obstacle types with their icons and properties
  const tools = [
    { id: 'tee', icon: <Flag className="h-6 w-6" />, label: 'Tee', color: 'text-emerald-600', description: 'Starting point' },
    { id: 'hole', icon: <Target className="h-6 w-6" />, label: 'Hole', color: 'text-red-600', description: 'Target hole' },
    { id: 'player', icon: <User className="h-6 w-6" />, label: 'Player', color: 'text-blue-600', description: 'Your position' },
    { id: 'tree', icon: <Palmtree className="h-6 w-6" />, label: 'Tree', color: 'text-green-600', description: 'Large object, blocks shots' },
    { id: 'bush', icon: <Shrub className="h-6 w-6" />, label: 'Bush', color: 'text-green-500', description: 'Small obstacle, can shoot over' },
    { id: 'bench', icon: <Sofa className="h-6 w-6" />, label: 'Bench', color: 'text-amber-700', description: 'Resting spot for players' },
    { id: 'water', icon: <Droplets className="h-6 w-6" />, label: 'Water', color: 'text-blue-600', description: 'Water hazard, penalty if ball lands here' },
    { id: 'hill', icon: <Mountain className="h-6 w-6" />, label: 'Hill', color: 'text-stone-600', description: 'Elevation change, affects shot trajectory' },
    { id: 'flag', icon: <Flag className="h-6 w-6" />, label: 'Flag', color: 'text-yellow-600', description: 'Marking for visibility' },
    { id: 'rock', icon: <CircleDot className="h-6 w-6" />, label: 'Rock', color: 'text-gray-600', description: 'Solid obstacle, redirects shots' }
  ];

  // Rest of the component code remains the same...
  
  // Available terrain types with properties
  const terrainTypes = [
    { id: 'grass', label: 'Grass', color: '#90EE90', friction: 0.8, description: 'Standard surface, normal roll' },
    { id: 'rough', label: 'Rough', color: '#6B8E23', friction: 1.2, description: 'Taller grass, slows ball roll' },
    { id: 'sand', label: 'Sand', color: '#F5DEB3', friction: 1.5, description: 'Bunker, difficult to hit from' },
    { id: 'concrete', label: 'Concrete', color: '#A9A9A9', friction: 0.5, description: 'Fast surface, long roll' },
    { id: 'mulch', label: 'Mulch', color: '#8B4513', friction: 1.3, description: 'Soft surface, absorbs impact' }
  ];

  // Initialize with a default setup
  useEffect(() => {
    if (holes.length === 0) {
      const initialHole = {
        id: Date.now(),
        name: "Hole 1",
        teePosition: { x: 20, y: 50 },
        holePosition: { x: 80, y: 50 },
        par: 3,
        obstacles: [],
        notes: '',
        elevation: 0
      };
      
      setHoles([initialHole]);
      setSelectedHole(initialHole.id);
    }
  }, []);

  // Calculate hole distances
  useEffect(() => {
    const updatedHoles = holes.map(hole => {
      if (hole.teePosition && hole.holePosition) {
        const distance = calculateDistance(hole.teePosition, hole.holePosition);
        return { ...hole, distance: Math.round(distance) };
      }
      return hole;
    });
    setHoles(updatedHoles);
  }, [holes.map(h => `${h.teePosition?.x}-${h.teePosition?.y}-${h.holePosition?.x}-${h.holePosition?.y}`)]);

  const calculateDistance = (point1, point2) => {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
  };

  const getCurrentHole = () => {
    return holes.find(h => h.id === selectedHole) || holes[0];
  };

  const handleAddObstacle = (type, position = null) => {
    const currentHole = getCurrentHole();
    if (!currentHole) return;
    
    // Use provided position or calculate default position (center between tee and hole)
    const obstaclePosition = position || {
      x: (currentHole.teePosition.x + currentHole.holePosition.x) / 2,
      y: (currentHole.teePosition.y + currentHole.holePosition.y) / 2
    };
    
    const newObstacle = { 
      type,
      id: Date.now(),
      position: obstaclePosition,
      size: 1,
      rotation: 0,
      elevation: currentHole.elevation || 0
    };
    
    setHoles(holes.map(hole => {
      if (hole.id === currentHole.id) {
        return {
          ...hole,
          obstacles: [...hole.obstacles, newObstacle]
        };
      }
      return hole;
    }));
    
    // Set this as the selected element
    setSelectedElement({
      type: 'obstacle',
      holeId: currentHole.id,
      obstacleId: newObstacle.id
    });
  };

  const handleRemoveObstacle = (holeId, obstacleId) => {
    setHoles(holes.map(hole => {
      if (hole.id === holeId) {
        return {
          ...hole,
          obstacles: hole.obstacles.filter(obs => obs.id !== obstacleId)
        };
      }
      return hole;
    }));
    
    // Clear selection if this obstacle was selected
    if (selectedElement?.type === 'obstacle' && 
        selectedElement.holeId === holeId && 
        selectedElement.obstacleId === obstacleId) {
      setSelectedElement(null);
    }
  };

  const handleUpdateObstacle = (holeId, obstacleId, updates) => {
    setHoles(holes.map(hole => {
      if (hole.id === holeId) {
        return {
          ...hole,
          obstacles: hole.obstacles.map(obs => 
            obs.id === obstacleId ? { ...obs, ...updates } : obs
          )
        };
      }
      return hole;
    }));
  };
  
  const handleAddHole = () => {
    const newId = Date.now();
    const newHole = {
      id: newId,
      name: `Hole ${holes.length + 1}`,
      teePosition: { x: 20, y: 50 },
      holePosition: { x: 80, y: 50 },
      par: 3,
      obstacles: [],
      notes: '',
      elevation: 0
    };
    
    setHoles([...holes, newHole]);
    setSelectedHole(newId);
  };
  
  const handleRemoveHole = (holeId) => {
    if (holes.length <= 1) {
      alert("You must have at least one hole.");
      return;
    }
    
    const updatedHoles = holes.filter(h => h.id !== holeId);
    setHoles(updatedHoles);
    
    // Update selected hole if needed
    if (selectedHole === holeId) {
      setSelectedHole(updatedHoles[0].id);
    }
  };

  const handleStartDrag = (e, elementInfo) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedElement(elementInfo);
    setIsDragging(true);
  };

  const handleMapClick = (e) => {
    if (!mapRef.current || currentObstacle === null) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    // Adjust for zoom and panning
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Adjust for panning - convert percentage back to actual position
    const adjustedX = (x / zoomLevel) - (panOffset.x / rect.width * 100);
    const adjustedY = (y / zoomLevel) - (panOffset.y / rect.height * 100);
    
    // Constrain within map boundaries
    const boundedX = Math.max(0, Math.min(100, adjustedX));
    const boundedY = Math.max(0, Math.min(100, adjustedY));
    
    const currentHole = getCurrentHole();
    if (!currentHole) return;
    
    // Which element to place based on current obstacle type
    if (currentObstacle === 'tee') {
      setHoles(holes.map(hole => 
        hole.id === currentHole.id 
          ? { ...hole, teePosition: { x: boundedX, y: boundedY } }
          : hole
      ));
    } else if (currentObstacle === 'hole') {
      setHoles(holes.map(hole => 
        hole.id === currentHole.id 
          ? { ...hole, holePosition: { x: boundedX, y: boundedY } }
          : hole
      ));
    } else if (currentObstacle === 'player') {
      setPlayerPosition({ x: boundedX, y: boundedY });
    } else {
      // For obstacles, we need to pass position to handleAddObstacle
      const newObstaclePosition = { x: boundedX, y: boundedY };
      handleAddObstacle(currentObstacle, newObstaclePosition);
    }
    
    // After placing, clear the current obstacle
    setCurrentObstacle(null);
  };
  
  const handleMapDrag = (e) => {
    if (!isDragging || !selectedElement || !mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    
    // Calculate position in map coordinates (percentage)
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Adjust for zoom and panning
    const adjustedX = (x / zoomLevel) - (panOffset.x / rect.width * 100);
    const adjustedY = (y / zoomLevel) - (panOffset.y / rect.height * 100);
    
    // Constrain within map boundaries
    const boundedX = Math.max(0, Math.min(100, adjustedX));
    const boundedY = Math.max(0, Math.min(100, adjustedY));
    
    if (selectedElement.type === 'tee') {
      setHoles(holes.map(hole => 
        hole.id === selectedElement.holeId 
          ? { ...hole, teePosition: { x: boundedX, y: boundedY } }
          : hole
      ));
    } else if (selectedElement.type === 'hole') {
      setHoles(holes.map(hole => 
        hole.id === selectedElement.holeId 
          ? { ...hole, holePosition: { x: boundedX, y: boundedY } }
          : hole
      ));
    } else if (selectedElement.type === 'player') {
      setPlayerPosition({ x: boundedX, y: boundedY });
    } else if (selectedElement.type === 'obstacle') {
      setHoles(holes.map(hole => {
        if (hole.id === selectedElement.holeId) {
          return {
            ...hole,
            obstacles: hole.obstacles.map(obs => 
              obs.id === selectedElement.obstacleId 
                ? { ...obs, position: { x: boundedX, y: boundedY } }
                : obs
            )
          };
        }
        return hole;
      }));
    }
  };

  const handleEndDrag = () => {
    setIsDragging(false);
  };

  const handleMapPanStart = (e) => {
    if (currentObstacle !== null) return; // Don't start panning if we're in placement mode
    
    setStartPan({
      x: e.clientX / zoomLevel - panOffset.x,
      y: e.clientY / zoomLevel - panOffset.y
    });
  };

  const handleMapPan = (e) => {
    if (!startPan || currentObstacle !== null) return;
    
    // Limit panning to keep the map in view - prevent panning too far
    const newX = e.clientX / zoomLevel - startPan.x;
    const newY = e.clientY / zoomLevel - startPan.y;
    
    // Get map dimensions
    const mapWidth = mapRef.current?.offsetWidth || 0;
    const mapHeight = mapRef.current?.offsetHeight || 0;
    
    // Constrain panning to keep map visible
    const maxPanX = mapWidth * 0.5; // Allow panning up to half the map width
    const maxPanY = mapHeight * 0.5; // Allow panning up to half the map height
    
    setPanOffset({
      x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
      y: Math.max(-maxPanY, Math.min(maxPanY, newY))
    });
  };

  const handleMapPanEnd = () => {
    setStartPan(null);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleExportCourse = () => {
    const courseData = {
      name: courseName,
      holes,
      playerPosition,
      settings: {
        windDirection,
        windSpeed,
        environmentType
      },
      notes: courseNotes,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(courseData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${courseName.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportCourse = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const courseData = JSON.parse(e.target.result);
          setCourseName(courseData.name || 'Imported Course');
          setHoles(courseData.holes || []);
          if (courseData.playerPosition) setPlayerPosition(courseData.playerPosition);
          if (courseData.notes) setCourseNotes(courseData.notes);
          if (courseData.settings) {
            setWindDirection(courseData.settings.windDirection);
            setWindSpeed(courseData.settings.windSpeed);
            if (courseData.settings.environmentType) setEnvironmentType(courseData.settings.environmentType);
          }
        } catch (error) {
          console.error('Error importing course:', error);
          alert('Error importing course. The file may be corrupted or in the wrong format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const resetMapView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setCurrentObstacle(null);
    setSelectedElement(null);
  };

  const renderMapView = () => {
    const currentHole = getCurrentHole();
    
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {currentHole ? currentHole.name : "Select a Hole"}
          </h3>
          <div className="flex space-x-2">
            <button 
              onClick={handleZoomIn}
              className="p-2 bg-gray-100 rounded-full"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button 
              onClick={handleZoomOut}
              className="p-2 bg-gray-100 rounded-full"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <button 
              onClick={resetMapView}
              className="p-2 bg-gray-100 rounded-full"
              aria-label="Reset view"
              title="Reset view"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Hole Selection Bar */}
        <div className="mb-4 overflow-x-auto whitespace-nowrap py-2">
          {holes.map(hole => (
            <button
              key={hole.id}
              onClick={() => setSelectedHole(hole.id)}
              className={`px-3 py-2 mr-2 rounded-lg ${selectedHole === hole.id ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              {hole.name}
            </button>
          ))}
          <button
            onClick={handleAddHole}
            className="px-3 py-2 bg-green-500 text-white rounded-lg inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Hole
          </button>
        </div>
        
        {/* Tool Selection Bar */}
        <div className="mb-4 overflow-x-auto whitespace-nowrap py-2 border-t border-b border-gray-200">
          <div className="py-2 text-sm font-medium text-gray-700">Select an element to place:</div>
          <div className="flex space-x-2">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => setCurrentObstacle(tool.id)}
                className={`p-2 rounded-lg flex flex-col items-center ${currentObstacle === tool.id ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white border'}`}
              >
                <div className={`${tool.color} mb-1`}>
                  {tool.icon}
                </div>
                <span className="text-xs whitespace-normal text-center">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Map Container */}
        <div
          ref={mapRef}
          className="relative w-full h-64 sm:h-96 bg-green-100 rounded-lg overflow-hidden cursor-grab touch-manipulation"
          onClick={handleMapClick}
          onMouseDown={handleMapPanStart}
          onMouseMove={isDragging ? handleMapDrag : handleMapPan}
          onMouseUp={isDragging ? handleEndDrag : handleMapPanEnd}
          onMouseLeave={isDragging ? handleEndDrag : handleMapPanEnd}
          onTouchStart={(e) => handleMapPanStart({clientX: e.touches[0].clientX, clientY: e.touches[0].clientY})}
          onTouchMove={(e) => isDragging ? 
            handleMapDrag({clientX: e.touches[0].clientX, clientY: e.touches[0].clientY}) : 
            handleMapPan({clientX: e.touches[0].clientX, clientY: e.touches[0].clientY})
          }
          onTouchEnd={isDragging ? handleEndDrag : handleMapPanEnd}
          style={{
            backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDAgTCAyMCAwIE0gMCAwIEwgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utb3BhY2l0eT0iMC4xIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')",
            backgroundSize: `${20 * zoomLevel}px ${20 * zoomLevel}px`,
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top left',
          }}
        >
          {/* Current hole elements */}
          {currentHole && (
            <>
              {/* Tee Position */}
              <div 
                className="absolute w-6 h-6 flex items-center justify-center"
                style={{
                  left: `${currentHole.teePosition.x}%`,
                  top: `${currentHole.teePosition.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 20,
                  cursor: 'move'
                }}
                onMouseDown={(e) => handleStartDrag(e, { type: 'tee', holeId: currentHole.id })}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleStartDrag(e, { type: 'tee', holeId: currentHole.id });
                }}
              >
                <div className="bg-emerald-500 rounded-full p-1">
                  <Flag className="h-4 w-4 text-white" />
                </div>
                <div className="absolute top-full mt-1 text-xs bg-black bg-opacity-75 text-white px-1 rounded whitespace-nowrap">
                  Tee
                </div>
              </div>
              
              {/* Hole Position */}
              <div 
                className="absolute w-6 h-6 flex items-center justify-center"
                style={{
                  left: `${currentHole.holePosition.x}%`,
                  top: `${currentHole.holePosition.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 20,
                  cursor: 'move'
                }}
                onMouseDown={(e) => handleStartDrag(e, { type: 'hole', holeId: currentHole.id })}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleStartDrag(e, { type: 'hole', holeId: currentHole.id });
                }}
              >
                <div className="bg-red-500 rounded-full p-1">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <div className="absolute top-full mt-1 text-xs bg-black bg-opacity-75 text-white px-1 rounded whitespace-nowrap">
                  Hole
                </div>
              </div>
              
              {/* Show distance line */}
              {showDistanceLines && (
                <svg
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 10 }}
                >
                  <line
                    x1={`${currentHole.teePosition.x}%`}
                    y1={`${currentHole.teePosition.y}%`}
                    x2={`${currentHole.holePosition.x}%`}
                    y2={`${currentHole.holePosition.y}%`}
                    stroke="#4B5563"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  <text
                    x={`${(currentHole.teePosition.x + currentHole.holePosition.x) / 2}%`}
                    y={`${(currentHole.teePosition.y + currentHole.holePosition.y) / 2 - 1}%`}
                    fill="#000"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                    dy="-5"
                    style={{
                      filter: 'drop-shadow(0px 0px 2px white) drop-shadow(0px 0px 2px white)'
                    }}
                  >
                    {currentHole.distance || 0} ft
                  </text>
                </svg>
              )}
              
              {/* Obstacles */}
              {currentHole.obstacles.map(obstacle => {
                const tool = tools.find(t => t.id === obstacle.type);
                return (
                  <div 
                    key={obstacle.id}
                    className="absolute w-6 h-6 flex items-center justify-center"
                    style={{
                      left: `${obstacle.position.x}%`,
                      top: `${obstacle.position.y}%`,
                      transform: `translate(-50%, -50%) scale(${obstacle.size})`,
                      zIndex: 15,
                      cursor: 'move'
                    }}
                    onMouseDown={(e) => handleStartDrag(e, { 
                      type: 'obstacle', 
                      holeId: currentHole.id,
                      obstacleId: obstacle.id
                    })}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      handleStartDrag(e, { 
                        type: 'obstacle', 
                        holeId: currentHole.id,
                        obstacleId: obstacle.id
                      });
                    }}
                  >
                    <div className={`${tool?.color || 'text-gray-700'} bg-white bg-opacity-70 rounded-full p-1`}>
                      {tool?.icon || <CircleDot className="h-4 w-4" />}
                    </div>
                  </div>
                );
              })}
            </>
          )}
          
          {/* Player Position */}
          <div 
            className="absolute w-6 h-6 flex items-center justify-center"
            style={{
              left: `${playerPosition.x}%`,
              top: `${playerPosition.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 25,
              cursor: 'move'
            }}
            onMouseDown={(e) => handleStartDrag(e, { type: 'player' })}
            onTouchStart={(e) => {
              e.preventDefault();
              handleStartDrag(e, { type: 'player' });
            }}
          >
            <div className="bg-blue-500 rounded-full p-1">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="absolute top-full mt-1 text-xs bg-black bg-opacity-75 text-white px-1 rounded whitespace-nowrap">
              You
            </div>
          </div>
        </div>
        
        {/* Map instructions */}
        <div className="mt-3 bg-blue-50 p-3 rounded-lg text-sm">
          <p>• Select a tool above, then tap the map to place it</p>
          <p>• Drag existing elements to move them</p>
          <p>• Use two fingers to pan the map</p>
          <p className="mt-2 font-medium">Current hole: Par {currentHole?.par || 3}, {currentHole?.distance || 0} ft</p>
        </div>
        
        {/* Edit hole properties */}
        {currentHole && (
          <div className="mt-4 p-3 border rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Hole Properties</h4>
            <div className="flex space-x-2 mb-3">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  value={currentHole.name}
                  onChange={(e) => {
                    setHoles(holes.map(h => 
                      h.id === currentHole.id ? { ...h, name: e.target.value } : h
                    ));
                  }}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Par</label>
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      setHoles(holes.map(h => 
                        h.id === currentHole.id ? { ...h, par: Math.max(1, (h.par || 3) - 1) } : h
                      ));
                    }}
                    className="w-10 h-10 bg-gray-200 rounded-l-lg flex items-center justify-center text-xl"
                  >-</button>
                  <div className="w-10 h-10 bg-gray-100 flex items-center justify-center">
                    {currentHole.par || 3}
                  </div>
                  <button
                    onClick={() => {
                      setHoles(holes.map(h => 
                        h.id === currentHole.id ? { ...h, par: Math.min(5, (h.par || 3) + 1) } : h
                      ));
                    }}
                    className="w-10 h-10 bg-gray-200 rounded-r-lg flex items-center justify-center text-xl"
                  >+</button>
                </div>
              </div>
            </div>
            
            {holes.length > 1 && (
              <button
                onClick={() => handleRemoveHole(currentHole.id)}
                className="mt-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Hole
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      {/* Mobile Header */}
      <header className="sticky top-0 z-10 bg-white shadow-md p-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-gray-600 p-2"
            aria-label="Go back"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <h1 className="text-xl font-bold text-gray-900 truncate max-w-xs">
            {courseName}
          </h1>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-600 p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-4/5 max-w-xs bg-white shadow-lg p-4 overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Menu</h2>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowSaveDialog(true);
                }}
                className="flex items-center w-full px-4 py-3 bg-green-500 text-white rounded-lg"
              >
                <Save className="h-5 w-5 mr-2" />
                Save Course
              </button>
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleExportCourse();
                }}
                className="flex items-center w-full px-4 py-3 bg-blue-500 text-white rounded-lg"
              >
                <Download className="h-5 w-5 mr-2" />
                Export Course
              </button>
              
              <label className="flex items-center w-full px-4 py-3 bg-blue-500 text-white rounded-lg cursor-pointer">
                <Upload className="h-5 w-5 mr-2" />
                Import Course
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    handleImportCourse(e);
                    setMobileMenuOpen(false);
                  }}
                  className="hidden"
                />
              </label>
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentObstacle(null);
                  setShowDistanceLines(!showDistanceLines);
                }}
                className={`flex items-center w-full px-4 py-3 ${showDistanceLines ? 'bg-purple-500' : 'bg-gray-500'} text-white rounded-lg`}
              >
                <Ruler className="h-5 w-5 mr-2" />
                {showDistanceLines ? 'Hide Distances' : 'Show Distances'}
              </button>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-2">Course Settings</h3>
                <div className="px-3 py-2">
                  <label className="block text-sm text-gray-600 mb-1">Course Name</label>
                  <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="max-w-lg mx-auto">
          {/* Map View */}
          <div className="mb-4">
            <button 
              className="flex items-center justify-between w-full p-3 bg-white rounded-lg shadow mb-2"
              onClick={() => toggleSection('map')}
            >
              <h2 className="text-lg font-semibold">Course Map</h2>
              {expandedSection === 'map' ? 
                <ChevronUp className="h-5 w-5" /> : 
                <ChevronDown className="h-5 w-5" />
              }
            </button>
            
            {expandedSection === 'map' && renderMapView()}
          </div>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Save Course</h3>
            <p className="text-gray-600 mb-4">Your backyard course will be saved as a JSON file that you can reload later.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleExportCourse();
                  setShowSaveDialog(false);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Clear current obstacle when clicking outside the map */}
      {currentObstacle !== null && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-10 z-0"
          onClick={() => setCurrentObstacle(null)}
        />
      )}
      
      {/* FAB for quick hole changing */}
      {holes.length > 1 && (
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => {
              const currentIndex = holes.findIndex(h => h.id === selectedHole);
              const nextIndex = (currentIndex + 1) % holes.length;
              setSelectedHole(holes[nextIndex].id);
            }}
            className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg"
            aria-label="Next hole"
          >
            <CornerDownRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BackyardDesigner;