# Dokumentasi API Komentar

## GET /posts/:postId

- **Deskripsi:** Mendapatkan semua komentar pada sebuah post beserta detail post.
- **Query:**
  - `page` (opsional, default 1)
  - `limit` (opsional, default 10)
- **Response sukses:**

```json
{
  "post": {
    "id": 1,
    "userId": 2,
    "firstName": "Rin",
    "lastName": "Tohsaka",
    "username": "rinchan",
    "avatar": "https://...",
    "level": 5,
    "createdAt": "2025-06-09 10:00:00",
    "type": "illustration",
    "title": "Judul Post",
    "description": "Deskripsi...",
    "images": ["https://..."],
    "tags": ["anime", "manga"]
  },
  "comments": [
    {
      "id": 10,
      "user_id": 3,
      "username": "saber",
      "avatar": "https://...",
      "level": 4,
      "content": "Keren banget!",
      "created_at": "2025-06-09 10:10:00",
      "replies_count": 2
    },
    ...
  ]
}
```

## GET /comments/:id

- **Deskripsi:** Mendapatkan detail komentar berdasarkan ID.
- **Response sukses:**

```json
{
  "id": 10,
  "user_id": 3,
  "username": "saber",
  "avatar": "https://...",
  "level": 4,
  "content": "Keren banget!",
  "created_at": "2025-06-09 10:10:00",
  "replies_count": 2
}
```

## POST /posts/:postId/comments

- **Deskripsi:** Membuat komentar baru pada sebuah post.
- **Body:**

```json
{
  "content": "Komentar kamu di sini"
}
```

- **Response sukses:**

```json
{
  "success": true,
  "data": { ...komentar_baru... }
}
```

## DELETE /comments/:id

- **Deskripsi:** Menghapus komentar berdasarkan ID.
- **Response sukses:**

```json
{
  "success": true
}
```

## GET /comments/:commentId/replies

- **Deskripsi:** Mendapatkan semua balasan untuk sebuah komentar.
- **Query:**
  - `page` (opsional, default 1)
  - `limit` (opsional, default 10)
- **Response sukses:**

```json
[
  {
    "id": 100,
    "user_id": 4,
    "username": "archer",
    "avatar": "https://...",
    "level": 3,
    "content": "Setuju!",
    "created_at": "2025-06-09 10:15:00"
  },
  ...
]
```

## POST /comments/:commentId/replies

- **Deskripsi:** Membuat balasan pada sebuah komentar.
- **Body:**

```json
{
  "content": "Balasan kamu di sini"
}
```

- **Response sukses:**

```json
{
  "success": true,
  "data": { ...balasan_baru... }
}
```

## DELETE /replies/:id

- **Deskripsi:** Menghapus balasan komentar berdasarkan ID.
- **Response sukses:**

```json
{
  "success": true
}
```
