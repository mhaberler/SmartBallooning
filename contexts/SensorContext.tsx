import React, { createContext, useContext, useState, useEffect } from 'react';
import { Barometer } from 'expo-sensors';
import { altitudeISAByPres, windspeedMSToKMH } from 'meteojs/calc.js';
import KalmanFilter from 'kalmanjs';

// Create a context for sensor data
const SensorContext = createContext();

export const SensorProvider = ({ children }) => {
  const [pressure, setPressure] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [verticalSpeed, setVerticalSpeed] = useState(0);
  const [lastTimestamp, setLastTimestamp] = useState(Date.now());

  useEffect(() => {
    const subscription = Barometer.addListener(({ pressure: newPressure, timestamp }) => {
      const currentTimestamp = timestamp || Date.now();
      const timeDiff = (currentTimestamp - lastTimestamp); 

      // Assuming standard atmospheric conditions where 
      // every 1 mbar change in pressure equates to roughly 8.5 meters of altitude change
      const altitudeChange = (pressure - newPressure) * 8.5; // in meters
      const speed = altitudeChange / timeDiff; // meters per second

      setPressure(newPressure);
      setVerticalSpeed(speed);
      setLastTimestamp(currentTimestamp);
      setAltitude(altitudeISAByPres(newPressure))
    });

    // Start the barometer
    Barometer.setUpdateInterval(1000); // Update every 500ms

    // Clean up
    return () => subscription.remove();
  }, [pressure]);

  return (
    <SensorContext.Provider value={{ pressure, altitude, verticalSpeed }}>
      {children}
    </SensorContext.Provider>
  );
};

export const useSensor = () => useContext(SensorContext);