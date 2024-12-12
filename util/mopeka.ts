import { volt2percent, bytesToMacAddress } from './misc'

enum mopekaHwOID {
    // Gen2/Standard
    STD = 2,
    XL = 3,
    BMPRO_STD = 70,

    // Pro Family IDs offset by 256 to separate from standard sensors
    UNKNOWN = 0 | 0x100, // If PRO is reporting this, it likely indicates an
    // obscure hardware issue
    VERTRAX_STANDARD = 1 | 0x100,
    VERTRAX_BULK = 2 | 0x100,
    PRO_MOPEKA = 3 | 0x100, // Mopeka PRO LPG sensor
    TOPDOWN = 4 | 0x100, // This will is currently both the top-down water and air
    // sensor, but will likely break it out in the future
    PRO_H2O = 5 | 0x100, // This is the PRO sensor, but with hwid for doing
    // bottom-up assumed in a water tank
    PRO_LIPPERT_LPG = 6 | 0x100,     // Lippert private labeled LPG sensor
    PRO_DOMETIC_LPG = 7 | 0x100,     // Dometic private labeled LPG sensor
    PRO_PLUS_BLE_LPG = 8 | 0x100,    // Mopeka PRO+ LPG sensor, BLE boosted
    PRO_PLUS_CELL_LPG = 9 | 0x100,   // Mopeka PRO+ LPG sensor, Cellular
    PRO_PLUS_BLE_TD40 = 10 | 0x100,  // Mopeka PRO+ TD40 LPG sensor, BLE booster
    PRO_PLUS_CELL_TD40 = 11 | 0x100, // Mopeka PRO+ TD40 LPG sensor, Cellular
};

// https://github.com/Bluetooth-Devices/mopeka-iot-ble/blob/main/src/mopeka_iot_ble/parser.py
// # converting sensor value to height
// MOPEKA_TANK_LEVEL_COEFFICIENTS = {
//     MediumType.PROPANE: (0.573045, -0.002822, -0.00000535),
//     MediumType.AIR: (0.153096, 0.000327, -0.000000294),
//     MediumType.FRESH_WATER: (0.600592, 0.003124, -0.00001368),
//     MediumType.WASTE_WATER: (0.600592, 0.003124, -0.00001368),
//     MediumType.LIVE_WELL: (0.600592, 0.003124, -0.00001368),
//     MediumType.BLACK_WATER: (0.600592, 0.003124, -0.00001368),
//     MediumType.RAW_WATER: (0.600592, 0.003124, -0.00001368),
//     MediumType.GASOLINE: (0.7373417462, -0.001978229885, 0.00000202162),
//     MediumType.DIESEL: (0.7373417462, -0.001978229885, 0.00000202162),
//     MediumType.LNG: (0.7373417462, -0.001978229885, 0.00000202162),
//     MediumType.OIL: (0.7373417462, -0.001978229885, 0.00000202162),
//     MediumType.HYDRAULIC_OIL: (0.7373417462, -0.001978229885, 0.00000202162),
// }
// DEVICE_TYPES = {
//     0x3: MopekaDevice("M1017", "Pro Check", 10),
//     0x4: MopekaDevice("Pro-200", "Pro-200", 10),
//     0x5: MopekaDevice("Pro H20", "Pro Check H2O", 10),
//     0x6: MopekaDevice("M1017", "Lippert BottleCheck", 10),
//     0x8: MopekaDevice("M1015", "Pro Plus", 10),
//     0x9: MopekaDevice("M1015", "Pro Plus with Cellular", 10),
//     0xA: MopekaDevice("TD40/TD200", "TD40/TD200", 10),
//     0xB: MopekaDevice("TD40/TD200", "TD40/TD200 with Cellular", 10),
//     0xC: MopekaDevice("M1017", "Pro Check Universal", 10),
// }
// SERVICE_UUID = "0000fee5-0000-1000-8000-00805f9b34fb"

const MOPEKA_TANK_LEVEL_COEFFICIENTS_PROPANE_0 = 0.573045;
const MOPEKA_TANK_LEVEL_COEFFICIENTS_PROPANE_1 = -0.002822;
const MOPEKA_TANK_LEVEL_COEFFICIENTS_PROPANE_2 = -0.00000535;

export const parseMopeka = function (data: DataView, ad: Object): any {
    if (data.buffer.byteLength != 12)
        return {};
    mopeka = {}

    mopeka.batt = (data.getUint8(3) & 0x7f) / 32.0;
    mopeka.batpct = volt2percent(mopeka.batt);
    let v = data.getUint8(4)
    mopeka.syncPressed = (v & 0x80) > 0;
    mopeka.raw_temp = (v & 0x7f);
    mopeka.temperature = mopeka.raw_temp - 40; // °C
    mopeka.qualityStars = (data.getUint8(6) >> 6);

    mopeka.accX = data.getUint8(10);
    mopeka.accY = data.getUint8(11);

    mopeka.raw_level = data.getUint16(5, true) & 0x3fff; 
    mopeka.level = mopeka.raw_level *
        (MOPEKA_TANK_LEVEL_COEFFICIENTS_PROPANE_0 +
            (MOPEKA_TANK_LEVEL_COEFFICIENTS_PROPANE_1 * mopeka.raw_temp) +
            (MOPEKA_TANK_LEVEL_COEFFICIENTS_PROPANE_2 * mopeka.raw_temp *
                mopeka.raw_temp));

    mopeka.level = Math.round(mopeka.level * 10) / 10
    mopeka.mac = bytesToMacAddress(data, 7, 3);
    if (ad?.rssi)
        mopeka.rssi = ad.rssi;
    return mopeka;
};

