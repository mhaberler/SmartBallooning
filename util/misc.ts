

export const volt2percent = function (voltage) {
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


export const int2Hex = function (str) {
    return ("0" + str.toString(16).toUpperCase()).slice(-2);
}
