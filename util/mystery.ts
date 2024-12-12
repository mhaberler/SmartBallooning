import { volt2percent, bytesToMacAddress } from './misc'

export const parseMystery = function (data : DataView, ad: Object) : any{

    if (data.buffer.byteLength != 12) {
        return {};
    }
    mystery = {}
    mystery.mac = bytesToMacAddress(data, 2);
    let level = data.getInt16(8, true);
    if (level == -32768) {
        mystery.status = "no sensor"
    } else {
        mystery.status = "OK"
        mystery.percent = level
    }
    if (level == 10000) {
        mystery.status = "full"
        mystery.percent = level / 100
    }
    if (ad?.rssi)
        mystery.rssi = ad.rssi;
    mystery.buttonPressed = ad.isConnectable;
    mystery.name = ad.name;
    mystery.txPowerLevel = ad.txPowerLevel;

    mystery.voltage = data.getInt16(10, true) / 1000.0;
    mystery.batpct = volt2percent(mystery.voltage);

    // console.log("----- mystery", JSON.stringify(mystery))

    return mystery;
};

