import { volt2percent, bytesToMacAddress } from './misc'

// https://docs.ruuvi.com/communication/bluetooth-advertisements/data-format-5-rawv2
export const parseRuuvi = function (data: DataView): any {

    if (data.buffer.byteLength != 26)
        return false;
    if (data.getUint8(2) != 5) {
        // old ruuvi fw
        return {};
    }
    const ruuvi = {};
    let v = data.getInt16(3)
    if (v != 0x8000) {
        ruuvi.temp = v * 0.005;
    }
    v = data.getUint16(5);
    if (v != 65535) {
        ruuvi.hum = v / 400.0;
    }
    v = data.getUint16(7);
    if (v != 65535) {
        ruuvi.press = v + 50000;
    }
    v = data.getInt16(9, true);
    if (v != 0x8000) {
        ruuvi.accY = v;
    }
    v = data.getInt16(11, true);
    if (v != 0x8000) {
        ruuvi.accY = v;
    }
    v = data.getInt16(13, true);
    if (v != 0x8000) {
        ruuvi.accZ = v;
    }
    const powerInfo = data.getUint16(15);
    v = (powerInfo >>> 5) + 1600; // bat mV
    if (v != 2047) {
        ruuvi.batt = v;
        ruuvi.batpct = volt2percent(ruuvi.batt / 1000);
    }
    v = (powerInfo & 0b11111) * 2 - 40;
    if (v != 31) {
        ruuvi.txpwr = v;
    }
    v = data.getUint8(17);
    if (v != 255) {
        ruuvi.moves = v;
    }
    v = data.getUint16(18);
    if (v != 65535) {
        ruuvi.seq = v;
    }
    ruuvi.mac = bytesToMacAddress(data, 20);
    return ruuvi;
};

