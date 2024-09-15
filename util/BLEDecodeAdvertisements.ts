import { Buffer } from 'buffer';
import { parseRawRuuvi } from './ruuvi'



export const decodeBLE = (ad) => {
    if (!ad?.manufacturerData)
        return {};
    const data = Buffer.from(ad.manufacturerData, 'hex');
    if (data.length < 2)
        return {};
    const mfId = (data[1] << 8) | (data[0] & 0xff);
    // console.log("mfid: " + mfId.toString(16))
    switch (mfId) {
        case 0x0499:  // ruuvi
            const d = parseRawRuuvi(data);
            console.log(d)
            break;
        case 0x03b1:  // otodata
            break;
        case 0x0059:  // mopeka
            break;
        // tpms 1, 2

    }

};

