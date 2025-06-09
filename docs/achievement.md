# Dokumentasi Achievement API

## Endpoint

### GET /achievements

- **Deskripsi:** Mendapatkan daftar semua achievement aktif (maksimal 20 jenis).
- **Response sukses:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Community Favorite",
      "icon": "heart",
      "description": "Your post received 10 likes from 10 different users",
      "goal": 10,
      "created_at": "2025-06-10T12:00:00.000Z",
      "updated_at": "2025-06-10T12:00:00.000Z"
    },
    {
      "id": 2,
      "title": "Rising Star",
      "icon": "flame",
      "description": "Your post received 50 likes from 30 different users",
      "goal": 50,
      "created_at": "2025-06-10T12:00:00.000Z",
      "updated_at": "2025-06-10T12:00:00.000Z"
    }
    // ...dan seterusnya
  ]
}
```

Keterangan field:

- `id`: ID achievement
- `title`: Judul achievement
- `icon`: Nama icon (string)
- `description`: Deskripsi singkat
- `goal`: Target pencapaian (angka)
- `created_at`, `updated_at`: Timestamp

### GET /achievements/user/:userId

- **Deskripsi:** Mendapatkan progress & status seluruh achievement milik user tertentu.
- **Response sukses:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Community Favorite",
      "icon": "heart",
      "description": "Your post received 10 likes from 10 different users",
      "goal": 10,
      "progress": 3,
      "status": "in-progress" // atau "completed"
    },
    {
      "id": 2,
      "title": "Rising Star",
      "icon": "flame",
      "description": "Your post received 50 likes from 30 different users",
      "goal": 50,
      "progress": 0,
      "status": "in-progress"
    }
    // ...dan seterusnya
  ]
}
```

Keterangan field:

- `id`: ID achievement
- `title`: Judul achievement
- `icon`: Nama icon (string)
- `description`: Deskripsi singkat
- `goal`: Target pencapaian (angka)
- `progress`: Progress user saat ini (angka)
- `status`: Status progress (`in-progress` atau `completed`)

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

## Cara Kerja Progress

- Progress achievement **tidak diupdate lewat endpoint**.
- Progress di-update otomatis oleh backend saat event terjadi (misal: like, comment, bookmark, dsb) melalui service handler (`AchievementService.handleEvent`).
- Frontend hanya perlu GET untuk menampilkan daftar dan progress achievement user.

## Arsitektur & Flow

Sistem achievement PaletteStream menggunakan arsitektur MVC-SR (Model-View-Controller-Service-Repository):

- **Controller**: hanya menangani HTTP request/response, memanggil Service.
- **Service**: seluruh logika bisnis, termasuk perhitungan progress, validasi, dan update status achievement.
- **Repository**: akses database murni (query, insert, update, delete), tanpa logika bisnis.
- **Model**: ORM Objection.js, mendefinisikan struktur dan relasi data.

---

## Menambah Event Baru

Untuk menambah event baru, cukup tambahkan case baru di `AchievementService.handleEvent` dan implementasikan perhitungan progress sesuai kebutuhan.
