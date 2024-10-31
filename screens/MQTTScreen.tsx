
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
import uuid from 'react-native-uuid';
import Constants from 'expo-constants';
const { mqttUser, mqttPassword, mqttBroker, mqttSsl, mqttPort, mqttWsPort, mqttTopic } = Constants.manifest.extra;
const uniqueString = uuid.v4();

const MQTTScreen = () => {
  const [client, setClient] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connectClient = () => {

      const client = new Paho.Client(mqttBroker, Number(mqttWsPort), uniqueString);
      setClient(client);

      // Set callback handlers
      client.onConnected = (reconnected, URI) => {
        console.log("onConnected:", URI);
      };

      client.onConnectionLost = (responseObject) => {
        if (responseObject.errorCode !== 0) {
          console.log("onConnectionLost:", responseObject.errorMessage);
        }
      };

      client.onMessageArrived = (message) => {
        console.log("onMessageArrived:", message.payloadString);
        setMessage(message.payloadString);
      };

      client.onMessageDelivered = (message) => {
        console.log("onMessageDelivered:", message.payloadString);
        setMessage(message.payloadString);
      };

      // Connect the client
      client.connect({
        onSuccess: () => {
          console.log('Connected to MQTT broker');
          // Subscribe to a topic
          client.subscribe(mqttTopic);
        },
        onFailure: (ctx, errcode, errormsg) => {
          console.log('Connect onFailure', ctx, errcode, errormsg);
        },
        timeout: 5,
        keepAliveInterval: 10,
        cleanSession: true,
        reconnect: true,
        userName: mqttUser, password: mqttPassword, useSSL: (mqttSsl === '1'),
      });
    };


    connectClient();

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