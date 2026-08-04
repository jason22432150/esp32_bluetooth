#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <Adafruit_NeoPixel.h>

// Nordic UART Service（NUS）UUID — 與手機 App / nRF Connect 對齊
#define BLE_DEVICE_NAME "ESP32_BT"
#define NUS_SERVICE_UUID "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
#define NUS_RX_UUID "6E400002-B5A3-F393-E0A9-E50E24DCCA9E" // Central → ESP32
#define NUS_TX_UUID "6E400003-B5A3-F393-E0A9-E50E24DCCA9E" // ESP32 → Central (notify)

#define PIN1 18
#define PIN2 33
#define NUMPIXELS 20
Adafruit_NeoPixel pixels1(NUMPIXELS, PIN1);
Adafruit_NeoPixel pixels2(NUMPIXELS, PIN2);

BLEServer *pServer = nullptr;
BLECharacteristic *pTxCharacteristic = nullptr;
bool deviceConnected = false;
bool oldDeviceConnected = false;

String now_mode = "stop";
String BT_String = "";
volatile bool commandReady = false; // BLE onWrite 收到 '%' 時設為 true
long rainbow1_data = 0;
byte mode_2_index = 0;
int mode_2_wait = 300;
int mode_3_wait = 100;
byte mode_3_index = 0;
byte mode_5_wait = 0;
byte mode_5_index = 0;
byte mode_5_data = 0;
uint16_t rainbow2_data = 0;

void parseCommand();
void notifyTx(const String &msg);

// 連線 / 斷線回調：斷線後需重新開始 advertising
class ServerCallbacks : public BLEServerCallbacks
{
  void onConnect(BLEServer *server) override
  {
    deviceConnected = true;
    Serial.println("BLE connected");
  }

  void onDisconnect(BLEServer *server) override
  {
    deviceConnected = false;
    Serial.println("BLE disconnected");
  }
};

// RX Characteristic：累積字元，遇到 '%' 標記指令可解析
class RxCallbacks : public BLECharacteristicCallbacks
{
  void onWrite(BLECharacteristic *pCharacteristic) override
  {
    // ESP32 Arduino 2.x：getValue() 回傳 std::string
    std::string value = pCharacteristic->getValue();
    if (value.empty())
      return;

    for (size_t i = 0; i < value.length(); i++)
    {
      char c = value[i];
      if (c == '%')
      {
        commandReady = true;
        break;
      }
      BT_String += c;
    }
  }
};

// 兩條 strip 一次填色、各 show 一次（避免迴圈內 show 造成 N 倍傳輸）
void fillBoth(uint32_t c1, uint32_t c2)
{
  for (int i = 0; i < NUMPIXELS; i++)
  {
    pixels1.setPixelColor(i, c1);
    pixels2.setPixelColor(i, c2);
  }
  pixels1.show();
  pixels2.show();
}

void setup()
{
  Serial.begin(115200);

  BLEDevice::init(BLE_DEVICE_NAME);
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());

  BLEService *pService = pServer->createService(NUS_SERVICE_UUID);

  pTxCharacteristic = pService->createCharacteristic(
      NUS_TX_UUID,
      BLECharacteristic::PROPERTY_NOTIFY);
  pTxCharacteristic->addDescriptor(new BLE2902());

  BLECharacteristic *pRxCharacteristic = pService->createCharacteristic(
      NUS_RX_UUID,
      BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_WRITE_NR);
  pRxCharacteristic->setCallbacks(new RxCallbacks());

  pService->start();
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(NUS_SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  BLEDevice::startAdvertising();

  Serial.println("BLE UART ready. Device name: ESP32_BT");
  Serial.println("NUS Service: 6E400001-B5A3-F393-E0A9-E50E24DCCA9E");

  pixels1.begin();
  pixels2.begin();
  fillBoth(0, 0);
}

void loop()
{
  // USB Serial 也可送指令（方便本機 debug，同樣以 % 結尾）
  while (Serial.available())
  {
    char c = Serial.read();
    if (c == '%')
    {
      commandReady = true;
      break;
    }
    if (c != '\r' && c != '\n')
      BT_String += c;
  }

  if (commandReady)
  {
    commandReady = false;
    parseCommand();
    BT_String = "";
  }

  // 斷線後重新廣播，讓手機可再次掃描連線
  if (!deviceConnected && oldDeviceConnected)
  {
    delay(500);
    pServer->startAdvertising();
    Serial.println("BLE advertising restarted");
    oldDeviceConnected = deviceConnected;
  }
  if (deviceConnected && !oldDeviceConnected)
  {
    oldDeviceConnected = deviceConnected;
    notifyTx("OK\n");
  }

  if (now_mode == "rainbow1")
  {
    rainbow1(0);
  }
  else if (now_mode == "rainbow2")
  {
    rainbow2(50);
  }
  else if (now_mode == "2")
  {
    mode_02();
    delay(mode_2_wait);
  }
  else if (now_mode == "3")
  {
    mode_03();
    delay(mode_3_wait);
  }
  else if (now_mode == "5")
  {
    mode_05();
    delay(mode_5_wait);
  }
}

void notifyTx(const String &msg)
{
  if (!deviceConnected || pTxCharacteristic == nullptr)
    return;
  pTxCharacteristic->setValue(msg.c_str());
  pTxCharacteristic->notify();
}

