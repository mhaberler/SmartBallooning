import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SensorScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Sensor Screen</Text>
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