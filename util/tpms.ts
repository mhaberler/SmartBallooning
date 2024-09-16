import { volt2percent, bytesToMacAddress } from './misc'

export const parseTPMS0100 = function (data : DataView) : any{
    if (data.buffer.byteLength != 18) {
        return {};
    }

    tpms = {}

    tpms.location = data.getUint8(2) & 0x7f;
    tpms.mac = bytesToMacAddress(data, 2);

    tpms.pressure = data.getInt32(8, true) / 100000.0;
    tpms.temperature = data.getInt32(12, true) / 100.0;
    tpms.batpct = data.getUint8(16);
    tpms.status = data.getUint8(17);
    return tpms;
};


// tpmsAd_t tpms_report = {};
// if (len == 15) {
//     tpms_report.pressure = getInt32LE(data, 0);
//     tpms_report.temperature = k0 + getInt32LE(data, 4) / 100.0;
//     tpms_report.batpct = getUint8(data, 5);
//     tpms_report.location = getUint8(data, 6) & 0x7f;
//     tpms_report.status = 0;
//     tpms_report.rssi = msg->rssi;
//     report_tpms(mac, tpms_report);
//     return true;
// }
// return false;
// typedef struct {
//     uint8_t pressure[4];
//     uint8_t temperature[4];
//     uint8_t battery;
//     uint8_t adress[6];
// } tpms172Raw_t;
export const parseTPMS00AC = function (data : DataView) : any{
    if (data.buffer.byteLength != 15) {
        return {};
    }

    tpms = {}
    tpms.pressure = data.getInt32(0, true) / 100000.0;
    tpms.temperature = data.getInt32(4, true) / 100.0 + 273.15;
    tpms.batpct = data.getUint8(8);
    tpms.location = data.getUint8(9) & 0x7f;
    tpms.mac = bytesToMacAddress(data, 9);

    return tpms;
};

