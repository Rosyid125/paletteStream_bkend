# Dokumentasi Chat Real-time

## Struktur Event WebSocket

### Event: `send_message`

- **Deskripsi:** Kirim pesan ke user lain
- **Payload:**

```json
{
  "receiver_id": 2,
  "content": "Halo!"
}
```

### Event: `receive_message`

- **Deskripsi:** Terima pesan dari user lain
- **Payload:**

```json
{
  "id": 10,
  "sender_id": 1,
  "receiver_id": 2,
  "content": "Halo!",
  "created_at": "2025-06-05T12:00:00Z"
}
```

### Event: `message_sent`

- **Deskripsi:** Konfirmasi pesan berhasil dikirim (ke pengirim)
- **Payload:**

```json
{
  "id": 10,
  "receiver_id": 2,
  "content": "Halo!",
  "created_at": "2025-06-05T12:00:00Z"
}
```

### Event: `mark_as_read`

- **Deskripsi:** Tandai pesan sudah dibaca
- **Payload:**

```json
{
  "message_id": 10
}
```

---

## Otentikasi WebSocket

- Kirim JWT token pada handshake:

```js
const socket = io("/", { auth: { token: "<JWT_TOKEN>" } });
```

- Jika token tidak valid, koneksi akan ditolak.

---

## Endpoint REST

### GET /chat/history/:user_id

- **Deskripsi:** Ambil riwayat chat dengan user tertentu
- **Headers:**
  - Authorization: Bearer <JWT>
- **Response sukses:**

```json
{
  "success": true,
  "data": [{ "id": 1, "sender_id": 1, "receiver_id": 2, "content": "Halo", "is_read": true, "created_at": "..." }]
}
```

---

## Struktur Tabel `messages`

- id (int, PK)
- sender_id (int, FK users)
- receiver_id (int, FK users)
- content (string)
- is_read (boolean)
- created_at, updated_at
