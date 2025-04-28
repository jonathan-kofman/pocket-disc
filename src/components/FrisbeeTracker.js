import React, { useState, useEffect } from 'react';
import { ChevronLeft, RotateCcw, Zap, Clock, Target, Map, Disc, Activity, Battery, Bell, Bluetooth, SmartphoneNfc } from 'lucide-react';

const FrisbeeTracker = ({ onBack }) => {
  const [frisbeeData, setFrisbeeData] = useState(null);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedFlights, setRecordedFlights] = useState([]);
  const [bluetoothError, setBluetoothError] = useState(null);
  const [isAlarming, setIsAlarming] = useState(false);
  const [phoneConnected, setPhoneConnected] = useState(false);

  // Connect to the frisbee via Bluetooth
  const connectToFrisbee = async () => {
    setIsLoading(true);
    setBluetoothError(null);
    
    try {
      // In a real implementation, you would use Web Bluetooth API
      // This would be the actual Bluetooth connection logic
      // navigator.bluetooth.requestDevice({
      //   filters: [{ services: ['frisbee_service_uuid'] }]
      // });
      
      // Simulating a connected device for demonstration
      setTimeout(() => {
        setConnectedDevice({
          name: "Tracker Disc 2000",
          id: "fd:ca:32:87:65:12",
          capabilities: ["tracking", "alarm", "phone_pairing"]
        });
        
        // Start sending simulated data
        startSimulatedDataStream();
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      setBluetoothError("Failed to connect to device: " + error.message);
      setIsLoading(false);
    }
  };
  
  // Connect to phone via Bluetooth
  const connectToPhone = async () => {
    setIsLoading(true);
    setBluetoothError(null);
    
    try {
      // In a real implementation, this would prompt the user to open the 
      // frisbee companion app on their phone and pair with this web app
      
      // Simulating phone connection for demonstration
      setTimeout(() => {
        setPhoneConnected(true);
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      setBluetoothError("Failed to connect to phone: " + error.message);
      setIsLoading(false);
      setPhoneConnected(false);
    }
  };
  
  // Trigger the alarm on the frisbee
  const triggerAlarm = () => {
    // In a real implementation, this would send a Bluetooth command 
    // to activate the frisbee's speaker
    setIsAlarming(!isAlarming);
    
    // Auto-disable alarm after 10 seconds for demo
    if (!isAlarming) {
      setTimeout(() => {
        setIsAlarming(false);
      }, 10000);
    }
  };
  
  // Simulate data coming from the frisbee
  const startSimulatedDataStream = () => {
    const dataInterval = setInterval(() => {
      // Generate realistic frisbee flight data
      const newData = {
        timestamp: new Date().toISOString(),
        acceleration: {
          x: (Math.random() * 2 - 1) * 9.8, // g-forces
          y: (Math.random() * 2 - 1) * 9.8,
          z: (Math.random() * 2 - 1) * 9.8,
        },
        gyroscope: {
          x: Math.random() * 360 - 180, // degrees per second
          y: Math.random() * 360 - 180,
          z: Math.random() * 500 - 250, // spin rate higher on z-axis
        },
        orientation: {
          pitch: Math.random() * 40 - 20, // degrees
          roll: Math.random() * 40 - 20,
        },
        speed: 10 + Math.random() * 15, // mph
        altitude: 1 + Math.random() * 3, // meters above ground
        distance: isRecording ? 
          (recordedFlights.length > 0 ? 
            recordedFlights[recordedFlights.length-1].totalDistance + (Math.random() * 2) : 
            Math.random() * 5) : 
          0,
        battery: 85 - (Math.random() * 5),
        lastLocation: {
          latitude: 42.3601 + (Math.random() * 0.01 - 0.005),
          longitude: -71.0589 + (Math.random() * 0.01 - 0.005),
          accuracy: 3 + Math.random() * 5
        },
        alarmStatus: isAlarming
      };
      
      setFrisbeeData(newData);
      
      if (isRecording) {
        setRecordedFlights(prev => [...prev, {
          ...newData,
          totalDistance: newData.distance
        }]);
      }
    }, 500); // Update twice per second
    
    // Cleanup interval on component unmount
    return () => clearInterval(dataInterval);
  };
  
  const startRecording = () => {
    setIsRecording(true);
    setRecordedFlights([]);
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    // Here you could save the recorded flight to localStorage
    // similar to how you handle rounds in your disc golf app
  };
  
  const disconnectDevice = () => {
    setConnectedDevice(null);
    setFrisbeeData(null);
    setIsRecording(false);
    setIsAlarming(false);
    setPhoneConnected(false);
    // In a real implementation, close the Bluetooth connection
  };
  
  const calculateMaxValues = () => {
    if (!recordedFlights || recordedFlights.length === 0) return null;
    
    let maxSpeed = 0;
    let maxDistance = 0;
    let maxSpin = 0;
    
    recordedFlights.forEach(data => {
      if (data.speed > maxSpeed) maxSpeed = data.speed;
      if (data.distance > maxDistance) maxDistance = data.distance;
      if (Math.abs(data.gyroscope.z) > maxSpin) maxSpin = Math.abs(data.gyroscope.z);
    });
    
    return {
      maxSpeed: maxSpeed.toFixed(1),
      maxDistance: maxDistance.toFixed(1),
      maxSpin: maxSpin.toFixed(0),
      flightTime: (recordedFlights.length * 0.5).toFixed(1), // in seconds, based on our 500ms interval
    };
  };
  
  const renderDeviceStatus = () => (
    <div className="bg-white rounded-lg p-5 shadow mb-4">
      <h2 className="text-xl font-bold mb-4">Device Status</h2>
      
      {!connectedDevice ? (
        <div className="text-center">
          <p className="mb-5 text-lg">Connect to your frisbee tracker to see flight data</p>
          <button 
            onClick={connectToFrisbee}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-xl text-lg font-semibold w-full flex items-center justify-center"
          >
            <Bluetooth className="mr-3 h-6 w-6" />
            {isLoading ? 'Connecting...' : 'Connect Device'}
          </button>
          {bluetoothError && (
            <p className="text-red-500 text-base mt-3">{bluetoothError}</p>
          )}
        </div>
      ) : (
        <div>
          <div className="bg-blue-50 p-4 rounded-lg mb-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">{connectedDevice.name}</p>
                <p className="text-sm text-gray-500">{connectedDevice.id}</p>
              </div>
              <div className="flex items-center bg-white p-2 rounded-lg">
                <Battery className="text-green-500 h-6 w-6 mr-2" />
                <p className="font-bold text-lg">{frisbeeData ? `${frisbeeData.battery.toFixed(0)}%` : 'N/A'}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            {!phoneConnected ? (
              <button 
                onClick={connectToPhone}
                disabled={isLoading}
                className="bg-purple-500 hover:bg-purple-600 text-white py-4 px-6 rounded-xl text-lg font-semibold flex items-center justify-center"
              >
                <SmartphoneNfc className="mr-3 h-6 w-6" /> 
                {isLoading ? 'Connecting...' : 'Connect to Phone App'}
              </button>
            ) : (
              <div className="bg-purple-100 p-3 rounded-lg flex items-center mb-2">
                <SmartphoneNfc className="text-purple-600 h-6 w-6 mr-2" />
                <p className="font-medium text-purple-800">Connected to Phone App</p>
              </div>
            )}
          
            <div className="grid grid-cols-2 gap-3 mt-2">
              {!isRecording ? (
                <button 
                  onClick={startRecording}
                  className="bg-green-500 hover:bg-green-600 text-white py-4 px-4 rounded-xl text-base font-semibold flex items-center justify-center"
                >
                  <Disc className="mr-2 h-5 w-5" /> Record Flight
                </button>
              ) : (
                <button 
                  onClick={stopRecording}
                  className="bg-red-500 hover:bg-red-600 text-white py-4 px-4 rounded-xl text-base font-semibold flex items-center justify-center"
                >
                  <RotateCcw className="mr-2 h-5 w-5" /> Stop Recording
                </button>
              )}
              
              <button 
                onClick={triggerAlarm}
                className={`${isAlarming ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'} text-white py-4 px-4 rounded-xl text-base font-semibold flex items-center justify-center`}
                disabled={!phoneConnected}
              >
                <Bell className={`mr-2 h-5 w-5 ${isAlarming ? 'animate-pulse' : ''}`} /> 
                {isAlarming ? 'Stop Alarm' : 'Alarm'}
              </button>
            </div>
            
            {isAlarming && (
              <div className="bg-yellow-100 p-3 rounded-lg text-center animate-pulse">
                <p className="text-yellow-800 font-medium">Frisbee alarm active!</p>
              </div>
            )}
            
            <button 
              onClick={disconnectDevice}
              className="bg-gray-200 hover:bg-gray-300 py-3 px-6 rounded-xl text-base font-medium mt-2"
            >
              Disconnect All Devices
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
  const renderLiveData = () => {
    if (!frisbeeData) return null;
    
    return (
      <div className="bg-white rounded-lg p-5 shadow mb-4">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Activity className="mr-2 h-6 w-6 text-blue-500" /> Live Data
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center text-blue-700 mb-2">
              <Zap className="h-5 w-5 mr-2" /> Speed
            </div>
            <p className="text-2xl font-bold">{frisbeeData.speed.toFixed(1)} mph</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center text-green-700 mb-2">
              <Map className="h-5 w-5 mr-2" /> Distance
            </div>
            <p className="text-2xl font-bold">{frisbeeData.distance.toFixed(1)} m</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center text-purple-700 mb-2">
              <RotateCcw className="h-5 w-5 mr-2" /> Spin Rate
            </div>
            <p className="text-2xl font-bold">{Math.abs(frisbeeData.gyroscope.z).toFixed(0)}°/s</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center text-yellow-700 mb-2">
              <Target className="h-5 w-5 mr-2" /> Orientation
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium">Pitch</p>
                <p className="text-xl font-bold">{frisbeeData.orientation.pitch.toFixed(1)}°</p>
              </div>
              <div>
                <p className="text-sm font-medium">Roll</p>
                <p className="text-xl font-bold">{frisbeeData.orientation.roll.toFixed(1)}°</p>
              </div>
            </div>
          </div>
        </div>
        
        {phoneConnected && (
          <div className="mt-4 bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center text-indigo-700 mb-2">
              <Map className="h-5 w-5 mr-2" /> Last Known Location
            </div>
            <p className="text-base">
              <strong>Coordinates:</strong> {frisbeeData.lastLocation.latitude.toFixed(5)}, {frisbeeData.lastLocation.longitude.toFixed(5)}
            </p>
            <p className="text-sm text-gray-600">
              Accuracy: ±{frisbeeData.lastLocation.accuracy.toFixed(1)}m
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Location data shared with phone app
            </p>
          </div>
        )}
      </div>
    );
  };
  
  const renderFlightSummary = () => {
    if (!recordedFlights || recordedFlights.length === 0) return null;
    
    const maxValues = calculateMaxValues();
    
    return (
      <div className="bg-white rounded-lg p-5 shadow">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Disc className="mr-2 h-6 w-6 text-green-500" /> Flight Summary
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-base text-blue-700 mb-1">Max Speed</p>
            <p className="text-2xl font-bold">{maxValues.maxSpeed} mph</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-base text-green-700 mb-1">Max Distance</p>
            <p className="text-2xl font-bold">{maxValues.maxDistance} m</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-base text-purple-700 mb-1">Max Spin Rate</p>
            <p className="text-2xl font-bold">{maxValues.maxSpin}°/s</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-base text-yellow-700 mb-1">Flight Time</p>
            <p className="text-2xl font-bold">{maxValues.flightTime} s</p>
          </div>
        </div>
        
        <div className="mt-6 space-y-3">
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-4 px-6 rounded-xl text-lg font-semibold w-full flex items-center justify-center">
            <Disc className="mr-3 h-5 w-5" /> Save Flight Data
          </button>
          
          {phoneConnected && (
            <button className="bg-purple-500 hover:bg-purple-600 text-white py-4 px-6 rounded-xl text-lg font-semibold w-full flex items-center justify-center">
              <SmartphoneNfc className="mr-3 h-5 w-5" /> Share to Phone App
            </button>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="flex items-center mb-5 bg-white p-4 rounded-lg shadow sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="mr-3 bg-gray-200 p-3 rounded-full"
          aria-label="Go back"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Frisbee Tracker</h1>
      </div>
      
      <div className="space-y-5 pb-20">
        {renderDeviceStatus()}
        {frisbeeData && renderLiveData()}
        {recordedFlights.length > 0 && renderFlightSummary()}
      </div>
    </div>
  );
};

export default FrisbeeTracker;