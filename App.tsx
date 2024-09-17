
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import Foundation from '@expo/vector-icons/Foundation';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Screens
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import SensorScreen from './screens/SensorScreen';
import VertcialProfileScreen from './screens/VerticalProfileScreen';


const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'navigation-variant' : 'navigation-variant-outline';
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />

            } else if (route.name === 'Profile') {
              iconName = focused ? 'settings' : 'settings-outline';
              return <Foundation name="graph-horizontal" size={size} color={color} />

            } else if (route.name === 'Sensors') {
              return <MaterialCommunityIcons name="qrcode-scan" size={size} color={color} />

            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
              return <Ionicons name={iconName} size={size} color={color} />;

            }
          },
        })}
      // tabBarOptions={{
      //   activeTintColor: 'tomato',
      //   inactiveTintColor: 'gray',
      // }}
      // screenOptions={({ route }) => ({
      //   // tabBarStyle: [
      //   //   { display: "flex" },
      //   //   null
      //   // ],
      //   // tabBarLabelStyle: { fontSize: 12 },
      //   // tabBarIconStyle: { color: 'black' },
      //   // Add more options as needed
      // })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={VertcialProfileScreen} />
        <Tab.Screen name="Sensors" component={SensorScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer >
  );
}

export default App;