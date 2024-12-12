import { volt2percent, bytesToMacAddress } from './misc'

export const parseTPMS0100 = function (data : DataView, ad: Object) : any{
    if (data.buffer.byteLength != 18) {
        return {};
    }

    tpms =  { type: 'tpms'}

    tpms.location = data.getUint8(2) & 0x7f;
    tpms.mac = bytesToMacAddress(data, 2);

    tpms.pressure = data.getInt32(8, true) / 100000.0;
    tpms.temperature = data.getInt32(12, true) / 100.0;
    tpms.batpct = data.getUint8(16);
    tpms.status = data.getUint8(17);
    if (ad?.rssi)
        tpms.rssi = ad.rssi;
    return tpms;
};



export const parseTPMS00AC = function (data : DataView, ad: Object) : any{
    if (data.buffer.byteLength != 15) {
        return {};
    }

    tpms = { type: 'tpms'}
    tpms.pressure = data.getInt32(0, true) / 100000.0;
    tpms.temperature = data.getInt32(4, true) / 100.0 + 273.15;
    tpms.batpct = data.getUint8(8);
    tpms.location = data.getUint8(9) & 0x7f;
    tpms.mac = bytesToMacAddress(data, 9);
    if (ad?.rssi)
        tpms.rssi = ad.rssi;
    return tpms;
};

