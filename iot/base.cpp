#include <LiquidCrystal_I2C.h>
#include <WiFiS3.h>
#include <Wire.h>
#include <EEPROM.h>
#include <HX711.h>
#include <WiFiUdp.h>
#include <ArduinoMDNS.h>

// ================= LCD I2C =================
LiquidCrystal_I2C lcd(0x27, 16, 2);

// ================= PIN =================
#define LED_R 10      // Red LED
#define LED_G 11      // Green LED
#define LED_B 12      // Blue LED
#define BUZZER 3      // Buzzer
#define LOADCELL_DOUT_PIN 6   // HX711 Data
#define LOADCELL_SCK_PIN 5    // HX711 Clock

// ================= VPS CONFIGURATION - COOLIFY =================
const char* vps_host = "YOUR_VPS"; 
const int vps_port = 5000;  
String deviceToken = "YOUR_TOKEN_DEVICE";
String deviceName = "Nutriplate";

// ================= STATIC IP CONFIGURATION =================
IPAddress local_IP(192, 168, 18, 150);
IPAddress gateway(192, 168, 18, 1);      
IPAddress subnet(255, 255, 255, 0);      
IPAddress dns(8, 8, 8, 8);

// ================= IP UNTUK AP MODE =================
IPAddress ap_IP(192, 168, 4, 1);
IPAddress ap_gateway(192, 168, 4, 1);     
IPAddress ap_subnet(255, 255, 255, 0);
// ================= HX711 =================
HX711 scale;
float calibration_factor = 430.0;
#define CALIBRATION_ADDR 300
bool weight_correction_applied = false;

// ================= WIFI & MDNS =================
WiFiServer server(80);
WiFiUDP udp;
MDNS mdns(udp);
String pairToken = "YOUR_TOKEN_DEVICE";
String savedSSID = "";
String savedPASS = "";

// ================= EEPROM =================
#define SSID_ADDR 0
#define PASS_ADDR 100
#define MAGIC_NUMBER 0x55AA
#define MAGIC_ADDR 250

String getTokenId() {
  return pairToken;
}

String getDeviceName() {
  return "Nutriplate ";
}

// ================= STATE MACHINE =================
enum State {
  BOOT,
  WIFI_CONNECT,
  IDLE,
  WEIGHING,
  HOLDING,
  SENDING,
  CALIBRATING,
  CONFIG_MODE
};
State state = BOOT;

// ================= VARIABLES =================
float current_weight = 0.0;
float stable_weight = 0.0;
bool screenDrawn = false;
bool apStarted = false;
bool wifiConnected = false;

unsigned long weigh_start_time = 0;
unsigned long hold_start_time = 0;
unsigned long lastVPSSend = 0;
const unsigned long VPS_SEND_INTERVAL = 3000;
unsigned long apStartTime = 0;

// ================= FUNCTION DECLARATIONS =================
void initScale();
float readWeight();
void saveCalibrationFactor();
void beep(int n);
void beepShort(int n);
void setLED(bool r, bool g, bool b);
void setLEDState(State s);
void loadWiFiCredentials();
void resetWiFiCredentials();
String readStringFromEEPROM(int addr, int maxLen);
bool saveWiFiCredentials(String ssid, String pass);
bool connectToWiFi();
void startAPMode();
void resetToIdle();
void startWeighing();
void enterHoldMode(float weight);
void rebootDevice();
void handleAPIRequest(String request, WiFiClient &client);
void sendPairingPage(WiFiClient &client);
void sendSuccessPage(WiFiClient &client);
void parseFormData(String body, String &ssid, String &pass, String &token);
void enterConfigMode();
void testLoadCellPolarity();
void correctNegativeWeight();
void calibrateWithKnownWeight();
String getStateString();
void sendStatusToVPS();
void sendCommandExecuted(String command);
void testVPSConnection();

