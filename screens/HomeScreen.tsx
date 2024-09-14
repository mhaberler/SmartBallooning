import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LocationProvider, useLocation } from '../contexts/LocationContext';
import { PressureProvider, usePressure } from '../contexts/PressureContext';

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
  ); r
};

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* <Text>Home Screen</Text> */}
      <LocationProvider>
        <LocationDisplay />
      </LocationProvider>
      <PressureProvider>
        <PressureDisplay />
      </PressureProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'left',
    alignItems: 'center',
  },
});

export default HomeScreen;