
import {
    Alert,
    NativeEventEmitter,
    NativeModules,
    PermissionsAndroid,
    Platform,
  } from "react-native";
  import BleManager, {
    BleScanCallbackType,
    BleScanMatchMode,
    BleScanMode,
    BleScanPhyMode,
  } from "react-native-ble-manager";
  import { Buffer } from "buffer";

  const BleManagerModule = NativeModules.BleManager;
  // const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
  let onUpdateCallback = () => {};
  let setIsScanning;
  let isStarted = false;
  let filteredDevices = [];
  let peripherals = {};
  
  
  export function strengthHeuristics(rssi) {
    // Turn rssi into a number
    if (rssi == null) {
      return 3;
    }
    var rssiVal = Number(rssi);
    if (rssiVal >= -65) {
      return 3;
    } else if (rssiVal >= -75) {
      return 2;
    } else if (rssiVal >= -95) {
      return 1;
    } else {
      return 0;
    }
  }
  
  
  export const clearSensors = () => {
    peripherals = {};
  };
  
  export const startScan = async (
    scanning,
    setScanning,
    devicesToScan,
    scanDuration,
    updateCallback
  ) => {
    try {
      if (!isStarted) {
        const hasPerms = await handleAndroidPermissions();
        if (!hasPerms) {
          Alert.alert(
            "Missing Permissions",
            "You need to grant bluetooth permissions to Sensor Logger in settings to use this feature."
          );
          return;
        }
        await BleManager.start({ showAlert: false });

        // https://github.com/innoveit/react-native-ble-manager/pull/1285#issuecomment-2525458931
        const subscription = BleManager.onDiscoverPeripheral(
          (device) => { handleDiscoverPeripheral(device); }
        );

        const stopScanSubscription = BleManager.onStopScan(
          (device) => { handleStopScan(device); }
        );
        nextAllowedUpdate = {};
        isStarted = true;
      }
  
      if (!scanning) {
        setIsScanning = setScanning;
        onUpdateCallback = updateCallback;
        filteredDevices = devicesToScan;
        setScanning(true);
        await BleManager.scan([], scanDuration, true, {
          matchMode: BleScanMatchMode.Sticky,
          scanMode: BleScanMode.Balanced,
          callbackType: BleScanCallbackType.AllMatches,
          phy: BleScanPhyMode.ALL_SUPPORTED,
          legacy: false,
        });
      }
    } catch (error) {
      console.error("[startScan] ble error thrown", error);
    }
  };
  
  function neededAndroidPermissions() {
    const permissions = [];
    if (Platform.Version >= 31) {
      permissions.push(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      );
    }
    if (Platform.Version >= 23) {
      permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }
    return permissions;
  }
  
  const handleAndroidPermissions = async () => {
    if (Platform.OS !== "android") {
      return true;
    }
    const permissions = neededAndroidPermissions();
    if (permissions.length === 0) {
      return;
    }
    console.log('[requestMultiple]', permissions);

    const requestResult = await PermissionsAndroid.requestMultiple(permissions);
    console.log('[requestMultiple] ---done');

    for (const permission in requestResult) {
      if (requestResult[permission] !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('[notGranted]', permission);

        return false;
      }
    }
    console.log('[permsAllFine]');

    await BleManager.enableBluetooth();
    return true;
  };
  
  export const stopScan = () => {
    return BleManager.stopScan();
  };
  
  const handleStopScan = async () => {
    onUpdateCallback = () => {};
    setIsScanning(false);
  };
  
  function getAdvertisingData(bytes) {
    let index = 0;
    while (index < bytes.length) {
      const length = bytes[index];
      if (length === 0) {
        return bytes.slice(0, index);
      }
      index += length + 1;
    }
    return bytes;
  }
  
  function getManufacturerData(bytes) {
    let index = 0;
    while (index < bytes.length) {
      const length = bytes[index++];
      const type = bytes[index++];
      if (type === 0xff) {
        return bytes.slice(index, index + length - 1);
      }
      index += length - 1;
    }
  }
  
  let nextAllowedUpdate = {};
  
  const connectMeta = {};
  const idsToLookup = [];
  let lookupInProgress = 0;
  
  const nameMap = {
    "2a29": "manufacturer",
    "2a24": "model",
  };
  
  async function getDeviceInformation() {
    const maxConcurrent = 2;
    if (lookupInProgress > maxConcurrent || idsToLookup.length === 0) {
      return;
    }
    lookupInProgress += 1;
    const id = idsToLookup.pop();
    try {
      await timeout(() => BleManager.connect(id));
      const info = await timeout(() => BleManager.retrieveServices(id));
      const data = {
        hasDeviceInfo: true,
      };
      for (const service of info.characteristics) {
        if (
          // 0x180A - Device Information Service
          // 0x2a29 - Manufacturer Name String
          // 2a24 - Model Number String
          service.service === "180a" &&
          (service.characteristic === "2a29" || service.characteristic === "2a24")
        ) {
          const buf = await timeout(() =>
            BleManager.read(id, service.service, service.characteristic)
          );
          data[nameMap[service.characteristic]] = Buffer.from(buf)
            .toString()
            .replace(/,/g, "-");
        }
      }
      data.serviceUUIDs = info.services.map((s) => s.uuid).join("|");
      connectMeta[id] = data;
    } catch (error) {
      // do nothing
    } finally {
      BleManager.disconnect(id);
    }
    if (idsToLookup.length > 0) {
      setTimeout(getDeviceInformation, 200);
    }
    lookupInProgress -= 1;
  }
  
  const handleDiscoverPeripheral = (peripheral) => {
    if (filteredDevices.length > 0 && !filteredDevices.includes(peripheral.id)) {
      return;
    }
  
    const time = Date.now();
    if (
      nextAllowedUpdate[peripheral.id] != null &&
      nextAllowedUpdate[peripheral.id] > time
    ) {
      return;
    }
    nextAllowedUpdate[peripheral.id] = time + 1000;
  
    if (connectMeta[peripheral.id] === undefined) {
      connectMeta[peripheral.id] = null;
      if (peripheral?.advertising?.isConnectable) {
        idsToLookup.push(peripheral.id);
        getDeviceInformation();
      }
    }
  
    delete peripheral.advertising.kCBAdvDataRxPrimaryPHY;
    delete peripheral.advertising.kCBAdvDataRxSecondaryPHY;
    delete peripheral.advertising.kCBAdvDataTimestamp;
    if (peripheral.rssi === 127) {
      peripheral.rssi = null;
    }
    if (peripheral.advertising.txPowerLevel === -2147483648) {
      peripheral.advertising.txPowerLevel = null;
    }
    if (!peripheral.name) {
      peripheral.name = "Unknown Name";
    }
    if (peripheral.advertising == null) {
      peripheral.advertising = {};
    }
    if (peripheral.advertising.rawData?.bytes) {
      let bytes = peripheral.advertising.rawData.bytes;
      peripheral.advertising.advertisement = toHexString(
        getAdvertisingData(bytes)
      );
      peripheral.advertising.manufacturerData = toHexString(
        getManufacturerData(bytes)
      );
      delete peripheral.advertising.rawData;
      delete peripheral.advertising.manufacturerRawData;
    } else if (peripheral.advertising.manufacturerRawData?.bytes) {
      peripheral.advertising.manufacturerData = toHexString(
        peripheral.advertising.manufacturerRawData.bytes
      );
      delete peripheral.advertising.manufacturerRawData;
    } else {
      delete peripheral.advertising.rawData;
      delete peripheral.advertising.manufacturerRawData;
      delete peripheral.advertising.manufacturerData;
    }
    if (peripheral.advertising.serviceData?.bytes) {
      peripheral.advertising.serviceData = toHexString(
        peripheral.advertising.serviceData.bytes
      );
    } else {
      delete peripheral.advertising.serviceData;
    }
    Object.assign(peripheral, peripheral.advertising);
    delete peripheral.advertising;
  
    if (peripheral.serviceUUIDs?.length > 0) {
      peripheral.serviceUUIDs = peripheral.serviceUUIDs.join("|");
    }
    if (peripheral.localName?.length > 0) {
      peripheral.localName = peripheral.localName.replace(/,/g, "-");
    }
    if (peripheral.name?.length > 0) {
      peripheral.name = peripheral.name.replace(/,/g, "-");
    }
  
    addOrUpdatePeripheral(peripheral);
  };
  
  function toHexString(byteArray) {
    if (byteArray == null) {
      return null;
    }
    return Buffer.from(byteArray).toString("hex");
  }
  
  const addOrUpdatePeripheral = (updatedPeripheral) => {
    if (onUpdateCallback == null) {
      peripherals[updatedPeripheral.id] = updatedPeripheral;
    } else {
      const meta = connectMeta[updatedPeripheral.id];
      if (meta === null) {
        onUpdateCallback(updatedPeripheral);
      } else {
        onUpdateCallback({
          ...updatedPeripheral,
          ...meta,
        });
      }
    }
  };
  
  