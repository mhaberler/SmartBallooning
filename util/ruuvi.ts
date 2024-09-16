import { volt2percent, int2Hex } from './misc'

export const parseRuuvi = function (data : Uint8Array) : any {
    if (data[2] != 5) {
        // old ruuvi fw
        return {};
    }
    const ruuvi = {};

    let temperature = (data[3] << 8) | (data[4] & 0xff);
    if (temperature > 32767) {
        temperature -= 65534;
    }
    ruuvi.temperature = temperature / 200.0;

    ruuvi.humidity = (((data[5] & 0xff) << 8) | (data[6] & 0xff)) / 400.0;
    ruuvi.pressure = (((data[7] & 0xff) << 8) | (data[8] & 0xff)) + 50000;

    let accelerationX = (data[9] << 8) | (data[10] & 0xff);
    if (accelerationX > 32767) accelerationX -= 65536; // two's complement
    ruuvi.accelerationX = accelerationX;

    let accelerationY = (data[11] << 8) | (data[12] & 0xff);
    if (accelerationY > 32767) accelerationY -= 65536; // two's complement
    ruuvi.accelerationY = accelerationY;

    let accelerationZ = (data[13] << 8) | (data[14] & 0xff);
    if (accelerationZ > 32767) accelerationZ -= 65536; // two's complement
    ruuvi.accelerationZ = accelerationZ;

    const powerInfo = ((data[15] & 0xff) << 8) | (data[16] & 0xff);
    ruuvi.battery = (powerInfo >>> 5) + 1600;
    ruuvi.batpct = volt2percent(ruuvi.battery/1000);
    ruuvi.txPower = (powerInfo & 0b11111) * 2 - 40;
    ruuvi.movementCounter = data[17] & 0xff;
    ruuvi.measurementSequenceNumber = ((data[18] & 0xff) << 8) | (data[19] & 0xff);
    ruuvi.mac = [
        int2Hex(data[20]),
        int2Hex(data[21]),
        int2Hex(data[22]),
        int2Hex(data[23]),
        int2Hex(data[24]),
        int2Hex(data[25]),
    ].join(":");
    return ruuvi;
};

