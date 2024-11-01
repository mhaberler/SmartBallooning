import React, { createContext, useContext, useState, useEffect } from 'react';
import { Barometer } from 'expo-sensors';
import { altitudeISAByPres, windspeedMSToKMH } from 'meteojs/calc.js';
import KalmanFilter from 'kalmanjs';

const SensorContext = createContext();
//const kf = new KalmanFilter();


const kf = new KalmanFilter({
    // R: 0.4,
    // Q: 2,
    //  A: 0.5, 
    // C: 0.5
});

console.log("---kf init")
export const SensorProvider = ({ children }) => {
    const [pressure, setPressure] = useState(0);
    const [altitude, setAltitude] = useState(0);
    const [verticalSpeed, setVerticalSpeed] = useState(0);
    const [verticalSpeedKF, setVerticalSpeedKF] = useState(0);
    const [lastTimestamp, setLastTimestamp] = useState(0);
    const [timestamp, setTimestamp] = useState(0);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);



    const getlastTimestamp = (() => { return lastTimestamp });

    const subscribe = async () => {
        console.log("---subscribe")

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
                console.log("Barometer.stop()")
            };
        } catch (err) {
            setError(err.message);
        } finally {
            Barometer.setUpdateInterval(500);
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
        const speedKF = kf.filter(speed)

        // console.log(timeDiff, speed, speedKF)
        setVerticalSpeedKF(speedKF)

        setLastTimestamp(timestamp)
        setAltitude(newAltitude)
    }, [timestamp]);

    return (
        <SensorContext.Provider value={{ pressure, altitude, verticalSpeed, verticalSpeedKF, error, isLoading, lastTimestamp }}>
            {children}
        </SensorContext.Provider>
    );
};

export const useSensor = () => useContext(SensorContext);


// const timeDiff = (currentTimestamp -lastTimestamp); //  getlastTimestamp());
// const newAltitude = altitudeISAByPres(newPressure);

// const altitudeChange = newAltitude - altitude;
// const speed = altitudeChange / timeDiff; // meters per second

// setVerticalSpeedKF(kf.filter(speed))
// setPressure(newPressure);
// setAltitude(newAltitude);

// setVerticalSpeed(speed);
// setLastTimestamp(currentTimestamp);
// setAltitude(altitudeISAByPres(newPressure))
// // console.log("---",verticalSpeed, verticalSpeedKF, timeDiff, lastTimestamp, getlastTimestamp(), currentTimestamp)
// console.log("---", timeDiff, lastTimestamp,  currentTimestamp)
