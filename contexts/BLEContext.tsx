
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
    const [envelope, setEnvelope] = useState(null);
    const [oat, setOat] = useState(null);
    const [tank1, setTank1] = useState(null);
    const [tank2, setTank2] = useState(null);
    const [tank3, setTank3] = useState(null);
    const [tank4, setTank4] = useState(null);
    const [pressure, setPressure] = useState(null);

    const sensormap = {
        "C2:6E:D1:70:2B:44": setEnvelope,
        "D4:15:5C:77:56:68": setOat,
        "1C:34:F1:F6:75:E1" : setTank1, // mystery
        "F8:EE:CC:42:AF:8D": setTank2,  // otodata

        
        // "6E:8D:17": setTank1,
        // "42:FD:86": setTank2,
        // "9B:EA:A3": setTank3,
        "82:EA:CA:32:22:4C": setPressure
    }

    function updateCallback(p) {
        // console.log("--- updateCallback(p)" )

        const s = decodeBLE(p);
        //  LOG  {"id": "77d0b863-bdb9-e712-bb3b-c5b15959be20", "isConnectable": 1, "localName": "Ruuvi 2B44", "manufacturerData": "9904050fb652ebffff01e00044fc78bd76289440c26ed1702b44", "name": "Ruuvi 2B44", "rssi": -65, "serviceUUIDs": "6e400001-b5a3-f393-e0a9-e50e24dcca9e"}
        // {"accY": 17408, "accZ": 30972, "batpct": 100, "batt": 3115, "hum": 53.0675, "mac": "C2:6E:D1:70:2B:44", "moves": 40, "seq": 37952, "temp": 20.11, "txpwr": 4}
        if (s)
            console.log(s)
        const id = s['mac']
        if (id) {
            // console.log(s.mac)
            if (sensormap[id]) {
                // console.log(s, sensormap[id])
                sensormap[id](s)
            }
        }
        if (!isEmpty(s)) {
            setDevices(JSON.stringify(s));
        }
    }

    useEffect(() => {
        const startBLE = async () => {
            console.log("BLEProvider START")

            try {
                const response = await startScan(scanning,
                    setScanning,
                    devices,
                    scanDuration,
                    updateCallback);
                    console.log("----await startScan done")

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
        <BLEContext.Provider value={{
            scanning, devices, error, envelope, oat,
            tank1, tank2, tank3, tank4
        }}>
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
