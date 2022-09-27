#include "BluetoothSerial.h"

#include <Adafruit_NeoPixel.h>
<<<<<<< HEAD

#define PIN1 10
#define PIN2 11
#define NUMPIXELS 20
Adafruit_NeoPixel pixels1(NUMPIXELS, PIN1);
Adafruit_NeoPixel pixels2(NUMPIXELS, PIN2);
=======
#ifdef __AVR__
#include <avr/power.h> // Required for 16 MHz Adafruit Trinket
#endif

// Which pin on the Arduino is connected to the NeoPixels?
// On a Trinket or Gemma we suggest changing this to 1:
#define LED_PIN_one 19
#define LED_PIN_two 33

// How many NeoPixels are attached to the Arduino?
#define LED_COUNT 60

// Declare our NeoPixel strip object:
Adafruit_NeoPixel strip1(LED_COUNT, LED_PIN_one, NEO_GRB + NEO_KHZ800);
Adafruit_NeoPixel strip2(LED_COUNT, LED_PIN_two, NEO_GRB + NEO_KHZ800);
// Argument 1 = Number of pixels in NeoPixel strip
// Argument 2 = Arduino pin number (most are valid)
// Argument 3 = Pixel type flags, add together as needed:
//   NEO_KHZ800  800 KHz bitstream (most NeoPixel products w/WS2812 LEDs)
//   NEO_KHZ400  400 KHz (classic 'v1' (not v2) FLORA pixels, WS2811 drivers)
//   NEO_GRB     Pixels are wired for GRB bitstream (most NeoPixel products)
//   NEO_RGB     Pixels are wired for RGB bitstream (v1 FLORA pixels, not v2)
//   NEO_RGBW    Pixels are wired for RGBW bitstream (NeoPixel RGBW products)
>>>>>>> master

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
          String R, G, B;
          // rgb(255,255,255)
          // 0123456789
          R = String(BT_String.substring(4, 7));
          G = String(BT_String.substring(8, 11));
          B = String(BT_String.substring(12, 15));
          mate_RGB(R, G, B);
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
  if (now_mode == "mode")
  {
    mate_Mode(String(mode_data));
  }
}

void mate_Mode(String mode)
{
  print_test("mate_Mode", mode);
}

void stop()
{
<<<<<<< HEAD
  for (int i = 0; i < NUMPIXELS; i++)
  {
    pixels1.setPixelColor(i, pixels1.Color(0, 0, 0));   
    pixels1.show(); // Send the updated pixel colors to the hardware.
    pixels2.setPixelColor(i, pixels2.Color(0, 0, 0));
    pixels2.show(); // Send the updated pixel colors to the hardware.
  }
=======
  colorWipe(strip1.Color(0, 0, 0), 0);
  colorWipe(strip2.Color(0, 0, 0), 0);
>>>>>>> master
  print_test("stop", "STOP");
}

void mate_RGB(String R, String G, String B)
{
  print_test("mate_RGB R", String(R));
  print_test("mate_RGB G", String(G));
  print_test("mate_RGB B", String(B));
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

<<<<<<< HEAD
=======
void colorWipe(uint32_t color, int wait)
{
  for (int i = 0; i < strip1.numPixels(); i++)
  {
    strip1.setPixelColor(i, color);
    strip2.setPixelColor(i, color);
    strip1.show();
    strip2.show();
    delay(wait);
  }
}
>>>>>>> master

// 以下為自訂mode
void mode01()
{
}
