
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
    const [tank5, setTank5] = useState(null);
    const [tank6, setTank6] = useState(null);
    const [pressure1, setPressure1] = useState(null);
    const [pressure2, setPressure2] = useState(null);

    const sensormap = {
        "C2:6E:D1:70:2B:44": { func: setEnvelope, unit: "envelope" },
        "DD:79:C6:8F:BD:A2": { func: setOat, unit: "oat" },

        "E1:75:F6:F1:34:1C": { func: setTank1, unit: "5020/27", aspect: "percent" }, // mystery 
        "82:EA:CA:32:22:4C": { func: setTank1, unit: "5020/27", aspect: "pressure" }, // tpms
        "C7:D8:88:F2:EB:44": { func: setTank1, unit: "5020/27", aspect: "level" }, // mopeka
        "F2:EB:44": { func: setTank1, unit: "5020/27", aspect: "level" }, // mopeka

        "F8:EE:CC:42:AF:8D": { func: setTank2, unit: "5020/16" }, // otodata
        "80:EA:CA:11:79:6F": { func: setPressure2, unit: "5020/16" }, // tpms
        "D8:C6:11:CA:12:55": { func: setTank2, unit: "5020/16" }, // mopeka
        "CA:12:55": { func: setTank2, unit: "5020/16" }, // mopeka


        "EC:A7:32:91:78:E2": { func: setTank3, unit: "5020/24" }, // mopeka
        "91:78:E2": { func: setTank3, unit: "5020/24" }, // mopeka

        "F8:95:D1:79:44:21": { func: setTank4, unit: "5020/15" }, // mopeka
        "79:44:21": { func: setTank4, unit: "5020/15" }, // mopeka

        "CA:E3:54:FA:09:B7": { func: setTank5, unit: "5020/69" }, // mopeka
        "FA:09:B7": { func: setTank5, unit: "5020/69" }, // mopeka

        "E7:38:29:A0:A1:D7": { func: setTank6, unit: "5020/40" }, // mopeka
        "A0:A1:D7": { func: setTank6, unit: "5020/40" }, // mopeka
    }

    function updateCallback(p) {
        // console.log("--- updateCallback(p)" )

        const s = decodeBLE(p);
        const id = s['mac']
        if (id) {
            let desc =  sensormap[id];

            // console.log(s.mac)
            if (sensormap[id]) {
                desc = { unit: sensormap[id].unit}

                console.log(sensormap[id].unit, ":", s)
                sensormap[id].func(s)
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
            scanning, error, envelope, oat,
            tank1, tank2, tank3, tank4, tank5, tank6, pressure1, pressure2
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
