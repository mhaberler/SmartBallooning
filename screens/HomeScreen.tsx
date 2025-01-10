import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { LocationProvider, useLocation } from '../contexts/LocationContext';
import { AltitudeProvider, useAltitude } from '../contexts/AltitudeContext';
import { BLEProvider, useBLE, clearValues } from '../contexts/BLEContext';

import { windspeedMSToKMH } from 'meteojs/calc.js';


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
    </View>
  );
};

const AltitudeDisplay = () => {
  const { pressure, altitude, verticalSpeed, error, isLoading, lastTimestamp } = useAltitude();
  return (
    pressure ?
      <View>
        <Text style={styles.field}>baro altitude: {Math.round(altitude * 10) / 10} m</Text>
        <Text style={styles.field}>baro vspeed: {Math.round(verticalSpeed * 10) / 10} m/s</Text>
      </View>
      : null
  );
};


const BLEDisplay = () => {
  const { scanning, error,
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

  function renderSensor(t) {
    return t ? (
      <View>
        <Text style={styles.field}>{t.unit + ': '}
          {t.sensors.elg ? t.sensors.elg.percent + '% ' : ''}
          {t.sensors.otodata ? t.sensors.otodata.percent + '% ' : ''}
          {t.sensors.mopeka ? Math.round(t.sensors.mopeka.level) + 'mm ' : ''}
          {t.sensors.tpms ? Math.round(t.sensors.tpms.pressure * 10) / 10 + 'bar ' : ''}
          {t.sensors.ruuvi ? (Math.round(t.sensors.ruuvi.temp * 10) / 10 + '° ' +
            (t.sensors.ruuvi.hum ? Math.round(t.sensors.ruuvi.hum) + '% ' : ''))
            : ''}
        </Text>
      </View>
    ) :
      null;

  };

  return (
    <View>
      {/* <Button title="Clear" onPress={clearValues} /> */}


      {renderSensor(envelope)}
      {renderSensor(oat)}
      {renderSensor(tank1)}
      {renderSensor(tank2)}
      {renderSensor(tank3)}
      {renderSensor(tank4)}
      {renderSensor(tank5)}
      {renderSensor(tank6)}
    </View>
  ); r
};



const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <LocationProvider >
        <LocationDisplay />
      </LocationProvider>
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
    fontSize: 24,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'left',
  }
});

export default HomeScreen;