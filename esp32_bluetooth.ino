#include "BluetoothSerial.h"

#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

BluetoothSerial SerialBT;

void setup() {
  Serial.begin(115200);
  SerialBT.begin("ESP32_BT"); //藍芽裝置名稱
  Serial.println("The device started, now you can pair it with bluetooth!");
}

void loop() {
  if (Serial.available()) {
    //電腦端接受資料發送到藍牙
    SerialBT.write(Serial.read());
  }
  if (SerialBT.available()) {
    //藍牙端接受資料發送到電腦
    Serial.write(SerialBT.read());
  }
  delay(20);
}