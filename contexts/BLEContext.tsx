
import React, { createContext, useState, useContext, useEffect } from 'react';

import { startScan, stopScan, clearSensors, strengthHeuristics } from '../util/BLE';
import { decodeBLE } from '../util/BLEDecodeAdvertisements';

const BLEContext = createContext();

let scanDuration = 0;

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

export const BLEProvider = ({ children }) => {
    const [scanning, setScanning] = useState(false);
    const [devices, setDevices] = useState("");
    const [error, setError] = useState(null);

    function updateCallback(p) {

        const s = decodeBLE(p);
        // console.log(p, s)
        if (!isEmpty(s)) {
            setDevices(JSON.stringify(s));
        }
    }

    useEffect(() => {
        const startBLE = async () => {
            try {
                const response = await startScan(scanning,
                    setScanning,
                    devices,
                    scanDuration,
                    updateCallback);
            } catch (e) {
                setError('BLE failed to start');
                setScanning(false);
                console.error(e);
            }
        };

        startBLE();
        return () => {
            console.log("BLEProvider shutdown")
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
