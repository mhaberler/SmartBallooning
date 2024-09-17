
// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// const MQTTScreen = () => {
//   return (
//     <View style={styles.container}>
//       <Text>Settings Screen</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default MQTTScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import Paho from 'paho-mqtt';

const MQTTScreen = () => {
  const [client, setClient] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connect = () => {
      // Create a client instance
      const client = new Paho.Client('mqtt-test.mah.priv.at', 1444, 'clientId');
      setClient(client);

      // Set callback handlers
      client.onConnectionLost = (responseObject) => {
        if (responseObject.errorCode !== 0) {
          console.log("onConnectionLost:", responseObject.errorMessage);
        }
      };

      client.onMessageArrived = (message) => {
        console.log("onMessageArrived:", message.payloadString);
        setMessage(message.payloadString);
      };

      // Connect the client
      client.connect({ 
        onSuccess: () => {
          console.log('Connected to MQTT broker');
          // Subscribe to a topic
          client.subscribe('react-native');
        } 
      });
    };

    connect();

    // Cleanup function
    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, []);

  // Function to publish a message
  const publishMessage = () => {
    if (client && client.isConnected()) {
      const message = new Paho.Message('Hello from React Native!');
      message.destinationName = 'react-native';
      client.send(message);
    }
  };

  return (
    <View>
      <Text>Last Message: {message}</Text>
      <Button title="Publish Message" onPress={publishMessage} />
    </View>
  );
};

export default MQTTScreen;