import { volt2percent } from './misc'


// LOG  000182eaca32224c96e40e00020a00005801
// LOG  {"batpct": 88, "location": 2, "pressure": -17634.39104, "status": 1, "temperature": 342097.92}

// LOG  {"advertisement": "0201050303b0fb13ff000182eaca32224c43c30e00e909000058010d0954504d53335f333232323443", "id": "82:EA:CA:32:22:4C",
//  "isConnectable": false, "localName": "TPMS3_32224C", 
// "manufacturerData": "0001 82 eaca32224c 43c30e00 e90900005801", "name": "TPMS3_32224C", "rssi": -74, "serviceUUIDs": "fbb0", "txPowerLevel": null}
// LOG  {"batpct": 88, "location": 2, "pressure": 11368.56576, "status": 1, "temperature": -3852861.44}


export const parseTPMS0100 = function (data : Uint8Array) {
    if (data.length != 18) {
        console.log("parseTPMS0100: incorrect length adv")
        return {};
    }
    const view = new DataView(data.buffer);

    tpms = {}

    tpms.location = view.getUint8(2) & 0x7f
    tpms.pressure = view.getInt32(8) / 100000.0;
    tpms.temperature = view.getInt32(12) / 100.0;
    tpms.batpct = view.getUint8(16);
    tpms.status = view.getUint8(17);
    return tpms;
};

