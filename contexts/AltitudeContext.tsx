import React, { createContext, useContext, useState, useEffect } from 'react';
import { Barometer } from 'expo-sensors';
import { altitudeISAByPres, windspeedMSToKMH } from 'meteojs/calc.js';


const AltitudeContext = createContext();


export const AltitudeProvider = ({ children }) => {
    const [pressure, setPressure] = useState(0);
    const [altitude, setAltitude] = useState(0);
    const [verticalSpeed, setVerticalSpeed] = useState(0);
    const [lastTimestamp, setLastTimestamp] = useState(0);
    const [timestamp, setTimestamp] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getlastTimestamp = (() => { return lastTimestamp });

    const subscribe = async () => {
        setIsLoading(true);
        let { status } = await Barometer.isAvailableAsync();
        if (status) {
            setError('pressure sensor not available');
            setIsLoading(false);
            return;
        }
        try {
            const subscription = Barometer.addListener(({ pressure: newPressure, timestamp: newTimestamp }) => {
                setPressure(newPressure);
                setTimestamp(newTimestamp);
            });
            return () => {
                subscription.remove();
                Barometer.stop();
            };
        } catch (err) {
            setError(err.message);
        } finally {
            Barometer.setUpdateInterval(200);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        subscribe();
    }, []);

    useEffect(() => {
        const timeDiff = (timestamp - lastTimestamp);
        const newAltitude = altitudeISAByPres(pressure);
        const altitudeChange = newAltitude - altitude;
        const speed = altitudeChange / timeDiff; // meters per second
        setVerticalSpeed(speed);
        setLastTimestamp(timestamp)
        setAltitude(newAltitude)
    }, [timestamp]);

    return (
        <AltitudeContext.Provider value={{ pressure, altitude, verticalSpeed, error, isLoading, lastTimestamp }}>
            {children}
        </AltitudeContext.Provider>
    );
};

export const useAltitude = () => useContext(AltitudeContext);

