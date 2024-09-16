export const volt2percent = function (voltage) {
    const percent = (voltage - 2.2) / 0.65 * 100.0;
    if (percent < 0.0) {
        return 0;
    }
    if (percent > 100.0) {
        return 100;
    }
    return Math.round(percent);
}

export const int2Hex = function (str) {
    return ("0" + str.toString(16).toUpperCase()).slice(-2);
}

export function bytesToMacAddress(dataView, byteOffset = 0, length = 6) {
    // Ensure we have at least 6 bytes available
    if (dataView.byteLength - byteOffset < length) {
        throw new Error("Not enough bytes to form a MAC address");
    }

    // Extract the 6 bytes
    const bytes = [];
    for (let i = 0; i < length; i++) {
        bytes.push(dataView.getUint8(byteOffset + i));
    }

    // Convert bytes to hexadecimal strings
    const hexBytes = bytes.map(byte => {
        // Ensure each byte is represented by two hexadecimal characters
        return byte.toString(16).toUpperCase().padStart(2, '0');
    });

    // Join the hexadecimal strings with colons
    return hexBytes.join(':');
}