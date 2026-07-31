# esp32_bluetooth

ESP32 透過經典藍牙 (Bluetooth Classic / SPP) 接收指令，控制兩條 NeoPixel LED 燈條。

## 硬體

| 項目 | 說明 |
|------|------|
| 板子 | NodeMCU-32S（或其他 ESP32） |
| 燈條 1 | GPIO **18**，20 顆 |
| 燈條 2 | GPIO **33**，20 顆 |
| 藍牙名稱 | `ESP32_BT` |

腳位與顆數可在 `esp32_bluetooth.ino` 頂端的 `PIN1` / `PIN2` / `NUMPIXELS` 調整。

## 相依函式庫

- **BluetoothSerial**（ESP32 Arduino core 內建）
- [Adafruit NeoPixel](https://github.com/adafruit/Adafruit_NeoPixel)

Arduino IDE：請啟用 ESP32 的 Bluetooth（Bluedroid）。若編譯出現 `Bluetooth is not enabled`，檢查板子設定。

## 燒錄

1. 安裝 ESP32 board support 與 Adafruit NeoPixel
2. 開啟 `esp32_bluetooth.ino`
3. 選擇板子（例如 NodeMCU-32S）與對應 port
4. Upload

序列埠監控視窗建議 **115200** baud。

### 手動進入 download mode

若 Upload 出現 `Wrong boot mode`、`No serial data received` 或 `serial noise`，表示板子未進入燒錄模式，可手動操作：

1. 關閉 Serial Monitor（避免佔用 COM 埠）後再按 Upload
2. 出現 `Connecting...` 時**按住 BOOT**（有的板子標為 IO0）
3. 若仍連不上：按住 BOOT → 按一下 **EN / RESET** → 鬆開 EN
4. 看到開始寫入（例如 `Writing at 0x...`）後再鬆開 BOOT

上傳不穩時可將 `platformio.ini` 的 `upload_speed` 降為 `115200`，並確認使用資料用 USB 線。

## 藍牙協定

指令以字元組成，**以 `%` 結尾**。未收到 `%` 前會跨次累積，收到後才解析並清空。

| 指令 | 範例 | 效果 |
|------|------|------|
| 停止 | `stop%` | 兩條燈全關 |
| 預設模式 | `mode1%` … `mode5%` | 見下方模式表 |
| 彩虹流水 | `rainbow1%` | 持續彩虹動畫 |
| 彩虹輪轉 | `rainbow2%` | 另一種彩虹動畫 |
| 指定 RGB | `rgb255,000,255,000,255,255%` | 燈條1 + 燈條2 各一組 RGB |

### RGB 格式

固定長度，三位數字、逗號分隔：

```text
rgbRRR,GGG,BBB,RRR,GGG,BBB%
     └─ 燈條1 ─┘ └─ 燈條2 ─┘
```

例：`rgb255,000,000,000,000,255%` → 燈條1 紅、燈條2 藍。

### 預設模式

| mode | 說明 |
|------|------|
| 1 | 藍 / 紫（靜態） |
| 2 | 紅藍交換閃爍 |
| 3 | 藍紫閃爍 |
| 4 | 白 / 白（靜態） |
| 5 | 紅色呼吸燈 |

可用手機藍牙 Serial App（支援 SPP）連線後送上述字串測試。

## 專案檔案

| 檔案 | 說明 |
|------|------|
| `esp32_bluetooth.ino` | ESP32 主程式 |
| `uno_bluetooth_LED_01.txt` | 早期 Arduino Uno + HC-05 參考程式 |

## 注意

- Classic Bluetooth，需支援 SPP 的客戶端；iOS 一般無法直接用。
- 動畫模式（2 / 3 / 5 / rainbow）執行期間仍會讀藍牙，但 `delay` 可能讓切換略有延遲。
- 若收到錯亂指令，送 `stop%` 可關燈並回到停止狀態。
