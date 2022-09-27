#include "BluetoothSerial.h"

#include <Adafruit_NeoPixel.h>

#define PIN1 18
#define PIN2 33
#define NUMPIXELS 20
Adafruit_NeoPixel pixels1(NUMPIXELS, PIN1);
Adafruit_NeoPixel pixels2(NUMPIXELS, PIN2);

#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

BluetoothSerial SerialBT;
String now_mode = "stop";
String mode_data;
String BT_String = "";

void setup()
{
  Serial.begin(115200);
  SerialBT.begin("ESP32_BT"); //藍芽裝置名稱
  Serial.println("The device started, now you can pair it with bluetooth!");
  pixels1.begin(); // INITIALIZE NeoPixel strip object (REQUIRED)
  pixels2.begin(); // INITIALIZE NeoPixel strip object (REQUIRED)
  for (int i = 0; i < NUMPIXELS; i++)
  {
    pixels1.setPixelColor(i, pixels1.Color(0, 0, 0));
    pixels1.show(); // Send the updated pixel colors to the hardware.
    pixels2.setPixelColor(i, pixels2.Color(0, 0, 0));
    pixels2.show(); // Send the updated pixel colors to the hardware.
  }
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
        if (BT_String.indexOf("stop") != -1)
        {
          // stop
          mate_stop();
          now_mode = "stop";
        }
        if (BT_String.indexOf("mode") != -1)
        {
          // mode123
          now_mode = "mode";
          mode_data = String(BT_String.substring(4, BT_String.length()));
          mate_Mode(String(BT_String.substring(4, BT_String.length())));
        }
        else if (BT_String.indexOf("rgb") != -1)
        {
          int R1, G1, B1, R2, G2, B2;
          // rgb(255,000,255),rgb(000,255,255)
          // 0000000000111111111122222222223333
          // 0123456789012345678901234567890123
          now_mode = "rgb";
          R1 = BT_String.substring(4, 7).toInt();
          G1 = BT_String.substring(8, 11).toInt();
          B1 = BT_String.substring(12, 15).toInt();
          R2 = BT_String.substring(21, 24).toInt();
          G2 = BT_String.substring(25, 28).toInt();
          B2 = BT_String.substring(29, 32).toInt();
          // R1 = String(BT_String.substring(4, 7));
          // G1 = String(BT_String.substring(8, 11));
          // B1 = String(BT_String.substring(12, 15));
          // R2 = String(BT_String.substring(21, 24));
          // G2 = String(BT_String.substring(25, 28));
          // B2 = String(BT_String.substring(29, 32));
          mate_RGB(R1, G1, B1, R2, G2, B2);
        }
        print_test("BT_String", BT_String);
        BT_String = "";
      }
      else
      {
        BT_String += BT_Input_String;
      }
    }
  }
  delay(20);
  // if (now_mode == "mode")
  // {
  //   mate_Mode(String(mode_data));
  // }
}

void mate_Mode(String mode)
{
  print_test("mate_Mode", mode);
  switch (mode.toInt())
  {
  case 1:
    mode_01();

  default:
    break;
  }
}

void mate_stop()
{
  for (int i = 0; i < NUMPIXELS; i++)
  {
    pixels1.setPixelColor(i, pixels1.Color(0, 0, 0));
    pixels1.show(); // Send the updated pixel colors to the hardware.
    pixels2.setPixelColor(i, pixels2.Color(0, 0, 0));
    pixels2.show(); // Send the updated pixel colors to the hardware.
  }
  now_mode = "stop";
  print_test("stop", "STOP");
}

void mate_RGB(int RR1, int GG1, int BB1, int RR2, int GG2, int BB2)
{
  print_test("mate_RGB R1", String(RR1));
  print_test("mate_RGB G1", String(GG1));
  print_test("mate_RGB B1", String(BB1));
  print_test("mate_RGB R2", String(RR2));
  print_test("mate_RGB G2", String(GG2));
  print_test("mate_RGB B2", String(BB2));
  for (int i = 0; i < NUMPIXELS; i++)
  { //(R, G,  B )
    pixels1.setPixelColor(i, pixels1.Color(R1, G1, B1));
    pixels1.show(); // Send the updated pixel colors to the hardware.
    pixels2.setPixelColor(i, pixels2.Color(R2, G2, B2));
    pixels2.show(); // Send the updated pixel colors to the hardware.
  }
  now_mode = "0";
}

String make_string_three(String string)
{
  while (string.length() != 3)
  {
    string = "0" + string;
  };
  return (string);
}

void print_test(String typeTxt, String inputTxt)
{
  Serial.print(typeTxt);
  Serial.print(": ");
  Serial.println(inputTxt);
}

// 以下為自訂mode
void mode_rgb(String R1, String G1, String B1, String R2, String G2, String B2)
{
  for (int i = 0; i < NUMPIXELS; i++)
  { //(R, G,  B )
    pixels1.setPixelColor(i, pixels1.Color(R1, R2, 255));
    pixels1.show(); // Send the updated pixel colors to the hardware.
    pixels2.setPixelColor(i, pixels2.Color(200, 0, 255));
    pixels2.show(); // Send the updated pixel colors to the hardware.
  }
  now_mode = "0";
}

void mode_01()
{
  for (int i = 0; i < NUMPIXELS; i++)
  { //(R, G,  B )
    pixels1.setPixelColor(i, pixels1.Color(0, 0, 255));
    pixels1.show(); // Send the updated pixel colors to the hardware.
    pixels2.setPixelColor(i, pixels2.Color(200, 0, 255));
    pixels2.show(); // Send the updated pixel colors to the hardware.
  }
  now_mode = "0";
}