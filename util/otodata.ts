// import { volt2percent, bytesToMacAddress } from './misc'

export const parseOtodata = function (data: DataView): any {
    otodata = {}

    // LOG  {"advertisement": "02010616ffb1034f544f54454c4502007a26000034650f00000017096c6576656c3a2039382e35202520766572746963616c", 
    // "id": "D8:2C:C3:C6:5D:32", "isConnectable": true,
    //  "localName": "level: 98.5 % vertical", 
    //  "manufacturerData": "b1 03 4f 54 4f 54 45 4c 45 02 00 7a 26 00 00 34 65 0f 00 00 00", 
    //  ------------------------------------------------------level
    //  ------------------------------------------------------------status
    //  "name": "unit sleeping", "rssi": -69, "serviceUUIDs": [], "txPowerLevel": null}
    // LOG  21
    // LOG  {"level": 98.5, "status": 0}
    // >>> hex(9850) '0x267a'

    if (data.buffer.byteLength == 21) {
        otodata.level = data.getUint16(11, true) / 100.0;
        otodata.status = data.getUint16(13, true);
    }
    if (data.buffer.byteLength == 24) {

        // LOG  {
        //     "id": "F8:EE:CC:42:AF:8D", "isConnectable": true,
        //      "localName": "unit sleeping", 
        //      "manufacturerData": "b1 03 4f 54 4f 33 32 38 31 48 84 56 03 13 21 11 01 04 00 02 2a f2 03 04", 
        //      ---------------------------------------
        //      "name": "level: 91.2 % vertical", "rssi": -79, "serviceUUIDs": [], "txPowerLevel": null}


        // OG  {"advertisement": "02010619ffb1034f544f33323831ff835603132111010400022af2030417096c6576656c3a2039382e34202520766572746963616c",
        //      "localName": "level: 98.4 % vertical", 
        //      "manufacturerData": "b1 03 4f 54 4f 33 32 38 31 ff 83 56 03 13 21 11 01 04 00 02 2a f2 03 04", 
        //      ------------------------------------------------s e r i a l
        //      ------------------------------------------------------------------------------------model
        //      "name": "unit sleeping", "rssi": -77, "serviceUUIDs": [], "txPowerLevel": null}
        //  LOG  24
        //  LOG  {"serial": 56001535}   '0x03 56 83 ff'
        // >>> hex(9840) '0x26 70

        // LOG  24
        // >>> hex(56001535) '0x35683ff'
        // >>> hex(56001608) '0x3568448'
        // >>> hex(1010) '0x3 f2'
        otodata.serial = data.getUint32(9, true).toString(10)
        otodata.model = data.getUint16(21, true).toString(10)
    }
    return otodata;
};
