# Dokumentasi Admin Backend

## GET /admin/users

- **Deskripsi:** Lihat semua user (search & pagination)
- **Query:**
  - `search` (opsional, string)
  - `page` (opsional, default 1)
  - `limit` (opsional, default 20)
- **Headers:**
  - Authorization: Bearer <JWT admin>
- **Response sukses:**

```json
{
  "success": true,
  "data": [
    { "id": 1, "email": "a@b.com", "status": "active", ... }
  ]
}
```

## POST /admin/users

- **Deskripsi:** Membuat user admin baru
- **Headers:**
  - Authorization: Bearer <JWT admin>
- **Body:**

```json
{
  "email": "admin@email.com",
  "password": "passwordku",
  "first_name": "Admin",
  "last_name": "Baru"
}
```

- **Response sukses:**

```json
{
  "success": true,
  "data": { "id": 2, "email": "admin@email.com", "role": "admin", ... }
}
```

## PUT /admin/users/:id/ban

- **Deskripsi:** Toggle ban/unban user. Jika user aktif, maka akan di-ban. Jika user sudah di-ban, maka akan di-unban.
- **Headers:**
  - Authorization: Bearer <JWT admin>
- **Response sukses:**

```json
{ "success": true, "status": "banned" }
```

atau jika user di-unban:

```json
{ "success": true, "status": "active" }
```

## PUT /admin/users/:id

- **Deskripsi:** Edit user (nama, email, dll)
- **Headers:**
  - Authorization: Bearer <JWT admin>
- **Body:**

```json
{ "first_name": "Baru", "email": "baru@email.com" }
```

- **Response sukses:**

```json
{ "success": true }
```

## DELETE /admin/users/:id

- **Deskripsi:** Hapus user
- **Headers:**
  - Authorization: Bearer <JWT admin>
- **Response sukses:**

```json
{ "success": true }
```

## GET /admin/posts

- **Deskripsi:** Lihat semua post (search & pagination)
- **Query:**
  - `search` (opsional, string)
  - `page` (opsional, default 1)
  - `limit` (opsional, default 20)
- **Headers:**
  - Authorization: Bearer <JWT admin>
- **Response sukses:**

```json
{
  "success": true,
  "data": [
    { "id": 1, "title": "Judul Post", ... }
  ]
}
```

## DELETE /admin/posts/:id

- **Deskripsi:** Hapus post
- **Headers:**
  - Authorization: Bearer <JWT admin>
- **Response sukses:**

```json
{ "success": true }
```

## GET /admin/dashboard

- **Deskripsi:** Statistik admin (jumlah user, post, banned)
- **Headers:**
  - Authorization: Bearer <JWT admin>
- **Response sukses:**

```json
{
  "success": true,
  "data": {
    "totalUsers": 100,
    "totalPosts": 200,
    "bannedUsers": 5
  }
}
```

## GET /admin/dashboard/trends

- **Deskripsi:** Statistik tren user & post (per hari dan per bulan)
- **Headers:**
  - Authorization: Bearer <JWT admin>
- **Response sukses:**

```json
{
  "success": true,
  "data": {
    "userTrendDay": [ { "date": "2025-06-01", "count": 2 }, ... ],
    "userTrendMonth": [ { "month": "2025-06", "count": 10 }, ... ],
    "postTrendDay": [ { "date": "2025-06-01", "count": 5 }, ... ],
    "postTrendMonth": [ { "month": "2025-06", "count": 30 }, ... ]
  }
}
```
