import { Buffer } from 'buffer';

function int2Hex(str) {
    return ("0" + str.toString(16).toUpperCase()).slice(-2);
}

function vol2percent(voltage) {
    // Define the full charge and end-of-life voltages
    const fullChargeVoltage = 3.0; // Volts
    const endOfLifeVoltage = 2.0; // Volts, can be adjusted based on device requirements

    // Ensure voltage is within a reasonable range
    if (voltage > fullChargeVoltage) {
        return 100; // Battery is at full charge or overcharged
    } else if (voltage <= endOfLifeVoltage) {
        return 0; // Battery is considered dead
    }

    // Calculate the percentage based on the voltage drop
    const voltageRange = fullChargeVoltage - endOfLifeVoltage;
    const percentage = ((voltage - endOfLifeVoltage) / voltageRange) * 100;

    // Round to nearest integer for simplicity
    return Math.round(percentage);
}

const parseRawRuuvi = function (data) {
    if (data[2] != 5) {
        // old ruuvi fw
        return {};
    }
    const robject = {};

    let temperature = (data[3] << 8) | (data[4] & 0xff);
    if (temperature > 32767) {
        temperature -= 65534;
    }
    robject.temperature = temperature / 200.0;

    robject.humidity = (((data[5] & 0xff) << 8) | (data[6] & 0xff)) / 400.0;
    robject.pressure = (((data[7] & 0xff) << 8) | (data[8] & 0xff)) + 50000;

    let accelerationX = (data[9] << 8) | (data[10] & 0xff);
    if (accelerationX > 32767) accelerationX -= 65536; // two's complement
    robject.accelerationX = accelerationX;

    let accelerationY = (data[11] << 8) | (data[12] & 0xff);
    if (accelerationY > 32767) accelerationY -= 65536; // two's complement
    robject.accelerationY = accelerationY;

    let accelerationZ = (data[13] << 8) | (data[14] & 0xff);
    if (accelerationZ > 32767) accelerationZ -= 65536; // two's complement
    robject.accelerationZ = accelerationZ;

    const powerInfo = ((data[15] & 0xff) << 8) | (data[16] & 0xff);
    robject.battery = (powerInfo >>> 5) + 1600;
    robject.batpct = vol2percent(robject.battery/1000);
    robject.txPower = (powerInfo & 0b11111) * 2 - 40;
    robject.movementCounter = data[17] & 0xff;
    robject.measurementSequenceNumber = ((data[18] & 0xff) << 8) | (data[19] & 0xff);
    robject.mac = [
        int2Hex(data[20]),
        int2Hex(data[21]),
        int2Hex(data[22]),
        int2Hex(data[23]),
        int2Hex(data[24]),
        int2Hex(data[25]),
    ].join(":");
    return robject;
};


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

