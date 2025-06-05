# Dokumentasi Achievement API

## Endpoint

### GET /achievements

- **Deskripsi:** Mendapatkan daftar semua achievement (maksimal 20 jenis).
- **Response sukses:**

```json
{
  "success": true,
  "data": [
    { "id": 1, "title": "Level 10", "icon": "level10.png", "description": "Capai level 10", "goal": 10, ... }
  ]
}
```

### POST /achievements/progress

- **Deskripsi:** Update progress achievement berdasarkan event trigger (UPLOAD_POST, LEVEL_UP, dll).
- **Body:**

```json
{
  "userId": 1,
  "trigger": "UPLOAD_POST",
  "value": 1
}
```

- **Response sukses:**

```json
{ "success": true, "message": "Progress updated" }
```

### GET /achievements/unlocked

- **Deskripsi:** Mendapatkan daftar achievement yang sudah unlocked oleh user beserta progress.
- **Query:**
  - `userId` (wajib)
- **Response sukses:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "achievement_id": 1,
      "progress": "3/10",
      "status": "completed"
    }
  ]
}
```

---

## Struktur Tabel

### Table: achievements

- id (int, PK)
- title (string)
- icon (string)
- description (string)
- goal (int)
- created_at, updated_at

### Table: user_achievements

- id (int, PK)
- user_id (int, FK)
- achievement_id (int, FK)
- progress (int)
- status (enum: in-progress|completed)
- created_at, updated_at

---

## Trigger Logic

- Event trigger (UPLOAD_POST, LEVEL_UP, dsb) akan memanggil endpoint `/achievements/progress`.
- Service akan mapping trigger ke achievement_id, update progress di user_achievements.
- Jika progress mencapai goal, status menjadi `completed` dan achievement dianggap unlocked.
- Progress diformat sebagai string "progress/goal" (misal: "3/10").
- Maksimal 20 jenis achievement didukung.
