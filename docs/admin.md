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

## PUT /admin/users/:id/ban

- **Deskripsi:** Ban user
- **Headers:**
  - Authorization: Bearer <JWT admin>
- **Response sukses:**

```json
{ "success": true }
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
