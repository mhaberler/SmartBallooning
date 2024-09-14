import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button
} from "react-native";
// import DeviceModal from "./DeviceConnectionModal";
// import useBLE from "./useBLE";
import { LocationProvider, useLocation } from './contexts/LocationContext';
import { PressureProvider, usePressure } from './contexts/PressureContext';


const LocationDisplay = () => {
  const { location, error, isLoading, watchLocation } = useLocation();

  if (isLoading) return <Text>Loading location...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View>
      {location ? (
        <View>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
          <Text>altitude: {location.coords.altitude}</Text>
          <Text>heading: {location.coords.heading}</Text>
          <Text>speed: {location.coords.speed}</Text>
        </View>
      ) : (
        <Text>Waiting for location...</Text>
      )}
      {error && <Text style={styles.errorText}>Error: {error}</Text>}
      {/* <Button title="Watch Location" onPress={watchLocation} /> */}
    </View>
  );
};

const PressureDisplay = () => {
  const { pressure, error, isLoading } = usePressure();

  if (isLoading) return <Text>Loading pressure data...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View>
      <Text>Current Pressure: {pressure ? pressure.pressure : 'N/A'} hPa</Text>
    </View>
  );r
};

const App = () => {
//   const {
//     allDevices,
//     connectedDevice,
//     connectToDevice,
//     color,
//     requestPermissions,
//     scanForPeripherals,
//   } = useBLE();
//   const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

//   const scanForDevices = async () => {
//     const isPermissionsEnabled = await requestPermissions();
//     if (isPermissionsEnabled) {
//       scanForPeripherals();
//     }
//   };

//   const hideModal = () => {
//     setIsModalVisible(false);
//   };

//   const openModal = async () => {
//     scanForDevices();
//     setIsModalVisible(true);
//   };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "white" }]}>
      {/* <View style={styles.heartRateTitleWrapper}>
        {connectedDevice ? (
          <>
            <Text style={styles.heartRateTitleText}>Connected</Text>
          </>
        ) : (
          <Text style={styles.heartRateTitleText}>
            Scan for BLE Sensors
          </Text>
        )}
      </View> */}
      {/* <LocationExample /> */}
      <LocationProvider>
        <LocationDisplay />
      </LocationProvider>
      <PressureProvider>
        <PressureDisplay />
      </PressureProvider>
      {/* <TouchableOpacity onPress={openModal} style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>Connect</Text>
      </TouchableOpacity> */}
      {/* <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  ctaButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default App;