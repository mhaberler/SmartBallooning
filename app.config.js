// console.log("----NODE_ENV", process.env.NODE_ENV)

export default {
  expo: {
    newArchEnabled: true,
    name: "SmartBallooning",
    slug: "SmartBallooning",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    extra: {
      eas: {
        projectId: "5e78364f-edb1-4b5b-aaaf-8dc6352668f1"
      }
    },
    // extra: {
    //   useLeaflet: true,
    //   useNFC: false,
    //   useKalmanjs: true,
    //   mqttUser: process.env.MQTT_USER || "ro",
    //   mqttPassword: process.env.MQTT_PASS || "readonly",
    //   mqttBroker: process.env.MQTT_BROKER || "test.mosquitto.org",
    //   mqttSsl: process.env.MQTT_SSL || '1',
    //   mqttPort: process.env.MQTT_PORT || 8091, // MQTT over WebSockets, encrypted, authenticated
    //   mqttWsPort: process.env.MQTT_WSPORT || 443,
    //   mqttTopic: process.env.MQTT_TOPIC || "#"
    // },
    ios: {
      buildNumber: "2",
      supportsTablet: true,
      // see npx expo run:android --variant freeDebug --app-id dev.expo.myapp.free
      // https://docs.expo.dev/guides/local-app-development/
      bundleIdentifier: "com.haberler.SmartBallooning",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSMotionUsageDescription: "Since iOS 17.4 the access is required to read the built-in barometer pressure sensor. Without this permission, the app will not be able to use the barometer option for altitude. Enable in Settings > App Name > Motion & Fitness",
        NSBluetoothAlwaysUsageDescription: "This app requires access", // https://github.com/innoveit/react-native-ble-manager/pull/1285#issuecomment-2500898712
        NSBonjourServices: [
          "_mqtt._tcp.",
          "_mqtt-ws._tcp.",
          "_mqtts._tcp.",
          "_mqtt-wss._tcp."
        ],
        NSLocalNetworkUsageDescription: "This app uses the local network to discover MQTT services"
        // NSCameraUsageDescription: "needed to scan QR codes",
        // NSMicrophoneUsageDescription: "needed to record audio"
      },

    },
    android: {
      edgeToEdgeEnabled: true,
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.haberler.SmartBallooning",
      permissions: [
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.ACCESS_WIFI_STATE",
        "android.permission.CHANGE_WIFI_MULTICAST_STATE",
        // "android.permission.ACCESS_NETWORK_STATE",
        // "android.permission.ACCESS_WIFI_STATE",
        // "android.permission.CHANGE_WIFI_MULTICAST_STATE",
        // "android.permission.CAMERA",
        // "android.permission.RECORD_AUDIO",
        // "android.permission.READ_EXTERNAL_STORAGE",
        // "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.BLUETOOTH_SCAN",
        "android.permission.BLUETOOTH",
        "android.permission.BLUETOOTH_ADMIN",
        "android.permission.BLUETOOTH_CONNECT",
        // "android.permission.HIGH_SAMPLING_RATE_SENSORS",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        //         <!-- Optional permissions -->
        // <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
        // <uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />
        // <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />

      ],
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "react-native-ota-hot-update",
      [
        "expo-dev-client",
        {
          "launchMode": "most-recent" // or "launcher"
        }
      ],
      "expo-build-properties",
      "expo-font",
      "expo-router",
      // "@maplibre/maplibre-react-native",
      // [
      //   "expo-camera",
      //   {
      //     cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
      //     microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone",
      //     recordAudioAndroid: true
      //   }
      // ],
      [
        "@matthewwarnes/react-native-ble-manager-plugin",
        {
          isBackgroundEnabled: true,
          neverForLocation: false,
          modes: [
            "peripheral",
            "central"
          ],
          bluetoothAlwaysPermission: "Allow $(PRODUCT_NAME) to connect to bluetooth devices",
          bluetoothPeripheralPermission: "Allow $(PRODUCT_NAME) to connect to bluetooth devices"
        }
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow $(PRODUCT_NAME) to use your location."
        }
      ],
      [
        "expo-sensors",
        {
          motionPermission: "Allow $(PRODUCT_NAME) to access your device motion."
        }
      ],
      // [
      //   "react-native-nfc-manager",
      //   {
      //     nfcPermission: "Custom NFC permission message",
      //     // "selectIdentifiers": [
      //     //   "A0000002471001"
      //     // ],
      //     // "systemCodes": [
      //     //   "8008"
      //     // ],
      //     // "includeNdefEntitlement": false,
      //   }
      // ]
    ],
    // experiments: {
    //   typedRoutes: true
    // }
  }

};

