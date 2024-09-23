
import React, { createContext, useState, useContext, useEffect } from 'react';
import {
    // Accelerometer,
    Barometer,
    // DeviceMotion,
    // Gyroscope,
    // LightSensor,
    // Magnetometer,
    // MagnetometerUncalibrated,
    // Pedometer,
} from 'expo-sensors';

const PressureContext = createContext();

export const PressureProvider = ({ children }) => {
    const [pressure, setPressure] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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
                const subscription = Barometer.addListener(pressureData => {
                    setPressure(pressureData);
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
        <PressureContext.Provider value={{ pressure, error, isLoading }}>
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
