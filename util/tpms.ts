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

