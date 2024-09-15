import { Buffer } from 'buffer';
import { parseRuuvi } from './ruuvi'
import { parseMopeka } from './mopeka'



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
            const d = parseRuuvi(data);
            console.log(d)
            break;
        case 0x03b1:  // otodata
            break;
        case 0x0059:  // mopeka
            const m = parseMopeka(data);
            console.log(m)

            break;
        // tpms 1, 2

    }

};

