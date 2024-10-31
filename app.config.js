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
      mqttUser: process.env.MQTT_USER || "ro",
      mqttPassword: process.env.MQTT_PASS || "readonly",
      mqttBroker: process.env.MQTT_BROKER || "test.mosquitto.org",
      mqttSsl: process.env.MQTT_SSL  || '1',
      mqttPort: process.env.MQTT_PORT || 8091, // MQTT over WebSockets, encrypted, authenticated
      mqttWsPort: process.env.MQTT_WSPORT || 443, 
      mqttTopic: process.env.MQTT_TOPIC || "#"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.haberler.SmartBallooning",
      infoPlist: {
        NSMotionUsageDescription: "Since iOS 17.4 the access is required to read the built-in barometer pressure sensor. Without this permission, the app will not be able to use the barometer option for altitude. Enable in Settings > App Name > Motion & Fitness",
        NSBonjourServices: [
          "_mqtt._tcp.",
          "_mqttws._tcp.",
          "_arduino._tcp"
        ],
        NSLocalNetworkUsageDescription: "Describe why you want to use local network discovery here"
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.haberler.SmartBallooning",
      permissions: [
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.ACCESS_WIFI_STATE",
        "android.permission.CHANGE_WIFI_MULTICAST_STATE",
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.BLUETOOTH",
        "android.permission.BLUETOOTH_ADMIN",
        "android.permission.BLUETOOTH_CONNECT",
        "android.permission.HIGH_SAMPLING_RATE_SENSORS"
      ],
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      "@maplibre/maplibre-react-native",
      [
        "expo-camera",
        {
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
          microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone",
          recordAudioAndroid: true
        }
      ],
      [
        "@matthewwarnes/react-native-ble-manager-plugin",
        {
          isBackgroundEnabled: true,
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
      [
        "react-native-nfc-manager",
        {
          nfcPermission: "Custom NFC permission message",
          // "selectIdentifiers": [
          //   "A0000002471001"
          // ],
          // "systemCodes": [
          //   "8008"
          // ],
          // "includeNdefEntitlement": false,
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    }
  }

};

