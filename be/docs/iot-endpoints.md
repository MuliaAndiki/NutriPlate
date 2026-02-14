# IoT Endpoints (NutriPlate)

## Public (Device)

### `POST /iot/status`
Terima status dari device dan mengirim command jika ada.

Request:
```json
{
  "token": "A8F21C",
  "weight": 1250.5,
  "stable_weight": 1250.5,
  "status": "ready"
}
```

Response (no command):
```json
{
  "success": true,
  "command": null
}
```

Response (with command):
```json
{
  "success": true,
  "command": "tare"
}
```

Response (device not registered):
```json
{
  "success": false,
  "error": "Device not registered",
  "needRegister": true
}
```

### `POST /iot/command-executed`
Konfirmasi command sudah dijalankan di device.

Request:
```json
{
  "token": "A8F21C",
  "command": "tare",
  "status": "success"
}
```

Response:
```json
{
  "success": true
}
```

## Protected (Dashboard, JWT)

### `POST /iot/command/send`
Request:
```json
{
  "token": "A8F21C",
  "command": "tare"
}
```

Response:
```json
{
  "success": true,
  "message": "Command tare queued for device A8F21C"
}
```

### `GET /iot/devices`
List semua device.

### `GET /iot/device/:token`
Detail satu device.

### `GET /iot/device/:token/foods`
History food intake device.

### `POST /iot/register`
Register device baru (pairing).

Request:
```json
{
  "token": "A8F21C",
  "name": "NutriPlate Scale 01",
  "parentId": "optional-parent-id",
  "posyanduId": "optional-posyandu-id",
  "pairingToken": "optional-token"
}
```

### `PUT /iot/device/:token`
Update info device (nama/lokasi/dll).

### `DELETE /iot/device/:token`
Hapus device.

## Command Supported
`tare`, `start-weighing`, `cancel-weighing`, `hold-weight`, `confirm-weight`, `reject-weight`, `reset`, `reboot`, `config-mode`