// ================= SETUP =================
void setup() {
  Serial.begin(115200);
  delay(5000);

  Serial.println("==================================");
  Serial.println("   NUTRIPLATE SCALE 5KG v2.1");
  Serial.println("   WITH COOLIFY CLOUD SUPPORT");
  Serial.println("==================================");
  Serial.print("Device Token: ");
  Serial.println(deviceToken);
  Serial.print("Device Name: ");
  Serial.println(deviceName);
  Serial.println("==================================");
  Serial.println("SERIAL COMMANDS:");
  Serial.println("  t - Tare");
  Serial.println("  m - Manual IDLE");
  Serial.println("  c - Config/pairing mode");
  Serial.println("  s - Status");
  Serial.println("  r - Reboot");
  Serial.println("==================================");

  pinMode(LED_R, OUTPUT);
  pinMode(LED_G, OUTPUT);
  pinMode(LED_B, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  setLED(HIGH, HIGH, HIGH);

  Wire.begin();
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.print("NUTRIPLATE 5KG");
  lcd.setCursor(0, 1);
  lcd.print("Cloud Ready...");
  beep(1);

  initScale();
  loadWiFiCredentials();

  if (savedSSID.length() > 0) {
    state = WIFI_CONNECT;
    lcd.clear();
    lcd.print("Connecting WiFi");
  } else {
    state = CONFIG_MODE;
    lcd.clear();
    lcd.print("No WiFi Saved");
    lcd.setCursor(0, 1);
    lcd.print("Pairing Mode");
  }
}

// ================= HX711 FUNCTIONS =================
void initScale() {
  Serial.println("Initializing HX711 5KG...");
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  EEPROM.get(CALIBRATION_ADDR, calibration_factor);
  
  if (isnan(calibration_factor) || calibration_factor == 0) {
    calibration_factor = 430.0;
    Serial.println("Using default calibration factor: 430.0");
  } else {
    Serial.print("Loaded calibration factor: ");
    Serial.println(calibration_factor, 2);
  }

  scale.set_scale(calibration_factor);
  Serial.println("Taring...");
  scale.tare(10);
  delay(1000);
  
  float testWeight = scale.get_units(3);
  Serial.print("Test weight after tare: ");
  Serial.println(testWeight, 1);

  if (testWeight < -100) {
    Serial.println("⚠ Negative weight detected! Auto-correcting...");
    calibration_factor = -calibration_factor;
    scale.set_scale(calibration_factor);
    saveCalibrationFactor();
    weight_correction_applied = true;
  }
  Serial.println("HX711 5KG ready!");
}

float readWeight() {
  if (scale.is_ready()) {
    return scale.get_units(5);
  }
  return 0.0;
}

void saveCalibrationFactor() {
  EEPROM.put(CALIBRATION_ADDR, calibration_factor);
}

// ================= DIAGNOSTIC FUNCTIONS =================
void testLoadCellPolarity() {
  Serial.println("\n=== LOAD CELL POLARITY TEST ===");
  Serial.println("1. Kosongkan timbangan, tekan ENTER...");
  while (!Serial.available()) {}
  Serial.read();

  long empty = scale.read_average(10);
  Serial.print("Raw value (kosong): ");
  Serial.println(empty);

  Serial.println("2. Letakkan beban 100-200g, tekan ENTER...");
  while (!Serial.available()) {}
  Serial.read();

  long withWeight = scale.read_average(10);
  Serial.print("Raw value (dengan beban): ");
  Serial.println(withWeight);

  long diff = withWeight - empty;
  Serial.print("Perbedaan: ");
  Serial.println(diff);
  Serial.println("==================================\n");
}

void correctNegativeWeight() {
  Serial.println("\n=== CORRECTING NEGATIVE WEIGHT ===");
  calibration_factor = -calibration_factor;
  scale.set_scale(calibration_factor);
  saveCalibrationFactor();
  weight_correction_applied = true;
  scale.tare(5);
  Serial.println("✅ Correction applied");
  beep(3);
}

void calibrateWithKnownWeight() {
  Serial.println("\n=== CALIBRATE WITH KNOWN WEIGHT ===");
  scale.tare(10);
  Serial.println("1. Tare completed");
  delay(2000);

  Serial.println("2. Letakkan beban yang sudah diketahui beratnya");
  Serial.print("   Masukkan berat beban (gram): ");

  while (!Serial.available()) {}
  float knownWeight = Serial.parseFloat();
  Serial.println(knownWeight);

  if (knownWeight <= 0 || knownWeight > 5000) {
    Serial.println("❌ Berat tidak valid!");
    return;
  }

  Serial.println("3. Reading... (jangan sentuh)");
  delay(3000);

  long raw = scale.read_average(20);
  Serial.print("   Raw value: ");
  Serial.println(raw);

  float oldFactor = calibration_factor;
  calibration_factor = raw / knownWeight;
  scale.set_scale(calibration_factor);
  saveCalibrationFactor();

  Serial.print("4. Calibration factor: ");
  Serial.print(oldFactor, 2);
  Serial.print(" -> ");
  Serial.println(calibration_factor, 2);
  beep(3);
}

// ================= BUZZER FUNCTIONS =================
void beep(int n) {
  for (int i = 0; i < n; i++) {
    digitalWrite(BUZZER, HIGH);
    delay(100);
    digitalWrite(BUZZER, LOW);
    delay(100);
  }
}

void beepShort(int n) {
  for (int i = 0; i < n; i++) {
    digitalWrite(BUZZER, HIGH);
    delay(50);
    digitalWrite(BUZZER, LOW);
    delay(50);
  }
}

// ================= LED FUNCTIONS =================
void setLED(bool r, bool g, bool b) {
  digitalWrite(LED_R, r);
  digitalWrite(LED_G, g);
  digitalWrite(LED_B, b);
}

void setLEDState(State s) {
  switch (s) {
    case BOOT: setLED(LOW, LOW, LOW); break;
    case CONFIG_MODE: setLED(LOW, LOW, HIGH); break;
    case WIFI_CONNECT: setLED(HIGH, HIGH, LOW); break;
    case IDLE: setLED(HIGH, LOW, HIGH); break;
    case WEIGHING: setLED(LOW, HIGH, LOW); break;
    case HOLDING: setLED(LOW, LOW, HIGH); break;
    case SENDING: setLED(LOW, HIGH, HIGH); break;
    default: break;
  }
}

// ================= EEPROM FUNCTIONS =================
void loadWiFiCredentials() {
  uint16_t magic = 0;
  EEPROM.get(MAGIC_ADDR, magic);

  if (magic != MAGIC_NUMBER) {
    savedSSID = "";
    savedPASS = "";
    return;
  }

  savedSSID = readStringFromEEPROM(SSID_ADDR, 50);
  savedPASS = readStringFromEEPROM(PASS_ADDR, 50);
  Serial.print("✅ Loaded SSID: ");
  Serial.println(savedSSID);
}

void resetWiFiCredentials() {
  for (int i = 0; i < 50; i++) {
    EEPROM.write(SSID_ADDR + i, 0);
    EEPROM.write(PASS_ADDR + i, 0);
  }
  uint16_t zero = 0;
  EEPROM.put(MAGIC_ADDR, zero);
  savedSSID = "";
  savedPASS = "";
  Serial.println("✅ WiFi credentials cleared");
}

String readStringFromEEPROM(int addr, int maxLen) {
  String result = "";
  for (int i = 0; i < maxLen; i++) {
    char c = EEPROM.read(addr + i);
    if (c == 0 || c == 255) break;
    result += c;
  }
  return result;
}

bool saveWiFiCredentials(String ssid, String pass) {
  for (int i = 0; i < 50; i++) {
    EEPROM.write(SSID_ADDR + i, 0);
    EEPROM.write(PASS_ADDR + i, 0);
  }

  int len = min(ssid.length(), 49);
  for (int i = 0; i < len; i++) {
    EEPROM.write(SSID_ADDR + i, ssid[i]);
  }
  EEPROM.write(SSID_ADDR + len, 0);

  len = min(pass.length(), 49);
  for (int i = 0; i < len; i++) {
    EEPROM.write(PASS_ADDR + i, pass[i]);
  }
  EEPROM.write(PASS_ADDR + len, 0);

  EEPROM.put(MAGIC_ADDR, MAGIC_NUMBER);
  savedSSID = ssid;
  savedPASS = pass;
  return true;
}

// ================= WIFI FUNCTIONS =================
bool connectToWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(savedSSID);

  lcd.clear();
  lcd.print("WiFi: ");
  String displaySSID = savedSSID;
  if (displaySSID.length() > 10) {
    displaySSID = displaySSID.substring(0, 10) + "...";
  }
  lcd.print(displaySSID);

  WiFi.end();
  delay(2000);

  // 🔥 COMMENT DULU BAGIAN INI
  // Serial.println("\n🔧 Configuring Static IP...");
  // WiFi.config(local_IP, gateway, subnet, dns);
  // Serial.println("Static IP configured");

  WiFi.begin(savedSSID.c_str(), savedPASS.c_str());

  unsigned long start = millis();
  int attempts = 0;

  while (WiFi.status() != WL_CONNECTED && millis() - start < 30000) {
    delay(500);
    Serial.print(".");
    attempts++;

    static bool blink = false;
    blink = !blink;
    setLED(HIGH, HIGH, blink ? LOW : HIGH);

    if (attempts % 10 == 0) {
      lcd.setCursor(0, 1);
      lcd.print("Connecting");
      for (int i = 0; i < (attempts / 10) % 4; i++) {
        lcd.print(".");
      }
      for (int i = (attempts / 10) % 4; i < 4; i++) {
        lcd.print(" ");
      }
    }
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi Connected!");
    
    delay(3000);

    IPAddress ip = WiFi.localIP();
    Serial.print("IP Address: ");
    Serial.println(ip);
    Serial.print("Gateway: ");
    Serial.println(WiFi.gatewayIP());  // 🔥 CEK GATEWAY DAPAT DARI DHCP

    if (mdns.begin(WiFi.localIP(), "nutriplate")) {
      Serial.println("✅ mDNS responder started");
      mdns.addServiceRecord("nutriplate", 80, MDNSServiceTCP, "http");
    }

    lcd.clear();
    lcd.print("WiFi Connected!");
    lcd.setCursor(0, 1);
    lcd.print("IP: " + String(ip[0]) + "." + String(ip[1]));

    beepShort(2);
    delay(1000);
    testVPSConnection();
    
    return true;
  }

  Serial.println("\n❌ WiFi Connection Failed!");
  lcd.clear();
  lcd.print("WiFi Failed!");
  return false;
}

