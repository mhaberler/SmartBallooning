import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LocationProvider, useLocation } from '../contexts/LocationContext';
import { PressureProvider, usePressure } from '../contexts/PressureContext';
// import { AltitudeProvider, AltitudeContext, useAltitude } from '../contexts/AltitudeContext';
import { AltitudeProvider, useAltitude } from '../contexts/AltitudeContext';
import { BLEProvider, useBLE } from '../contexts/BLEContext';

import { altitudeISAByPres, windspeedMSToKMH } from 'meteojs/calc.js';

const LocationDisplay = () => {
  const { location, error, isLoading, watchLocation } = useLocation();

  if (isLoading) return <Text>Loading location...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View>
      {location ? (
        <View>
          {/* <Text style={styles.field}>Latitude: {location.coords.latitude}</Text>
          <Text style={styles.field}>Longitude: {location.coords.longitude}</Text> */}
          <Text style={styles.field}>GPS altitude: {Math.round(location.coords.altitude * 10) / 10}m</Text>
          <Text style={styles.field}>heading: {location.coords.heading < 0 ? "" : Math.round(location.coords.heading) + "°"}</Text>
          <Text style={styles.field}>speed: {location.coords.speed < 0 ? "" : (Math.round(windspeedMSToKMH(location.coords.speed * 10) / 10) + " km/h")}</Text>
        </View>
      ) : (
        <Text>Waiting for location...</Text>
      )}
      {error && <Text style={styles.errorText}>Error: {error}</Text>}
      {/* <Button title="Watch Location" onPress={watchLocation} /> */}
    </View>
  );
};


// const AltitudeDisplay = () => {
//   const { altitude, verticalSpeed } = useAltitude();
//   return (
//     altitude ?
//       <View>
//         <Text style={styles.field}>baro altitude: {Math.round(altitude * 100) / 100} m</Text>
//         <Text style={styles.field}>baro vspeed: {Math.round(verticalSpeed * 100) / 100} m/s</Text>
//         {/* <Text style={styles.field}>vspeedKF: {Math.round(vspeedKF * 100) / 100} m/s</Text> */}

//       </View>
//       : null
//   );
// }

const AltitudeDisplay = () => {
  const { pressure, altitude, verticalSpeed, verticalSpeedKF, error, isLoading, lastTimestamp } = useAltitude();
  // console.log(verticalSpeed, verticalSpeedKF)

  return (
    pressure ?
      <View>
        <Text style={styles.field}>baro altitude: {Math.round(altitude * 1000) / 1000} m</Text>

        {/* <Text style={styles.field}>baro pressure: {Math.round(pressure * 100) / 100} hPa</Text> */}
        <Text style={styles.field}>baro vspeed: {Math.round(verticalSpeed * 1000) / 1000} m/s</Text>
        <Text style={styles.field}>baro vspeedKF: {Math.round(verticalSpeedKF * 1000) / 100} m/s</Text>
        <Text style={styles.field}>lastTimestamp: {lastTimestamp} m/s</Text>


      </View>
      : null
  );
};

const syncPressed = (report) => {
  return { backgroundColor: report?.syncPressed ? 'red' : 'transparent' };
};

const BLEDisplay = () => {
  const { scanning, devices, error,
    envelope, oat, tank1, tank2, tank3, tank4, tank5, tank6
  } = useBLE();

  useEffect(() => {
    console.log('BLEDisplay did mount');
    // Cleanup function
    return () => {
      console.log('BLEDisplay did Unmount');
    };
  }, []);


  if (!scanning) return <Text>scanning stopped</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View>
      {/* return <View style={[{ backgroundColor }, style]} {...otherProps} />; */}

      {/* <Text style={styles.field}>BLE Devices: {devices ? devices : ''}</Text> */}
      <Text style={styles.field}>envelope: {envelope ? Math.round(envelope.temp * 10) / 10 : ''}</Text>
      <Text style={styles.field}>oat: {oat ? Math.round(oat.temp * 10) / 10 : ''}</Text>
      <Text style={[syncPressed(tank1), styles.field]}>tank1: {tank1 ? tank1.level : ''}</Text>
      <Text style={[syncPressed(tank2), styles.field]}>tank2: {tank2 ? tank2.level : ''}</Text>
      <Text style={[syncPressed(tank3), styles.field]}>tank3: {tank3 ? tank3.level : ''}</Text>
      <Text style={[syncPressed(tank4), styles.field]}>tank4: {tank4 ? tank4.level : ''}</Text>

      {/* <Text style={styles.field}>Envelope: {envelope !== {} ? envelope.temp + "°" : ''}</Text> */}
    </View>
  ); r
};



const HomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* <Text>Home Screen</Text> */}
      <LocationProvider >
        <LocationDisplay />
      </LocationProvider>
      {/* <PressureProvider>
        <PressureDisplay />
      </PressureProvider> */}
      {/* <AltitudeProvider >
        <AltitudeDisplay />
      </AltitudeProvider> */}

      <AltitudeProvider>
        <AltitudeDisplay />
      </AltitudeProvider>

      <BLEProvider>
        <BLEDisplay />
      </BLEProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'left',
    alignItems: 'center',
  },
  field: {
    fontSize: 20,
    fontWeight: 'bold',
    // alignItems: 'right',
  }
});

export default HomeScreen;