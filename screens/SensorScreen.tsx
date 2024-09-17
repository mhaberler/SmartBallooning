import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppStateExample from '../AppStateExample'

const SensorScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Sensor Screen</Text>
      <AppStateExample />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SensorScreen;