#include <SoftwareSerial.h> // 引用程式庫
#include <Adafruit_NeoPixel.h>

#define PIN1 10
#define PIN2 11
#define NUMPIXELS 20
Adafruit_NeoPixel pixels1(NUMPIXELS, PIN1);
Adafruit_NeoPixel pixels2(NUMPIXELS, PIN2);

// 定義連接藍牙模組的序列埠
SoftwareSerial BT(8, 9); // 接收腳, 傳送腳
char val;                // 儲存接收資料的變數
char valA;               // 儲存接收資料的變數

void setup()
{
  Serial.begin(9600); // 與電腦序列埠連線
  Serial.println("BT is ready!");
  //  pinMode(13,OUTPUT);

  // 設定藍牙模組的連線速率
  // 如果是HC-05，請改成38400
  // 9600
  BT.begin(9600);
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
  digitalWrite(13, HIGH);
  // 若收到「序列埠監控視窗」的資料，則送到藍牙模組
  if (Serial.available())
  {
    val = Serial.read();
    BT.println(val);
  }
  bt_read();

  if (val == '1')
  {
    valA = '1';
    BT.println(valA);
    for (int i = 0; i < NUMPIXELS; i++)
    {                                     //(R, G,  B )
      pixels1.setPixelColor(i, pixels1.Color(0, 0, 255));
      pixels1.show(); // Send the updated pixel colors to the hardware.
      pixels2.setPixelColor(i, pixels2.Color(200, 0, 255));
      pixels2.show(); // Send the updated pixel colors to the hardware.
    }
    val = "";
  }
  else if (val == '2')
  {
    valA = '2';
    BT.println(valA);
    for (int i = 0; i < NUMPIXELS; i++)
    {
      pixels1.setPixelColor(i, pixels1.Color(0, 255, 255));
      pixels1.show(); // Send the updated pixel colors to the hardware.
      pixels2.setPixelColor(i, pixels2.Color(0, 255, 0));
      pixels2.show(); // Send the updated pixel colors to the hardware.
    }
    val = "";
  }
  else if (val == '0')
  {
    valA = '0';
    BT.println(valA);
    for (int i = 0; i < NUMPIXELS; i++)
    {
      pixels1.setPixelColor(i, pixels1.Color(0, 0, 0));
      pixels1.show(); // Send the updated pixel colors to the hardware.
      pixels2.setPixelColor(i, pixels2.Color(0, 0, 0));
      pixels2.show(); // Send the updated pixel colors to the hardware.
    }
    val = "";
  }
  else if (val == '3')
  {
    valA = '3';
    BT.println(valA);
    for (int i = 0; i < NUMPIXELS; i++)
    {
      pixels1.setPixelColor(i, pixels1.Color(255, 0, 0));
      pixels1.show(); // Send the updated pixel colors to the hardware.
      pixels2.setPixelColor(i, pixels2.Color(0, 0, 255));
      pixels2.show(); // Send the updated pixel colors to the hardware.
    }
    val = "";
  }
  else if (val == '4')
  {
    valA = '4';
    BT.println(valA);
    pixels1.clear(); // Set all pixel colors to 'off'
    pixels2.clear(); // Set all pixel colors to 'off'
    while (val == '4')
    {
      for (int i = 0; i < NUMPIXELS; i++)
      {
        pixels1.setPixelColor(i, pixels1.Color(0, 0, 255));
        pixels1.show(); // Send the updated pixel colors to the hardware.
        pixels2.setPixelColor(i, pixels2.Color(200, 0, 255));
        pixels2.show(); // Send the updated pixel colors to the hardware.
      }
      bt_read();
      if (val != '4')
      {
        break;
      }
      delay(50);
      bt_read();
      if (val != '4')
      {
        break;
      }
      for (int i = 0; i < NUMPIXELS; i++)
      {
        pixels1.setPixelColor(i, pixels1.Color(0, 0, 0));
        pixels1.show(); // Send the updated pixel colors to the hardware.
        pixels2.setPixelColor(i, pixels2.Color(0, 0, 0));
        pixels2.show(); // Send the updated pixel colors to the hardware.
      }
      delay(50);
      bt_read();
    };
  }
  else if (val == '5')
  {
    valA = '5';
    BT.println(valA);
    pixels1.clear(); // Set all pixel colors to 'off'
    pixels2.clear(); // Set all pixel colors to 'off'
    while (val == '5')
    {
      for (int i = 0; i < NUMPIXELS; i++)
      {
        pixels1.setPixelColor(i, pixels1.Color(0, 0, 255));
        pixels1.show(); // Send the updated pixel colors to the hardware.
        pixels2.setPixelColor(i, pixels2.Color(255, 0, 0));
        pixels2.show(); // Send the updated pixel colors to the hardware.
      }
      bt_read();
      if (val != '5')
      {
        break;
      }
      delay(500);
      bt_read();
      if (val != '5')
      {
        break;
      }
      for (int i = 0; i < NUMPIXELS; i++)
      {
        pixels1.setPixelColor(i, pixels1.Color(255, 0, 0));
        pixels1.show(); // Send the updated pixel colors to the hardware.
        pixels2.setPixelColor(i, pixels2.Color(0, 0, 255));
        pixels2.show(); // Send the updated pixel colors to the hardware.
      }
      delay(500);
      bt_read();
    };
  }
}

void bt_read()
{ // 若收到藍牙模組的資料，則送到「序列埠監控視窗」
  if (BT.available())
  {
    val = BT.read();
    Serial.println(val);
  }
  return val;
}
