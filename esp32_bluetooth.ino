#include "BluetoothSerial.h"

#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

BluetoothSerial SerialBT;
String BT_String = "";

void setup()
{
  Serial.begin(115200);
  SerialBT.begin("ESP32_BT"); //藍芽裝置名稱
  Serial.println("The device started, now you can pair it with bluetooth!");
}

void loop()
{
  if (Serial.available())
  {
    // 電腦端接受資料發送到藍牙
    SerialBT.write(Serial.read());
  }
  if (SerialBT.available())
  {
    //藍牙端接受資料發送到電腦
    char BT_Input_String = SerialBT.read();
    if (String(BT_Input_String) != "")
    {
      if (String(BT_Input_String) == "%")
      {
        Serial.print(BT_String);
        Serial.print("\n");
        BT_String = "";
      }
      else
      {
        BT_String += BT_Input_String;
      }
    }
  }
  delay(20);
}
void mate_Mode(int mode)
{
}