// ================= YANG SUDAH DIPERBAIKI: START AP MODE =================
void startAPMode() {
  if (apStarted) return;
  
  String apName = "NUTRIPLATE-" + pairToken;
  Serial.print("Starting AP: ");
  Serial.println(apName);

  // RESET TOTAL
  WiFi.end();
  delay(2000);
  
  // SET KONFIGURASI KHUSUS UNTUK AP MODE - INI KUNCI UTAMA!
  WiFi.config(ap_IP, ap_gateway, ap_subnet);
  
  // START AP
  int result = WiFi.beginAP(apName.c_str());
  
  Serial.print("Result: ");
  Serial.println(result);
  
  if (result == WL_AP_LISTENING) {
    Serial.println("✅ AP started successfully");
    
    delay(2000);
    server.begin();
    apStarted = true;
    apStartTime = millis();

    IPAddress ip = WiFi.localIP();
    Serial.print("AP IP Address: ");
    Serial.println(ip);

    lcd.clear();
    lcd.print("AP: " + apName);
    lcd.setCursor(0, 1);
    lcd.print("192.168.4.1");
    
    beep(2);
  } else {
    Serial.println("❌ Failed to start AP!");
    lcd.clear();
    lcd.print("AP Failed!");
  }
}


// TEST 1: Cek Gateway
void testGateway() {
  Serial.println("\n🔍 Testing Gateway...");
  IPAddress gw = WiFi.gatewayIP();
  Serial.print("Gateway IP: ");
  Serial.println(gw);
  
 
  if (gw[0] == 0 || gw[0] == 255) {
    Serial.println("❌ Gateway not valid - DHCP mungkin gagal");
    return;
  }
  
  WiFiClient client;
  if (client.connect(gw, 80)) {
    Serial.println("✅ Gateway reachable on port 80");
    client.stop();
  } else {
    Serial.println("❌ Cannot reach gateway");
  }
}

