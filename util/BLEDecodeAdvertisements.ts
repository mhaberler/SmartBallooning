import { Buffer } from 'buffer';
import { parseRuuvi } from './ruuvi'
import { parseMopeka } from './mopeka'
import { parseTPMS0100, parseTPMS00AC } from './tpms'
import { parseOtodata } from './otodata'
import { parseMystery } from './mystery'

export const decodeBLE = (ad) => {
    if (!ad?.manufacturerData)
        return {};
    const data = Buffer.from(ad.manufacturerData, 'hex');
    if (data.length < 2)
        return {};
    const view = new DataView(data.buffer);
    const mfId = view.getInt16(0, true);

    // console.log("mfid: " + mfId.toString(16), view.buffer.byteLength)


    let t = {}
    switch (mfId) {
        case 0x0499:  // ruuvi
            t = parseRuuvi(view, ad);
            break;
        case 0x03b1:  // otodata
            t = parseOtodata(view, ad);
            break;
        case 0x0059:  // mopeka
            t = parseMopeka(view, ad);
            break;
        case 0x0100: // TPMS manufacturer ID variant 1
            t = parseTPMS0100(view, ad);
            break;
        case 0x00AC: // TPMS manufacturer ID variant 2
            t = parseTPMS00AC(view, ad);
            break;
        case -1: // mystery sensor
            t = parseMystery(view, ad);
            break;
        default: ;
    }
    return t;
};

