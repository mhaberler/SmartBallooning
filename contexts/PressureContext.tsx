
import React, { createContext, useState, useContext, useEffect } from 'react';
import { altitudeISAByPres, windspeedMSToKMH } from 'meteojs/calc.js';
import KalmanFilter from 'kalmanjs';

import {
    // Accelerometer,
    Barometer,
    BarometerMeasurement
    // DeviceMotion,
    // Gyroscope,
    // LightSensor,
    // Magnetometer,
    // MagnetometerUncalibrated,
    // Pedometer,
} from 'expo-sensors';

const PressureContext = createContext();

// Barometer.setUpdateInterval(100);

export const PressureProvider = ({ children }) => {
    const [pressure, setPressure] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [altitude, setAltitude] = useState(0);
    const [lastAltitude, setLastAltitude] = useState(0);
    const [timestamp, setTimestamp] = useState(-1);
    const [vspeed, setVspeed] = useState(0);
    const [vspeedKF, setVspeedKF] = useState(0);

    const getTimestamp = () => { return timestamp; }

    const kf = new KalmanFilter({ R: 0.01, Q: 3 });
    useEffect(() => {
        const subscribe = async () => {
            setIsLoading(true);

            let { status } = await Barometer.isAvailableAsync();
            if (status) {
                setError('pressure sensor not available');
                setIsLoading(false);
                return;
            }
            try {
                const subscription = Barometer.addListener(barometerData => {
                    setPressure(barometerData);
                    const newAltitude = altitudeISAByPres(barometerData.pressure);
                    const newTimestamp = barometerData.timestamp;
                });

                return () => {
                    subscription.remove();
                    Barometer.stop();
                    console.log("Barometer.stop()")
                };
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        subscribe();
    }, []);

    return (
        <PressureContext.Provider value={{ pressure, altitude, vspeed, vspeedKF, error, isLoading }}>
            {children}
        </PressureContext.Provider>
    );
};

export const usePressure = () => {
    const context = useContext(PressureContext);
    if (!context) {
        throw new Error('usePressure must be used within a PressureProvider');
    }
    return context;
};
