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
// char BT_Input_String;
String now_mode = "stop";
String mode_data = "";
String BT_String = "";
long PixelHue = 0;
byte mode_2_index = 0;
int mode_2_wait = 1000;
int mode_3_wait = 500;
byte mode_3_index = 0;

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
    BT_Input_String = SerialBT.read();
    if (String(BT_Input_String) != "")
    {
      if (String(BT_Input_String) == "%")
      {
        if (BT_String.indexOf("stop") != -1)
        {
          // stop
          mate_stop();
          now_mode = "stop";
          i
              BT_String = "";
        }
        if (BT_String.indexOf("mode") != -1)
        {
          // mode123
          now_mode = "mode";
          mode_data = String(BT_String.substring(4, BT_String.length()));
          mate_Mode(String(BT_String.substring(4, BT_String.length())));
          BT_String = "";
        }
        else if (BT_String.indexOf("rainbow") != -1)
        {
          // mode123
          now_mode = "rainbow";
          rainbow(0);
          BT_String = "";
        }
        else if (BT_String.indexOf("rgb") != -1)
        {
          int R_str1, G_str1, B_str1, R_str2, G_str2, B_str2;
          // rgb(255,000,255),rgb(000,255,255)
          // rgb255,000,255,000,255,255
          // 0000000000111111111122222222223333
          // 0123456789012345678901234567890123
          now_mode = "rgb";
          R_str1 = BT_String.substring(3, 6).toInt();
          G_str1 = BT_String.substring(7, 10).toInt();
          B_str1 = BT_String.substring(11, 14).toInt();
          R_str2 = BT_String.substring(15, 18).toInt();
          G_str2 = BT_String.substring(19, 22).toInt();
          B_str2 = BT_String.substring(23, 26).toInt();
          mode_rgb(R_str1, G_str1, B_str1, R_str2, G_str2, B_str2);
        }
        BT_String = "";
      }
      else
      {
        BT_String += BT_Input_String;
      }
    }
  }
  if (now_mode == "rainbow")
  {
    // mate_Mode(String(mode_data));
    rainbow(0);
  }
  else if (now_mode == "2")
  {
    // mate_Mode(String(mode_data));
    mode_02();
    delay(mode_2_wait);
  }
  else if (now_mode == "3")
  {
    // mate_Mode(String(mode_data));
    mode_03();
    delay(mode_3_wait);
  }
  // else
  // {
  //   delay(20);
  // }
}

String SerialBT_read()
{
  if (SerialBT.available())
  {
    //藍牙端接受資料發送到電腦
    char BT_Input_String = SerialBT.read();
    if (String(BT_Input_String) != "")
    {
      if (String(BT_Input_String) == "%")
      {
        return BT_String;
      }
      else
      {
        BT_String += BT_Input_String;
      }
    }
  }
}