// TEST 2: Cek Internet (Google DNS)
void testInternet() {
  Serial.println("\n🔍 Testing Internet (Google DNS)...");
  
  WiFiClient client;
  if (client.connect("8.8.8.8", 53)) {
    Serial.println("✅ Internet reachable (Google DNS)");
    client.stop();
  } else {
    Serial.println("❌ No internet access");
  }
}

// TEST 3: Cek koneksi ke IP eksternal (Google)
void testExternalIP() {
  Serial.println("\n🔍 Testing external IP (8.8.8.8)...");
  
  WiFiClient client;
  if (client.connect("8.8.8.8", 53)) {
    Serial.println("✅ Can reach external IP");
    client.stop();
  } else {
    Serial.println("❌ Cannot reach external IP");
  }
}

// TEST 4: Cek VPS dengan berbagai cara (FIXED - HAPUS client.status())
void testVPSConnection() {
  Serial.println("\n🔍 ===== VPS DIAGNOSTIC =====");
  
  // 1. Cek Gateway dulu
  IPAddress gw = WiFi.gatewayIP();
  Serial.print("1. Gateway: ");
  Serial.println(gw);
  
  // 2. Cek DNS
  Serial.print("2. Testing DNS... ");
  IPAddress vpsIP;
  if (WiFi.hostByName(vps_host, vpsIP)) {
    Serial.print("✅ Resolved: ");
    Serial.println(vpsIP);
  } else {
    Serial.println("❌ DNS failed");
  }
  
  // 3. Coba konek ke VPS
  Serial.print("3. Connecting to VPS... ");
  WiFiClient client;
  client.setTimeout(5000);
  
  if (client.connect(vps_host, vps_port)) {
    Serial.println("✅ CONNECTED!");
    
    // Kirim request sederhana
    client.println("GET / HTTP/1.1");
    client.print("Host: ");
    client.println(vps_host);
    client.println("Connection: close");
    client.println();
    
    // Tunggu response
    unsigned long timeout = millis();
    while (!client.available() && millis() - timeout < 3000) {
      delay(100);
    }
    
    if (client.available()) {
      String response = client.readString();
      Serial.println("✅ Got response");
      Serial.print("Preview: ");
      Serial.println(response.substring(0, 100));
      
      // Cek apakah response mengandung "iot" atau "status"
      if (response.indexOf("iot") >= 0 || response.indexOf("status") >= 0) {
        Serial.println("✅ VPS endpoint seems correct");
      }
    } else {
      Serial.println("⚠️ Connected but no response");
    }
    
    client.stop();
  } else {
    Serial.println("❌ CONNECTION FAILED");
    // HAPUS baris ini: Serial.println(client.status());
    // Ganti dengan:
    Serial.println("   Check: Firewall, router, or VPS");
  }
  
  Serial.println("====================================\n");
}

