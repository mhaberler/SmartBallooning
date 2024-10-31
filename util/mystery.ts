import { volt2percent, bytesToMacAddress } from './misc'

export const parseMystery = function (data : DataView) : any{
    if (data.buffer.byteLength != 21) {
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

