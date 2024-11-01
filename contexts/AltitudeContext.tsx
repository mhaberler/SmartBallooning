import React, { useEffect, useState, useContext } from 'react';
import { Barometer } from 'expo-sensors';

const AltitudeContext = React.createContext();

const AltitudeProvider = ({ children }) => {
  const [altitude, setAltitude] = useState(0);
  const [lastAltitude, setLastAltitude] = useState(0);
  const [verticalSpeed, setVerticalSpeed] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [timestamp, setTimestamp] = useState(0);
  const [lastTimestamp, setLastTimestamp] = useState(0);

  const pressureToAltitude = (pressure) => {
    // Simplified barometric formula for sea-level pressure of 1013.25 hPa
    // This formula might not be very accurate for real-world applications
    return 44330 * (1 - Math.pow(pressure / 1013.25, 0.1903));
  };

  useEffect(() => {
    Barometer.isAvailableAsync().then(available => {
      if (available) {
        const newSubscription = Barometer.addListener(({ pressure, timestamp }) => {
          // setLastTimestamp()
          setTimestamp(timestamp);
          const newAltitude = pressureToAltitude(pressure);
          const timeDiff = 1; // Assuming 1 second interval for simplicity
          const speed = (newAltitude - lastAltitude) / timeDiff;
          
          setAltitude(newAltitude);
          setLastAltitude(newAltitude);
          setVerticalSpeed(speed); // meters per second
        });
        setSubscription(newSubscription);
      }
    });

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // Here we're updating vertical speed every time altitude changes
  useEffect(() => {
    if (altitude !== lastAltitude) {
      const timeDiff = 1; // Assuming 1 second interval
      const speed = (altitude - lastAltitude) / timeDiff;
      setVerticalSpeed(speed);
      setLastAltitude(altitude);
      console.log(altitude, speed)
    }
  }, [altitude, timestamp]);

  return (
    <AltitudeContext.Provider value={{ altitude, verticalSpeed }}>
      {children}
    </AltitudeContext.Provider>
  );
};

const useAltitude = () => {
    const context = useContext(AltitudeContext);
    if (!context) {
        throw new Error('useAltitude must be used within a AltitudeProvider');
    }
    return context;
};

export { AltitudeProvider, AltitudeContext, useAltitude};