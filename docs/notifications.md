# Dokumentasi Notifikasi Dinamis

## Endpoint REST

### GET /notifications

- **Deskripsi:** Ambil daftar notifikasi user (terurut terbaru)
- **Headers:**
  - Authorization: Bearer <JWT>
- **Response sukses:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 2,
      "type": "like",
      "data": { "post_id": 10, "from_user_id": 1 },
      "is_read": false,
      "created_at": "..."
    }
  ]
}
```

### POST /notifications/read

- **Deskripsi:** Tandai notifikasi sudah dibaca (satu atau semua)
- **Body:**
  - `{ "notification_id": 123 }` untuk satu notifikasi
  - `{}` untuk semua notifikasi user
- **Response sukses:**

```json
{ "success": true }
```

---

## WebSocket Event

### Event: `receive_notification`

- **Deskripsi:** Kirim notifikasi real-time ke user
- **Payload:**

```json
{
  "id": 1,
  "user_id": 2,
  "type": "like",
  "data": { "post_id": 10, "from_user_id": 1 },
  "is_read": false,
  "created_at": "..."
}
```

---

## Contoh Struktur data JSON (kolom `data`)

- **like:** `{ "post_id": 10, "from_user_id": 1 }`
- **comment:** `{ "post_id": 10, "comment_id": 5, "from_user_id": 1 }`
- **reply:** `{ "comment_id": 5, "reply_id": 7, "from_user_id": 1 }`
- **follow:** `{ "from_user_id": 1 }`
- **achievement:** `{ "achievement_id": 3, "name": "Level 10" }`
- **level_up:** `{ "level": 10 }`
- **challenge:** `{ "challenge_id": 2, "name": "Weekly Art" }`
- **mention:** `{ "post_id": 10, "from_user_id": 1 }`
- **post_featured:** `{ "post_id": 10 }`
- **post_reported:** `{ "post_id": 10 }`
- **challenge_winner:** `{ "challenge_id": 2 }`
- **badge:** `{ "badge_id": 4, "name": "Veteran" }`
- **exp_gain:** `{ "amount": 100 }`
- **exp_loss:** `{ "amount": 50 }`
- **post_bookmarked:** `{ "post_id": 10 }`
- **post_unbookmarked:** `{ "post_id": 10 }`
- **post_deleted:** `{ "post_id": 10 }`
- **comment_deleted:** `{ "comment_id": 5 }`
- **system:** `{ "message": "Welcome!" }`

---

## Struktur Tabel `notifications`

- id (int, PK)
- user_id (int, FK users)
- type (string)
- data (JSON)
- is_read (boolean)
- created_at, updated_at