/** 解析已累積的 BT_String（不含結尾 '%'）並執行對應燈效 */
void parseCommand()
{
  if (BT_String.indexOf("stop") != -1)
  {
    mate_stop();
    now_mode = "stop";
  }
  else if (BT_String.indexOf("mode") != -1)
  {
    now_mode = "mode";
    mate_Mode(BT_String.substring(4));
  }
  else if (BT_String.indexOf("rainbow1") != -1)
  {
    now_mode = "rainbow1";
    rainbow1(0);
  }
  else if (BT_String.indexOf("rainbow2") != -1)
  {
    now_mode = "rainbow2";
    rainbow2(50);
  }
  else if (BT_String.indexOf("rgb") != -1)
  {
    // rgb255,000,255,000,255,255
    now_mode = "rgb";
    int R_str1 = BT_String.substring(3, 6).toInt();
    int G_str1 = BT_String.substring(7, 10).toInt();
    int B_str1 = BT_String.substring(11, 14).toInt();
    int R_str2 = BT_String.substring(15, 18).toInt();
    int G_str2 = BT_String.substring(19, 22).toInt();
    int B_str2 = BT_String.substring(23, 26).toInt();
    mode_rgb(R_str1, G_str1, B_str1, R_str2, G_str2, B_str2);
  }

  notifyTx(BT_String + "\n");
}

void mate_Mode(String mode)
{
  int m = mode.toInt();
  if (m == 1)
    mode_01();
  else if (m == 2)
    mode_02();
  else if (m == 3)
    mode_03();
  else if (m == 4)
    mode_04();
  else if (m == 5)
    mode_05();
}

void mate_stop()
{
  fillBoth(0, 0);
  now_mode = "stop";
  print_test("stop", "STOP");
}

void print_test(String typeTxt, String inputTxt)
{
  Serial.print(typeTxt);
  Serial.print(": ");
  Serial.println(inputTxt);
}

void mode_rgb(int R_int1, int G_int1, int B_int1, int R_int2, int G_int2, int B_int2)
{
  print_test("mode_rgb", BT_String);
  fillBoth(pixels1.Color(R_int1, G_int1, B_int1),
           pixels2.Color(R_int2, G_int2, B_int2));
  now_mode = "rgb";
}

void mode_01() // 籃 紫
{
  print_test("mate_Mode", "1");
  fillBoth(pixels1.Color(0, 0, 255), pixels2.Color(200, 0, 255));
  now_mode = "0";
}

void mode_02() // 紅 藍 閃
{
  print_test("mate_Mode", "2");
  if (mode_2_index == 0)
  {
    fillBoth(pixels1.Color(0, 0, 255), pixels2.Color(255, 0, 0));
    mode_2_index = 1;
  }
  else
  {
    fillBoth(pixels1.Color(255, 0, 0), pixels2.Color(0, 0, 255));
    mode_2_index = 0;
  }
  now_mode = "2";
}

void mode_03() // 藍 紫 閃
{
  print_test("mate_Mode", "3");
  if (mode_3_index == 0)
  {
    fillBoth(pixels1.Color(0, 0, 255), pixels2.Color(200, 0, 255));
    mode_3_index = 1;
  }
  else
  {
    fillBoth(0, 0);
    mode_3_index = 0;
  }
  now_mode = "3";
}

void mode_04() // 白 白
{
  print_test("mate_Mode", "4");
  fillBoth(pixels1.Color(127, 127, 127), pixels2.Color(127, 127, 127));
  now_mode = "0";
}

void mode_05() // 紅 呼吸燈
{
  print_test("mate_Mode", "5");
  if (mode_5_index == 0)
  {
    if (mode_5_data < 100)
      mode_5_data++;
    else
      mode_5_index = 1;
  }
  else
  {
    if (mode_5_data > 0)
      mode_5_data--;
    else
      mode_5_index = 0;
  }
  uint32_t c = pixels1.Color(mode_5_data, 0, 0);
  fillBoth(c, c);
  now_mode = "5";
}

void rainbow1(int wait) // 彩色流水燈
{
  print_test("rainbow", "rainbow1");
  if (rainbow1_data < 65536)
  {
    rainbow1_data += 32;
    pixels1.rainbow(rainbow1_data);
    pixels2.rainbow(rainbow1_data);
    pixels1.show();
    pixels2.show();
    delay(wait);
  }
  else
  {
    rainbow1_data = 0;
  }
}

void rainbow2(uint8_t wait)
{
  if (rainbow2_data < 256)
  {
    rainbow2_data++;
    for (uint16_t i = 0; i < pixels1.numPixels(); i++)
      pixels1.setPixelColor(i, Wheel((i + rainbow2_data) & 255));
    for (uint16_t i = 0; i < pixels2.numPixels(); i++)
      pixels2.setPixelColor(i, Wheel((i + rainbow2_data) & 255));
    pixels1.show();
    pixels2.show();
    delay(wait);
  }
  else
  {
    rainbow2_data = 0;
  }
}

uint32_t Wheel(byte WheelPos)
{
  WheelPos = 255 - WheelPos;
  if (WheelPos < 85)
    return pixels1.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  if (WheelPos < 170)
  {
    WheelPos -= 85;
    return pixels1.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
  WheelPos -= 170;
  return pixels1.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
}