void mate_Mode(String mode)
{
  if (mode.toInt() == 1)
    mode_01();
  else if (mode.toInt() == 2)
    mode_02();
  else if (mode.toInt() == 3)
    mode_03();
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

// void mate_RGB(int RR1, int GG1, int BB1, int RR2, int GG2, int BB2)
// {
//   print_test("mate_RGB R1", String(RR1));
//   print_test("mate_RGB G1", String(GG1));
//   print_test("mate_RGB B1", String(BB1));
//   print_test("mate_RGB R2", String(RR2));
//   print_test("mate_RGB G2", String(GG2));
//   print_test("mate_RGB B2", String(BB2));
// }

// String make_string_three(String string)
// {
//   while (string.length() != 3)
//   {
//     string = "0" + string;
//   };
//   return (string);
// }

void print_test(String typeTxt, String inputTxt)
{
  Serial.print(typeTxt);
  Serial.print(": ");
  Serial.println(inputTxt);
}

// 以下為自訂mode
void mode_rgb(int R_int1, int G_int1, int B_int1, int R_int2, int G_int2, int B_int2)
{
  print_test("mode_rgb", BT_String);
  for (int i = 0; i < NUMPIXELS; i++)
  { //(R, G,  B )
    pixels1.setPixelColor(i, pixels1.Color(R_int1, G_int1, B_int1));
    pixels1.show(); // Send the updated pixel colors to the hardware.
    pixels2.setPixelColor(i, pixels2.Color(R_int2, G_int2, B_int2));
    pixels2.show(); // Send the updated pixel colors to the hardware.
  }
  now_mode = "rgb";
}

void mode_01() //籃 紫
{
  print_test("mate_Mode", "1");
  for (int i = 0; i < NUMPIXELS; i++)
  { //(R, G,  B )
    pixels1.setPixelColor(i, pixels1.Color(0, 0, 255));
    pixels1.show(); // Send the updated pixel colors to the hardware.
    pixels2.setPixelColor(i, pixels2.Color(200, 0, 255));
    pixels2.show(); // Send the updated pixel colors to the hardware.
  }
  now_mode = "0";
}

void mode_02() //紅 藍 閃
{
  print_test("mate_Mode", "2");
  if (mode_2_index == 0)
  {
    for (int i = 0; i < NUMPIXELS; i++)
    { //(R, G,  B )
      pixels1.setPixelColor(i, pixels1.Color(0, 0, 255));
      pixels1.show(); // Send the updated pixel colors to the hardware.
      pixels2.setPixelColor(i, pixels2.Color(255, 0, 0));
      pixels2.show(); // Send the updated pixel colors to the hardware.
    }
    mode_2_index = 1;
  }
  else if (mode_2_index == 1)
  {
    for (int i = 0; i < NUMPIXELS; i++)
    { //(R, G,  B )
      pixels1.setPixelColor(i, pixels1.Color(255, 0, 0));
      pixels1.show(); // Send the updated pixel colors to the hardware.
      pixels2.setPixelColor(i, pixels2.Color(0, 0, 255));
      pixels2.show(); // Send the updated pixel colors to the hardware.
    }
    mode_2_index = 0;
  }
  // delay(mode_2_wait);
  now_mode = "2";
}

void mode_03() //藍 紫 閃
{
  print_test("mate_Mode", "3");
  if (mode_3_index == 0)
  {
    for (int i = 0; i < NUMPIXELS; i++)
    { //(R, G,  B )
      pixels1.setPixelColor(i, pixels1.Color(0, 0, 255));
      pixels1.show(); // Send the updated pixel colors to the hardware.
      pixels2.setPixelColor(i, pixels2.Color(255, 0, 0));
      pixels2.show(); // Send the updated pixel colors to the hardware.
    }
    mode_3_index = 1;
  }
  else if (mode_3_index == 1)
  {
    for (int i = 0; i < NUMPIXELS; i++)
    { //(R, G,  B )
      pixels1.setPixelColor(i, pixels1.Color(0, 0, 0));
      pixels1.show(); // Send the updated pixel colors to the hardware.
      pixels2.setPixelColor(i, pixels2.Color(0, 0, 0));
      pixels2.show(); // Send the updated pixel colors to the hardware.
    }
    mode_3_index = 0;
  }
  // delay(mode_3_wait);
  now_mode = "3";
}

void rainbow(int wait) //彩色流水燈
{
  print_test("rainbow", "rainbow");
  // Hue of first pixel runs 5 complete loops through the color wheel.
  // Color wheel has a range of 65536 but it's OK if we roll over, so
  // just count from 0 to 5*65536. Adding 256 to firstPixelHue each time
  // means we'll make 5*65536/256 = 1280 passes through this loop:
  // for (PixelHue < 5 * 65536; PixelHue += 256)
  if (PixelHue < 65536)
  {
    PixelHue += 16; // 256
    // strip.rainbow() can take a single argument (first pixel hue) or
    // optionally a few extras: number of rainbow repetitions (default 1),
    // saturation and value (brightness) (both 0-255, similar to the
    // ColorHSV() function, default 255), and a true/false flag for whether
    // to apply gamma correction to provide 'truer' colors (default true).
    pixels1.rainbow(PixelHue);
    pixels2.rainbow(PixelHue);
    // Above line is equivalent to:
    // strip.rainbow(firstPixelHue, 1, 255, 255, true);
    pixels1.show(); // Update strip with new contents
    pixels2.show(); // Update strip with new contents
    delay(wait);    // Pause for a moment
  }
  else
  {
    PixelHue = 0;
  }
}
