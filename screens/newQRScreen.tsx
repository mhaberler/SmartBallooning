import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Overlay } from "./Overlay";

export default function SensorScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [hasPermission, setHasPermission] = useState(false);
    const cameraRef = useRef<CameraView | null>(null);
    const [scanned, setScanned] = useState(false);

    const handleBarcodeScanned = ({ type, data }) => {
        setScanned(true);
        console.debug('[handleBarcodeScanned] ---');

        try {
            const j = JSON.parse(data)

            // console.error("JSON: " + JSON.stringify(j))
            if (j && j?.us === "sb") {
                alert(`Bar code with type ${type} and data ${data} has been recognized!`);
            } else {
                alert(`not a valid SmartBallooning QR code!`);
            }

        } catch (error) {
            console.error('[QRscan] JSON error', error, data);
        }
    };

    useEffect(() => {
        async function ensurePermission() {
            if (!permission || !permission.granted) {
                const permissionResponse = await requestPermission(); // Updates permissions
                if (permissionResponse && permissionResponse.granted) {
                    setHasPermission(permissionResponse.granted);
                    console.log("Camera permission granted");
                }
                else {
                    console.log("Camera permission denied");
                }
            }
        }
        ensurePermission();
    }, [permission, hasPermission]);

    if (!permission) {
        // Camera permissions are still loading.
        return <View></View>;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}> We need your permission to show the camera </Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr", "pdf417"],
                }}
                style={StyleSheet.absoluteFillObject}
            />
            <Overlay />
            <View >
                {scanned && (
                    <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
                )}
            </View>
        </View>);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
    },

});

