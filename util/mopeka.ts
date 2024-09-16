import { volt2percent } from './misc'

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
} ;

const MOPEKA_TANK_LEVEL_COEFFICIENTS_PROPANE_0 = 0.573045;
const MOPEKA_TANK_LEVEL_COEFFICIENTS_PROPANE_1 = -0.002822;
const MOPEKA_TANK_LEVEL_COEFFICIENTS_PROPANE_2 = -0.00000535;

export const parseMopeka = function (data : Uint8Array) {

    if (data.length != 12) {
        console.log("mopeka: incorrect length adv")
        return {};
    }
    ma = {}

    ma.battery = (data[3] & 0x7f) / 32.0;
    ma.batpct = volt2percent(ma.battery);

    ma.syncPressed = (data[4] & 0x80) > 0;
    ma.raw_temp = (data[4] & 0x7f);
    ma.temperature = ma.raw_temp - 40; // °C
    ma.qualityStars = (data[6] >> 6);

    ma.acceloX = data[10];
    ma.acceloY = data[11];

    ma.raw_level = ((data[6] << 8) + data[5]) & 0x3fff;
    ma.level = ma.raw_level *
               (MOPEKA_TANK_LEVEL_COEFFICIENTS_PROPANE_0 +
                (MOPEKA_TANK_LEVEL_COEFFICIENTS_PROPANE_1 * ma.raw_temp) +
                (MOPEKA_TANK_LEVEL_COEFFICIENTS_PROPANE_2 * ma.raw_temp *
                 ma.raw_temp));
    return ma;
};

