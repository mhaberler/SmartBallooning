import { Buffer } from 'buffer';
import { parseRuuvi } from './ruuvi'
import { parseMopeka } from './mopeka'
import { parseTPMS0100 } from './tpms'


export const decodeBLE = (ad) => {
    if (!ad?.manufacturerData)
        return {};
    const data = Buffer.from(ad.manufacturerData, 'hex');
    if (data.length < 2)
        return {};
    const view = new DataView(data.buffer);

    const mfId = view.getInt16(0, true); // (data[1] << 8) | (data[0] & 0xff);
    // console.log("mfid: " + mfId.toString(16))
    // console.log(ad)
    let t = {}
    switch (mfId) {
        // case 0x0499:  // ruuvi
        // console.log(view.buffer.byteLength)
        // t = parseRuuvi(view);
        // console.log(t)
        // break;
        // case 0x03b1:  // otodata
        //     break;
        // case 0x0059:  // mopeka
        //     console.log(ad)
        //     t = parseMopeka(view);
        //     console.log(t)
        //     break;
        case 0x0100: // TPMS manufacturer ID variant 1
            console.log(ad)
            console.log(view.buffer.byteLength)
            t = parseTPMS0100(view);
            console.log(t)


            break;
            // case 0x00AC: // TPMS manufacturer ID variant 2
            break;
        // tpms 1, 2

    }


};