// ================= VPS COMMUNICATION =================
void sendStatusToVPS() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ WiFi not connected");
    return;
  }
  
  Serial.println("\n📤 ===== SENDING TO VPS =====");
  
  WiFiClient client;
  
  if (!client.connect(vps_host, vps_port)) {
    Serial.println("❌ Connection failed");
    return;
  }
  
  Serial.println("✅ Connected to VPS!");
  
  // BUILD JSON PAYLOAD
  String postData = "{";
  postData += "\"token\":\"" + deviceToken + "\",";
  postData += "\"name\":\"" + deviceName + "\",";
  postData += "\"weight\":" + String(abs(current_weight), 1) + ",";
  postData += "\"stable_weight\":" + String(abs(stable_weight), 1) + ",";
  postData += "\"status\":\"" + getStateString() + "\"";
  postData += "}";
  
  Serial.print("📦 Payload: ");
  Serial.println(postData);
  
  // 🔥 COBA BEBERAPA ENDPOINT ALTERNATIF
  
  // OPTION 1: /iot/status (current)
client.println("POST /api/iot/status HTTP/1.1");
  
  // OPTION 2: /api/iot/status (kalau endpoint-nya berbeda)
  // client.println("POST /api/iot/status HTTP/1.1");
  
  // OPTION 3: /api/device/status (dari kode lama lo)
  // client.println("POST /api/device/status HTTP/1.1");
  
  client.print("Host: ");
  client.println(vps_host);
  client.println("Content-Type: application/json");
  client.print("Content-Length: ");
  client.println(postData.length());
  client.println("Connection: close");
  client.println();
  client.println(postData);
  
  // WAIT FOR RESPONSE
  unsigned long timeout = millis();
  while (!client.available() && millis() - timeout < 5000) {
    delay(100);
  }
  
  // READ RESPONSE
  String response = "";
  while (client.available()) {
    response += (char)client.read();
  }
  
  Serial.print("📥 Response: ");
  Serial.println(response.substring(0, 200));
  
  // PARSE COMMAND FROM RESPONSE
  if (response.indexOf("tare") > 0) {
    Serial.println("⚙️ Command: TARE");
    scale.tare();
    sendCommandExecuted("tare");
    beepShort(2);
  }
  else if (response.indexOf("start-weighing") > 0) {
    Serial.println("⚙️ Command: START");
    startWeighing();
    sendCommandExecuted("start-weighing");
  }
  else if (response.indexOf("cancel-weighing") > 0) {
    Serial.println("⚙️ Command: CANCEL");
    resetToIdle();
    sendCommandExecuted("cancel-weighing");
  }
  else if (response.indexOf("hold-weight") > 0) {
    Serial.println("⚙️ Command: HOLD");
    if (state == WEIGHING) {
      enterHoldMode(current_weight);
      sendCommandExecuted("hold-weight");
    }
  }
  else if (response.indexOf("confirm-weight") > 0) {
    Serial.println("⚙️ Command: CONFIRM");
    if (state == HOLDING) {
      state = SENDING;
      screenDrawn = false;
      sendCommandExecuted("confirm-weight");
    }
  }
  else if (response.indexOf("reject-weight") > 0) {
    Serial.println("⚙️ Command: REJECT");
    if (state == HOLDING) {
      resetToIdle();
      sendCommandExecuted("reject-weight");
    }
  }
  else if (response.indexOf("reset") > 0 || response.indexOf("reboot") > 0) {
    Serial.println("⚙️ Command: RESET");
    sendCommandExecuted("reset");
    delay(1000);
    rebootDevice();
  }
  
  client.stop();
  Serial.println("✅ Done");
}

