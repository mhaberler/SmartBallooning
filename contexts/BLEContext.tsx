
import React, { createContext, useState, useContext, useEffect } from 'react';

import { startScan, stopScan, clearSensors, strengthHeuristics } from '../util/BLE';

const BLEContext = createContext();

let devices = [];
let scanDuration = 0;

function updateCallback(p) {
    console.log(p)
}

export const BLEProvider = ({ children }) => {
    const [scanning, setScanning] = useState(false);
    const [devices, setDevices] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const startBLE = async () => {
            let { status } = await startScan(scanning,
                setScanning,
                devices,
                scanDuration,
                updateCallback);
            if (status) {
                setError('BLE failed to start');
                setScanning(false);
                return;
            }
        };
        startBLE();
        return () => {
            stopScan();
        };
    }, []);

    return (
        <BLEContext.Provider value={{ scanning, devices, error }}>
            {children}
        </BLEContext.Provider>
    );
};

export const useBLE = () => {
    const context = useContext(BLEContext);
    if (!context) {
        throw new Error('useBLE must be used within a BLEProvider');
    }
    return context;
};
