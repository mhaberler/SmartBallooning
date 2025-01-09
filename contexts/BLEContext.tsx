
import React, { createContext, useState, useContext, useEffect } from 'react';
import { startScan, stopScan, clearSensors } from '../util/BLE';
import { decodeBLE } from '../util/BLEDecodeAdvertisements';

const BLEContext = createContext(null);

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

    const mac2unit = {
        "C2:6E:D1:70:2B:44": "envelope",
        "DD:79:C6:8F:BD:A2": "oat",

        "E1:75:F6:F1:34:1C": "5020/27",
        "82:EA:CA:32:22:4C": "5020/27",
        "C7:D8:88:F2:EB:44": "5020/27",
        "F2:EB:44": "5020/27",

        "F8:EE:CC:42:AF:8D": "5020/16",
        "80:EA:CA:11:79:6F": "5020/16",
        "D8:C6:11:CA:12:55": "5020/16",
        "CA:12:55": "5020/16",

        "EC:A7:32:91:78:E2": "5020/24",
        "91:78:E2": "5020/24",

        "F8:95:D1:79:44:21": "5020/15",
        "79:44:21": "5020/15",

        "CA:E3:54:FA:09:B7": "5020/69",
        "FA:09:B7": "5020/69",

        "E7:38:29:A0:A1:D7": "5020/40",
        "A0:A1:D7": "5020/40",
    }


    const unitmap = {
        "envelope": { func: setEnvelope, sensors: {} },
        "oat": { func: setOat, sensors: {} },
        "5020/27": { func: setTank1, sensors: {} },
        "5020/16": { func: setTank2, sensors: {} },
        "5020/24": { func: setTank3, sensors: {} },
        "5020/15": { func: setTank4, sensors: {} },
        "5020/69": { func: setTank5, sensors: {} },
        "5020/40": { func: setTank6, sensors: {} },
    }


    // const sensormap = {
    //     "C2:6E:D1:70:2B:44": { func: setEnvelope, sensors: {}, unit: "envelope" },
    //     "DD:79:C6:8F:BD:A2": { func: setOat, sensors: {}, unit: "oat" },

    //     "E1:75:F6:F1:34:1C": { func: setTank1, sensors: {}, unit: "5020/27" }, // mystery 
    //     "82:EA:CA:32:22:4C": { func: setTank1, sensors: {}, unit: "5020/27" }, // tpms
    //     "C7:D8:88:F2:EB:44": { func: setTank1, sensors: {}, unit: "5020/27" }, // mopeka
    //     "F2:EB:44": { func: setTank1, sensors: {}, unit: "5020/27" }, // mopeka

    //     "F8:EE:CC:42:AF:8D": { func: setTank2, sensors: {}, unit: "5020/16" }, // otodata
    //     "80:EA:CA:11:79:6F": { func: setTank2, sensors: {}, unit: "5020/16" }, // tpms
    //     "D8:C6:11:CA:12:55": { func: setTank2, sensors: {}, unit: "5020/16" }, // mopeka
    //     "CA:12:55": { func: setTank2, sensors: {}, unit: "5020/16" }, // mopeka


    //     "EC:A7:32:91:78:E2": { func: setTank3, sensors: {}, unit: "5020/24" }, // mopeka
    //     "91:78:E2": { func: setTank3, sensors: {}, unit: "5020/24" }, // mopeka

    //     "F8:95:D1:79:44:21": { func: setTank4, sensors: {}, unit: "5020/15" }, // mopeka
    //     "79:44:21": { func: setTank4, sensors: {}, unit: "5020/15" }, // mopeka

    //     "CA:E3:54:FA:09:B7": { func: setTank5, sensors: {}, unit: "5020/69" }, // mopeka
    //     "FA:09:B7": { func: setTank5, sensors: {}, unit: "5020/69" }, // mopeka

    //     "E7:38:29:A0:A1:D7": { func: setTank6, sensors: {}, unit: "5020/40" }, // mopeka
    //     "A0:A1:D7": { func: setTank6, sensors: {}, unit: "5020/40" }, // mopeka
    // }



    function updateCallback(p) {
        // console.log("--- updateCallback(p)" )

        const s = decodeBLE(p);
        const id = s['mac']
        const unitName = mac2unit[id] 

        if (unitName && unitmap[unitName]) {
            s.lastheard = Date.now();
            unitmap[unitName].sensors[s.type] = s
            unitmap[unitName].unit = unitName

            //{ ... sensormap[id].sensors, ...s}
            let o = unitmap[unitName]
            console.log(unitName, ":", o)

            unitmap[unitName].func(o)
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
            tank1, tank2, tank3, tank4, tank5, tank6
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