// ================= COMMAND EXECUTED =================
void sendCommandExecuted(String command) {
  if (WiFi.status() != WL_CONNECTED) return;
  
  WiFiClient client;
  if (!client.connect(vps_host, vps_port)) return;
  
  String postData = "{";
  postData += "\"token\":\"" + deviceToken + "\",";
  postData += "\"command\":\"" + command + "\",";
  postData += "\"status\":\"success\"";
  postData += "}";
  
  client.println("POST /iot/command-executed HTTP/1.1");
  client.print("Host: "); 
  client.println(vps_host);
  client.println("Content-Type: application/json");
  client.print("Content-Length: "); 
  client.println(postData.length());
  client.println("Connection: close");
  client.println();
  client.println(postData);
  
  delay(100);
  client.stop();
  
  Serial.println("✅ Command confirmed: " + command);
}
// ================= HTML PAGES =================
void sendPairingPage(WiFiClient &client) {
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: text/html");
  client.println("Connection: close");
  client.println();
  client.println(R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <title>NutriPlate Pairing</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
      background: linear-gradient(135deg, #00AF91 0%, #00856C 100%); 
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      padding: 20px; 
    }
    .container { 
      background: white; 
      border-radius: 24px; 
      padding: 32px 24px; 
      max-width: 400px; 
      width: 100%; 
      box-shadow: 0 20px 60px rgba(0,0,0,0.15); 
    }
    .header { text-align: center; margin-bottom: 32px; }
    .logo { 
      width: 80px; 
      height: 80px; 
      background: #00AF91; 
      border-radius: 20px; 
      margin: 0 auto 16px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-size: 40px; 
      color: white;
      font-weight: bold;
    }
    h1 { font-size: 24px; color: #212121; margin-bottom: 8px; }
    .subtitle { font-size: 14px; color: #9E9E9E; }
    .form-group { margin-bottom: 20px; }
    label { 
      display: block; 
      font-size: 14px; 
      font-weight: 500; 
      color: #424242; 
      margin-bottom: 8px; 
    }
    .password-container {
      position: relative;
      width: 100%;
    }
    input { 
      width: 100%; 
      height: 48px; 
      padding: 12px 16px; 
      font-size: 16px; 
      border: 1.5px solid #EEEEEE; 
      border-radius: 12px; 
      font-family: inherit;
    }
    input:focus { 
      outline: none; 
      border-color: #00AF91; 
      box-shadow: 0 0 0 3px rgba(0, 175, 145, 0.1); 
    }
    .password-input {
      padding-right: 70px !important;
    }
    .toggle-password {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      color: #00AF91;
      padding: 5px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .toggle-password:hover {
      color: #00856C;
    }
    .btn { 
      width: 100%; 
      height: 52px; 
      background: #00AF91; 
      color: white; 
      border: none; 
      border-radius: 12px; 
      font-size: 16px; 
      font-weight: 600; 
      cursor: pointer; 
      margin-top: 8px; 
      transition: all 0.3s;
    }
    .btn:hover { 
      background: #00856C; 
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 175, 145, 0.3);
    }
    .btn:active {
      transform: translateY(0);
    }
    .token-box { 
      background: #f0f7ff; 
      border: 2px dashed #2979FF; 
      border-radius: 12px; 
      padding: 16px; 
      margin-bottom: 20px; 
      text-align: center; 
    }
    .token { 
      font-family: 'Courier New', monospace; 
      font-size: 24px; 
      font-weight: bold; 
      color: #2979FF; 
      letter-spacing: 2px;
      padding: 8px 16px; 
      background: white; 
      border-radius: 8px; 
      display: inline-block; 
      margin: 8px 0; 
    }
    .info-box {
      background: #F7F7F7;
      border-radius: 12px;
      padding: 16px;
      margin-top: 24px;
      border-left: 4px solid #2979FF;
      font-size: 14px;
      color: #424242;
    }
    .info-icon {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: #2979FF;
      color: white;
      border-radius: 50%;
      text-align: center;
      line-height: 20px;
      font-size: 12px;
      font-weight: bold;
      margin-right: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">N</div>
      <h1>NutriPlate Setup</h1>
      <p class="subtitle">Hubungkan timbangan pintar ke WiFi</p>
    </div>
    
    <div class="token-box">
      <p><strong>PAIRING TOKEN:</strong></p>
      <div class="token">)rawliteral");
  client.print(pairToken);
  client.println(R"rawliteral(</div>
      <p style="font-size: 12px; color: #666; margin-top: 8px;">Token ini akan digunakan di cloud</p>
    </div>
    
    <form method="POST" action="/pair">
      <div class="form-group">
        <label for="ssid">Nama WiFi (SSID)</label>
        <input type="text" id="ssid" name="ssid" placeholder="Masukkan nama WiFi" required>
      </div>
      
      <div class="form-group">
        <label for="pass">Password WiFi</label>
        <div class="password-container">
          <input type="password" id="pass" name="pass" class="password-input" placeholder="Masukkan password" required>
          <button type="button" class="toggle-password" onclick="togglePassword()" id="toggleBtn">lihat</button>
        </div>
      </div>
      
      <div class="form-group">
        <label for="token">Token Pairing</label>
        <input type="text" id="token" name="token" placeholder="Masukkan token dari atas" required>
      </div>
      
      <button type="submit" class="btn">Hubungkan Sekarang</button>
    </form>
    
    <div class="info-box">
      <p>
        <span class="info-icon">i</span>
        <strong>Tips:</strong> Pastikan smartphone Anda terhubung ke WiFi yang sama dengan yang akan digunakan timbangan.
      </p>
    </div>
  </div>

  <script>
    function togglePassword() {
      const passwordInput = document.getElementById('pass');
      const toggleBtn = document.getElementById('toggleBtn');
      
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = 'tutup';
      } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = 'lihat';
      }
    }
  </script>
</body>
</html>
)rawliteral");
}
void sendSuccessPage(WiFiClient &client) {
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: text/html");
  client.println();
  client.println(R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <title>Success</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Arial; text-align: center; padding: 50px; background: linear-gradient(135deg, #00AF91 0%, #00856C 100%); color: white; }
    .container { background: rgba(255,255,255,0.1); border-radius: 24px; padding: 40px; max-width: 400px; margin: 0 auto; }
    .success-icon { width: 100px; height: 100px; background: white; border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; font-size: 48px; color: #00AF91; }
    h1 { font-size: 28px; margin-bottom: 16px; }
    .loading { display: inline-block; width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 1s infinite; margin-right: 10px; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="container">
    <div class="success-icon">✓</div>
    <h1>Berhasil Dipasangkan!</h1>
    <p>Device akan restart...</p>
    <p><span class="loading"></span>Restarting...</p>
  </div>
  <script>setTimeout(function(){window.location.href="/";},5000);</script>
</body>
</html>
)rawliteral");
}

// ================= FORM PARSER =================
void parseFormData(String body, String &ssid, String &pass, String &token) {
  int ssidPos = body.indexOf("ssid=");
  if (ssidPos != -1) {
    int ssidEnd = body.indexOf("&", ssidPos);
    ssid = body.substring(ssidPos + 5, ssidEnd);
    ssid.replace("+", " ");
  }
  
  int passPos = body.indexOf("pass=");
  if (passPos != -1) {
    int passEnd = body.indexOf("&", passPos);
    pass = body.substring(passPos + 5, passEnd);
  }
  
  int tokenPos = body.indexOf("token=");
  if (tokenPos != -1) {
    token = body.substring(tokenPos + 6);
    int tokenEnd = token.indexOf(' ');
    if (tokenEnd != -1) token = token.substring(0, tokenEnd);
  }
}

// ================= STATE MANAGEMENT =================
String getStateString() {
  switch(state) {
    case IDLE: return "ready";
    case WEIGHING: return "weighing";
    case HOLDING: return "holding";
    case SENDING: return "sending";
    default: return "unknown";
  }
}

void resetToIdle() {
  state = IDLE;
  screenDrawn = false;
  stable_weight = 0;
  beep(1);
}

void startWeighing() {
  if (state == IDLE) {
    state = WEIGHING;
    screenDrawn = false;
    weigh_start_time = millis();
    beepShort(1);
  }
}

void enterHoldMode(float weight) {
  if (weight < -50) {
    resetToIdle();
    return;
  }
  state = HOLDING;
  screenDrawn = false;
  stable_weight = weight;
  hold_start_time = millis();
  beep(2);
}

void enterConfigMode() {
  state = CONFIG_MODE;
  apStarted = false;
  screenDrawn = false;
  if (WiFi.status() == WL_CONNECTED) WiFi.disconnect();
  lcd.clear();
  lcd.print("CONFIG MODE");
  lcd.setCursor(0, 1);
  lcd.print("Token: " + pairToken);
  beep(3);
}

void rebootDevice() {
  Serial.println("🔄 Rebooting...");
  lcd.clear();
  lcd.print("Rebooting...");
  delay(2000);
  NVIC_SystemReset();
}

// ================= WEB API HANDLERS =================
void handleAPIRequest(String request, WiFiClient &client) {
  if (request.indexOf("GET /api/status") != -1) {
    String status = getStateString();
    
    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: application/json");
    client.println();
    client.print("{\"token\":\"");
    client.print(deviceToken);
    client.print("\",\"name\":\"");
    client.print(deviceName);
    client.print("\",\"status\":\"");
    client.print(status);
    client.print("\",\"weight\":");
    client.print(abs(current_weight), 1);
    client.println("}");
  }
  
  else if (request.indexOf("POST /api/tare") != -1) {
    scale.tare();
    resetToIdle();
    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: application/json");
    client.println("{\"success\":true}");
  }
  
  else if (request.indexOf("POST /api/start-weighing") != -1) {
    startWeighing();
    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: application/json");
    client.println("{\"success\":true}");
  }
  
  else if (request.indexOf("POST /api/reset") != -1) {
    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: application/json");
    client.println("{\"success\":true,\"message\":\"Rebooting...\"}");
    client.stop();
    delay(100);
    rebootDevice();
  }
  
  else {
    client.println("HTTP/1.1 404 Not Found");
    client.println();
  }
}

// ================= MAIN LOOP =================
void loop() {
  setLEDState(state);
  
  if (scale.is_ready()) {
    current_weight = readWeight();
  }
  
  // Kirim ke VPS jika WiFi connect
  if (WiFi.status() == WL_CONNECTED && state != CONFIG_MODE) {
    if (millis() - lastVPSSend > VPS_SEND_INTERVAL) {
      lastVPSSend = millis();
      sendStatusToVPS();
    }
  }
  
  // Handle web clients
  WiFiClient client = server.available();
  if (client) {
    String request = "";
    unsigned long timeout = millis() + 2000;
    
    while (client.connected() && millis() < timeout) {
      if (client.available()) {
        String line = client.readStringUntil('\n');
        request += line;
        if (line.length() == 1 && line[0] == '\r') break;
      }
    }
    
    if (state == CONFIG_MODE) {
      if (request.indexOf("GET / ") >= 0) {
        sendPairingPage(client);
      }
      else if (request.indexOf("POST /pair") >= 0) {
        String body = "";
        while (client.available()) body += (char)client.read();
        
        String ssid, pass, token;
        parseFormData(body, ssid, pass, token);
        
        if (token == pairToken) {
          saveWiFiCredentials(ssid, pass);
          sendSuccessPage(client);
          delay(100);
          rebootDevice();
        }
      }
    } else {
      if (request.indexOf("/api/") != -1) {
        handleAPIRequest(request, client);
      }
    }
    client.stop();
  }
  
  // State machine
  switch(state) {
    case WIFI_CONNECT:
      if (!wifiConnected) {
        if (connectToWiFi()) {
          wifiConnected = true;
          state = IDLE;
          server.begin();
          testGateway();
          testInternet();
          testExternalIP();
          testVPSConnection(); 
        } else {
          state = CONFIG_MODE;
        }
      }
      break;
      
    case CONFIG_MODE:
      if (!apStarted) {
        startAPMode();
      }
      break;
      
    case IDLE:
      if (!screenDrawn) {
        lcd.clear();
        lcd.print("NUTRIPLATE READY");
        screenDrawn = true;
      }
      lcd.setCursor(0, 1);
      lcd.print("W:" + String(abs(current_weight), 1) + "g    ");
      break;
      
    case WEIGHING:
      if (!screenDrawn) {
        lcd.clear();
        lcd.print("WEIGHING MODE");
        screenDrawn = true;
      }
      lcd.setCursor(0, 1);
      lcd.print("W:" + String(abs(current_weight), 1) + "g    ");
      break;
      
    case HOLDING:
      if (!screenDrawn) {
        lcd.clear();
        lcd.print("HOLD MODE");
        screenDrawn = true;
      }
      lcd.setCursor(0, 1);
      lcd.print("W:" + String(abs(stable_weight), 1) + "g    ");
      break;
      
    case SENDING:
      if (!screenDrawn) {
        lcd.clear();
        lcd.print("SENDING DATA");
        screenDrawn = true;
        delay(2000);
        resetToIdle();
      }
      break;
  }
  
  // Serial commands
  if (Serial.available()) {
    char cmd = Serial.read();
    switch(cmd) {
      case 't': scale.tare(); resetToIdle(); break;
      case 'm': resetToIdle(); break;
      case 'c': enterConfigMode(); break;
      case 's': 
        Serial.println("\n=== STATUS ===");
        Serial.println("State: " + String(state));
        Serial.println("Weight: " + String(abs(current_weight), 1) + "g");
        Serial.println("IP: " + WiFi.localIP().toString());
        break;
      case 'r': rebootDevice(); break;
    }
  }
  
  delay(50);
}