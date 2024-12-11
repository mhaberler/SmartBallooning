
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { CameraView, Camera, useCameraPermissions } from "expo-camera";
import { Overlay } from "./Overlay";

export default function SensorScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState("");

  // useEffect(() => {
  //   const getCameraPermissions = async () => {
  //     console.log("getCameraPermissions----");
  //     const { status } = await Camera.requestCameraPermissionsAsync(); // await Camera.requestCameraPermissionsAsync();
  //     console.log("getCameraPermissions = ", status);

  //     setHasPermission(status === "granted");
  //   };

  //   getCameraPermissions();
  // }, []);

  useEffect(() => {
    async function ensurePermission() {
      console.debug('[ensurePermission] ...', permission);

        if (!permission || !permission.granted) {
          console.debug('[ensurePermission] ---try...');

            const permissionResponse = await requestPermission(); // Updates permissions
            console.debug('[done requestPermission]');

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
}, [hasPermission, setHasPermission]);

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);

    try {
      console.debug('[startScan] starting scan...');
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

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
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
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});