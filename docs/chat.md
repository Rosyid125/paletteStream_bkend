# Dokumentasi Chat Real-time

## Catatan Penting

- **Pengiriman pesan chat HANYA melalui WebSocket event `send_message`.**
- Endpoint REST (`/api/chats/...`) hanya untuk pengambilan data chat/history, BUKAN untuk mengirim pesan baru.
- Semua event real-time chat (kirim, terima, konfirmasi, mark as read) WAJIB lewat WebSocket.

---

## Struktur Event WebSocket

### Event: `send_message`

- **Deskripsi:** Kirim pesan ke user lain (real-time, WAJIB via websocket)
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

### Event: `messege_read`

- **Deskripsi:** Tandai pesan sudah dibaca sisi receiver
- **Payload:**

```json
{
  "message_id": 10,
  "user_id": 29
}
```

## Otentikasi WebSocket

- Kirim JWT token pada handshake:

```js
const socket = io("/", { auth: { token: "<JWT_TOKEN>" } });
```

- Jika token tidak valid, koneksi akan ditolak.

---

## Endpoint REST

### GET /api/chats/

- **Deskripsi:** Ambil daftar recent chats (seperti sidebar Messenger)
- **Headers:**
  - Authorization: Bearer <JWT>
- **Response sukses:**

```json
{
  "success": true,
  "data": [
    {
      "user_id": 2,
      "username": "user2",
      "avatar": "url_avatar",
      "last_message": "Halo!",
      "last_message_time": "2025-06-05T12:00:00Z",
      "unread_count": 3
    }
  ]
}
```

### GET /api/chats/history/:user_id

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

### GET /api/chats/unread

- **Deskripsi:** Ambil semua pesan yang belum dibaca oleh user login
- **Headers:**
  - Authorization: Bearer <JWT>
- **Response sukses:**

```json
{
  "success": true,
  "data": [{ "id": 10, "sender_id": 2, "receiver_id": 1, "content": "Halo!", "created_at": "..." }]
}
```

### PATCH /api/chats/:messageId/read

- **Deskripsi:** Tandai pesan sudah dibaca
- **Headers:**
  - Authorization: Bearer <JWT>
- **Response sukses:**

```json
{
  "success": true
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
