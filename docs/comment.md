# Dokumentasi API Komentar

## GET /posts/:postId

- **Deskripsi:** Mendapatkan semua komentar pada sebuah post beserta detail post dengan informasi engagement (likes, comments, like status, bookmark status).
- **Header:** Authorization: Bearer {token}
- **Query:**
  - `page` (opsional, default 1)
  - `limit` (opsional, default 10)
- **Response sukses:**

```json
{
  "success": true,
  "data": {
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
      "tags": ["anime", "manga"],
      "likeCount": 25,
      "commentCount": 12,
      "postLikeStatus": true,
      "bookmarkStatus": false
    },
    "comments": [
      {
        "id": 10,
        "user_id": 3,
        "username": "saber",
        "avatar": "https://...",
        "level": 4,
        "content": "Keren banget!",
        "likeCount": 5,
        "commentCount": 2,
        "created_at": "2025-06-09 10:10:00",
        "replies_count": 2
      }
    ]
  }
}
```

**Penjelasan Field Engagement:**

- `likeCount`: Total jumlah likes pada post
- `commentCount`: Total jumlah komentar + balasan komentar pada post
- `postLikeStatus`: Status apakah user saat ini sudah like post atau belum (true/false)
- `bookmarkStatus`: Status apakah user saat ini sudah bookmark post atau belum (true/false)

**Penjelasan Field Engagement untuk Comments:**

- `likeCount`: Jumlah likes pada komentar tersebut (dari kolom `likes` di tabel `post_comments`)
- `commentCount`: Jumlah balasan pada komentar tersebut (sama dengan `replies_count`)
- `replies_count`: Total jumlah balasan untuk komentar tersebut

## GET /comments/:id

- **Deskripsi:** Mendapatkan detail komentar berdasarkan ID.
- **Header:** Authorization: Bearer {token}
- **Response sukses:**

```json
{
  "success": true,
  "data": {
    "id": 10,
    "user_id": 3,
    "username": "saber",
    "avatar": "https://...",
    "level": 4,
    "content": "Keren banget!",
    "created_at": "2025-06-09 10:10:00",
    "replies_count": 2
  }
}
```

## POST /posts/:postId/comments

- **Deskripsi:** Membuat komentar baru pada sebuah post.
- **Header:** Authorization: Bearer {token}
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
  "data": {
    "id": 15,
    "post_id": 1,
    "user_id": 2,
    "content": "Komentar kamu di sini",
    "created_at": "2025-06-11 15:30:00",
    "updated_at": "2025-06-11 15:30:00"
  }
}
```

## DELETE /comments/:id

- **Deskripsi:** Menghapus komentar berdasarkan ID.
- **Header:** Authorization: Bearer {token}
- **Response sukses:**

```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

## GET /comments/:commentId/replies

- **Deskripsi:** Mendapatkan semua balasan untuk sebuah komentar.
- **Header:** Authorization: Bearer {token}
- **Query:**
  - `page` (opsional, default 1)
  - `limit` (opsional, default 10)
- **Response sukses:**

```json
{
  "success": true,
  "data": [
    {
      "id": 100,
      "user_id": 4,
      "username": "archer",
      "avatar": "https://...",
      "level": 3,
      "content": "Setuju!",
      "created_at": "2025-06-09 10:15:00"
    }
  ]
}
```

## POST /comments/:commentId/replies

- **Deskripsi:** Membuat balasan pada sebuah komentar.
- **Header:** Authorization: Bearer {token}
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
  "data": {
    "id": 105,
    "comment_id": 10,
    "user_id": 4,
    "content": "Balasan kamu di sini",
    "created_at": "2025-06-11 15:35:00",
    "updated_at": "2025-06-11 15:35:00"
  }
}
```

## DELETE /replies/:id

- **Deskripsi:** Menghapus balasan komentar berdasarkan ID.
- **Header:** Authorization: Bearer {token}
- **Response sukses:**

```json
{
  "success": true,
  "message": "Reply deleted successfully"
}
```

## Error Responses

**400 Bad Request:**

```json
{
  "success": false,
  "message": "Invalid request data"
}
```

**401 Unauthorized:**

```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

**404 Not Found:**

```json
{
  "success": false,
  "message": "Post not found" // atau "Comment not found"
}
```

**500 Internal Server Error:**

```json
{
  "success": false,
  "message": "An unexpected error occurred."
}
```
