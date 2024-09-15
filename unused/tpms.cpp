// TPMS BLE ESP32
// 2020 RA6070
// v0.2 06/08/20
//
// TPMS BLE "manufacturer data" format
// "000180eaca108a78e36d0000e60a00005b00"
//  0001                                    Manufacturer (0001: TomTom)
//      80                                  Sensor Number (80:1, 81:2, 82:3,
//      83:4, ..) 80eaca108a78                        Sensor Address
//                  e36d0000                Pressure
//                          e60a0000        Temperature
//                                  5b      Battery percentage
//                                    00    Alarm Flag (00: OK, 01: No Pressure
//                                    Alarm)
//
// How calculate Sensor Address:            (Sensor number):EA:CA:(Code binding
// reported in the leaflet) - i.e. 80:EA:CA:10:8A:78

#include <M5Core2.h>
#include <NimBLEDevice.h>

typedef struct __attribute__((__packed__)) {
  uint16_t mfid;
  uint8_t address[6];
  uint32_t pressure; // esp32 is a littleendian so we can do this
  uint32_t temperature;
  uint8_t batteryPercent;
  uint8_t alarm;
} tpms_t;

NimBLEScan *pBLEScan;

#define UUID_TPMS_SERVICE "0000fbb0-0000-1000-8000-00805f9b34fb"

// senso4s
// Advertising packet (total of 10 bytes) is defined as:
// first 2 bytes - measured mass in dag;
// next byte – status of the Senso4s device:
// 0 – no error,
// 2 – too high (>40°C) or too low (<-10°C) ambient temperature,
// 3 – motions of Senso4s device was detected,
// 4 – too large inclination of the Senso4s device was detected (threshold value
// is 6°), Please not that a combination of the errors may occur as well! next 1
// byte – battery percentage in %; last 6 bytes – MAC address of the Senso4s
// device.

// UUID is our company name (Senso4s d.o.o.).

NimBLEAddress senso4s = NimBLEAddress("E7:3F:13:9C:2B:E1");
#define MFID_SENSO4S 0x09CC
#define SVC_UUID_SENSO4S_1 "7081"
#define SVC_UUID_SENSO4S_2 "1881"
#define SVC_UUID_SENSO4S_3 "1081"

// bits in senso4s_t.status:
#define SENSO4S_OK (1 << 0)
#define SENSO4S_TEMPERATURE (1 << 2)
#define SENSO4S_MOTION (1 << 3)
#define SENSO4S_INCLINATION (1 << 4)

#define SENSO4S_ZERO 1940
typedef struct __attribute__((__packed__)) {
  uint16_t mfid;
  uint16_t weight;
  uint8_t status;
  uint8_t batteryPercent;
  uint8_t address[6];
} senso4s_t;

void printhex(const std::string &s) {
  for (auto i = 0; i < s.length(); i++)
    Serial.printf("%2.2x ", s.c_str()[i]);
  Serial.println();
}
class MyAdvertisedDeviceCallbacks : public NimBLEAdvertisedDeviceCallbacks {
  void onResult(NimBLEAdvertisedDevice *advertisedDevice) {

    if (advertisedDevice->haveManufacturerData()) {

      const std::string &md = advertisedDevice->getManufacturerData();
      const uint8_t *data = (const uint8_t *)md.c_str();
      uint16_t mfid = data[1] << 8 | data[0];

      if (advertisedDevice->isAdvertisingService(
              NimBLEUUID(SVC_UUID_SENSO4S_1)) &&

          advertisedDevice->isAdvertisingService(
              NimBLEUUID(SVC_UUID_SENSO4S_2)) &&

          advertisedDevice->isAdvertisingService(
              NimBLEUUID(SVC_UUID_SENSO4S_3)) &&
          (mfid == MFID_SENSO4S)) {
        Serial.printf("---> senso4s MFD: ");
        printhex(md);

        const senso4s_t *sp = (senso4s_t *)data;
        Serial.printf("weight=%.3f Kg status=0x%x battery=%d%%\n",
                      (sp->weight - SENSO4S_ZERO) / 100.0, sp->status,
                      sp->batteryPercent);

        if (sp->status & SENSO4S_TEMPERATURE) {
          Serial.println("-- temperature range exceeded");
        }
        if (sp->status & SENSO4S_MOTION) {
          Serial.println("-- motion detected");
        }
        if (sp->status & SENSO4S_INCLINATION) {
          Serial.println("-- inclination exceeded");
        }

        M5.Lcd.fillScreen(BLACK);
        M5.Lcd.setCursor(0, 20);
        M5.Lcd.printf("senso4s: weight=%.3f Kg\nstatus=0x%x battery=%d%%\n",
                      (sp->weight - SENSO4S_ZERO) / 100.0, sp->status,
                      sp->batteryPercent);
      }

      if (advertisedDevice->isAdvertisingService(
              NimBLEUUID(UUID_TPMS_SERVICE))) {

        M5.Lcd.fillScreen(BLACK);
        M5.Lcd.setCursor(0, 20);

        const tpms_t *tpms = (tpms_t *)md.c_str();

        M5.Lcd.printf("sensor: %s\nrssi=%d type=%d\nT=%.2f deg p=%.2f bar\nBat="
                      "%d%% status=%s\n",
                      advertisedDevice->getAddress().toString().c_str(),
                      advertisedDevice->getRSSI(), tpms->address[0] & 0x7f,
                      tpms->temperature / 100.0, tpms->pressure / 100000.0,
                      tpms->batteryPercent, tpms->alarm ? "ALARM" : "OK");

        // 00 01 82 ea ca 31 78 c8 00 00 00 00 77 0b 00 00 5d 00
        // sensor: 82:ea:ca:31:78:c8
        // rssi -69 type=2
        // T=29.35 deg p=0.00 bar
        // Bat 93%   OK
        printhex(md);
        Serial.printf("sensor: %s\nrssi=%d type=%d\nT=%.2f deg p=%.2f bar\nBat="
                      "%d%% status=%s\n",
                      advertisedDevice->getAddress().toString().c_str(),
                      advertisedDevice->getRSSI(), tpms->address[0] & 0x7f,
                      tpms->temperature / 100.0, tpms->pressure / 100000.0,
                      tpms->batteryPercent, tpms->alarm ? "ALARM" : "OK");
      }
    }
  }
};

void setup() {
  Serial.begin(115200);
  delay(100);
  M5.begin();
  M5.Lcd.setBrightness(255);

  M5.Lcd.fillScreen(BLACK);
  M5.Lcd.setTextColor(GREEN, BLACK);
  M5.Lcd.setTextFont(4);
  M5.Lcd.setTextSize(1);
  M5.Lcd.setCursor(0, 20);

  // BLE Init
  M5.Lcd.print("Init BLE... ");
  NimBLEDevice::setScanDuplicateCacheSize(200);
  NimBLEDevice::init("tpms");
  NimBLEDevice::setPower(ESP_PWR_LVL_P9);

  pBLEScan = NimBLEDevice::getScan();
  pBLEScan->setMaxResults(0);
  pBLEScan->setDuplicateFilter(true);
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks(),
                                         false);
  pBLEScan->setActiveScan(true);
  M5.Lcd.println("done.");
}

void loop() {
  if (pBLEScan->isScanning() == false) {
    // Start scan with: duration = 0 seconds(forever), no scan end callback, not
    // a continuation of a previous scan.
    pBLEScan->start(0, nullptr, false);
  }

  delay(200);
}
