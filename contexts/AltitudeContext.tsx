import React, { createContext, useContext, useState, useEffect } from 'react';
import { Barometer } from 'expo-sensors';
import { altitudeISAByPres, windspeedMSToKMH } from 'meteojs/calc.js';
import BalloonEKF from '../util/BalloonEKF';

const AltitudeContext = createContext();


export const AltitudeProvider = ({ children }) => {
    const [pressure, setPressure] = useState(0);
    const [altitude, setAltitude] = useState(0);
    const [verticalSpeed, setVerticalSpeed] = useState(0);
    const [lastTimestamp, setLastTimestamp] = useState(0);
    const [timestamp, setTimestamp] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [ekf] = useState(() => new BalloonEKF());
    const [state, setState] = useState({
        altitude: 0,
        velocity: 0,
        acceleration: 0,
        burnerGain: 0,
        isDecelerating: false,
        timeToZeroSpeed: 0,
        zeroSpeedAltitude: 0,
        zeroSpeedValid: false,
    });


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

        const loudness = 0.0;
        const burnerDuration = 0.0;
        ekf.processMeasurement(timeDiff, newAltitude, loudness, burnerDuration);
        // Update state with EKF estimates
        const decelInfo = ekf.isDecelerating();
        const zeroSpeedInfo = ekf.getZeroSpeedAltitude();
        setState({
            altitude: ekf.getAltitude(),
            velocity: ekf.getVelocity(),
            acceleration: ekf.getAcceleration(),
            burnerGain: ekf.getBurnerGain(),
            isDecelerating: decelInfo.isDecelerating,
            timeToZeroSpeed: decelInfo.timeToZeroSpeed,
            zeroSpeedAltitude: zeroSpeedInfo.altitude,
            zeroSpeedValid: zeroSpeedInfo.valid,
        });
    }, [timestamp]);

    return (
        <AltitudeContext.Provider value={{ pressure, altitude, verticalSpeed, error, isLoading, lastTimestamp, state }}>
            {children}
        </AltitudeContext.Provider>
    );
};

export const useAltitude = () => useContext(AltitudeContext);

