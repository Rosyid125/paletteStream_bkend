# API Documentation - User Posts

API ini menyediakan endpoint untuk mengelola postingan user dalam aplikasi sosial media berbagi gambar (anime, manga, dan ilustrasi).

## Base URL

```
/api/posts
```

## Authentication

Semua endpoint memerlukan autentikasi dengan `accessToken` yang dikirim melalui cookies.

---

## Endpoints

### 1. Get All Posts (Admin)

**GET** `/`

Mendapatkan semua post untuk admin dengan pagination.

**Headers:**

```
Cookie: accessToken=<your_jwt_token>
```

**Query Parameters:**

- `page` (optional, number): Halaman yang diminta (default: 1)
- `limit` (optional, number): Jumlah item per halaman (default: 10)

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "avatar": "path/to/avatar.jpg",
      "level": 5,
      "createdAt": "2024-01-15 10:30:00",
      "type": "illustration",
      "title": "Amazing Artwork",
      "description": "This is my latest creation",
      "images": ["storage/uploads/image1.jpg", "storage/uploads/image2.jpg"],
      "tags": ["anime", "digital art"],
      "likeCount": 25,
      "commentCount": 8
    }
  ]
}
```

### 2. Get Random Posts

**GET** `/randomized`

Mendapatkan post secara acak untuk halaman discovery.

**Headers:**

```
Cookie: accessToken=<your_jwt_token>
```

**Query Parameters:**

- `page` (optional, number): Halaman yang diminta (default: 1)
- `limit` (optional, number): Jumlah item per halaman (default: 10)

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "avatar": "path/to/avatar.jpg",
      "level": 5,
      "createdAt": "2024-01-15 10:30:00",
      "type": "illustration",
      "title": "Amazing Artwork",
      "description": "This is my latest creation",
      "images": ["storage/uploads/image1.jpg"],
      "tags": ["anime", "digital art"],
      "postLikeStatus": false,
      "bookmarkStatus": true,
      "likeCount": 25,
      "commentCount": 8
    }
  ]
}
```

### 3. Get Home Feed Posts

**GET** `/home/:userId`

Mendapatkan post untuk home feed berdasarkan user yang diikuti.

**Parameters:**

- `userId` (required, number): ID user

**Headers:**

```
Cookie: accessToken=<your_jwt_token>
```

**Query Parameters:**

- `page` (optional, number): Halaman yang diminta (default: 1)
- `limit` (optional, number): Jumlah item per halaman (default: 10)

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "avatar": "path/to/avatar.jpg",
      "level": 5,
      "createdAt": "2024-01-15 10:30:00",
      "type": "illustration",
      "title": "Amazing Artwork",
      "description": "This is my latest creation",
      "images": ["storage/uploads/image1.jpg"],
      "tags": ["anime", "digital art"],
      "postLikeStatus": false,
      "bookmarkStatus": true,
      "likeCount": 25,
      "commentCount": 8
    }
  ]
}
```

### 4. Get User Liked Posts

**GET** `/liked/:userId`

Mendapatkan semua post yang dilike oleh user.

**Parameters:**

- `userId` (required, number): ID user

**Headers:**

```
Cookie: accessToken=<your_jwt_token>
```

**Query Parameters:**

- `page` (optional, number): Halaman yang diminta (default: 1)
- `limit` (optional, number): Jumlah item per halaman (default: 10)

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "avatar": "path/to/avatar.jpg",
      "level": 5,
      "createdAt": "2024-01-15 10:30:00",
      "type": "illustration",
      "title": "Amazing Artwork",
      "description": "This is my latest creation",
      "images": ["storage/uploads/image1.jpg"],
      "tags": ["anime", "digital art"],
      "postLikeStatus": true,
      "bookmarkStatus": false,
      "likeCount": 25,
      "commentCount": 8
    }
  ]
}
```

### 5. Get User Bookmarked Posts

**GET** `/bookmarked/:userId`

Mendapatkan semua post yang di-bookmark oleh user.

**Parameters:**

- `userId` (required, number): ID user

**Headers:**

```
Cookie: accessToken=<your_jwt_token>
```

**Query Parameters:**

- `page` (optional, number): Halaman yang diminta (default: 1)
- `limit` (optional, number): Jumlah item per halaman (default: 10)

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "avatar": "path/to/avatar.jpg",
      "level": 5,
      "createdAt": "2024-01-15 10:30:00",
      "type": "illustration",
      "title": "Amazing Artwork",
      "description": "This is my latest creation",
      "images": ["storage/uploads/image1.jpg"],
      "tags": ["anime", "digital art"],
      "postLikeStatus": false,
      "bookmarkStatus": true,
      "likeCount": 25,
      "commentCount": 8
    }
  ]
}
```

### 6. Get Post Leaderboards

**GET** `/leaderboard`

Mendapatkan post yang diurutkan berdasarkan engagement (likes + comments).

**Headers:**

```
Cookie: accessToken=<your_jwt_token>
```

**Query Parameters:**

- `page` (optional, number): Halaman yang diminta (default: 1)
- `limit` (optional, number): Jumlah item per halaman (default: 10)

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "avatar": "path/to/avatar.jpg",
      "level": 5,
      "createdAt": "2024-01-15 10:30:00",
      "type": "illustration",
      "title": "Amazing Artwork",
      "description": "This is my latest creation",
      "images": ["storage/uploads/image1.jpg"],
      "tags": ["anime", "digital art"],
      "postLikeStatus": false,
      "bookmarkStatus": true,
      "likeCount": 125,
      "commentCount": 45
    }
  ]
}
```

### 7. Search Posts by Type

**GET** `/type`

Mencari post berdasarkan type (illustration, manga, novel).

**Headers:**

```
Cookie: accessToken=<your_jwt_token>
```

**Query Parameters:**

- `query` (required, string): Type yang dicari ("illustration", "manga", atau "novel")
- `page` (optional, number): Halaman yang diminta (default: 1)
- `limit` (optional, number): Jumlah item per halaman (default: 10)

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "avatar": "path/to/avatar.jpg",
      "level": 5,
      "createdAt": "2024-01-15 10:30:00",
      "type": "illustration",
      "title": "Amazing Artwork",
      "description": "This is my latest creation",
      "images": ["storage/uploads/image1.jpg"],
      "tags": ["anime", "digital art"],
      "postLikeStatus": false,
      "bookmarkStatus": true,
      "likeCount": 25,
      "commentCount": 8
    }
  ]
}
```

### 8. Search Posts by Tags

**GET** `/tags`

Mencari post berdasarkan tags.

**Headers:**

```
Cookie: accessToken=<your_jwt_token>
```

**Query Parameters:**

- `query` (required, array): Array tag yang dicari (bisa multiple)
- `page` (optional, number): Halaman yang diminta (default: 1)
- `limit` (optional, number): Jumlah item per halaman (default: 10)

**Example Request:**

```
GET /api/posts/tags?query[]=anime&query[]=digital%20art&page=1&limit=10
```

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "avatar": "path/to/avatar.jpg",
      "level": 5,
      "createdAt": "2024-01-15 10:30:00",
      "type": "illustration",
      "title": "Amazing Artwork",
      "description": "This is my latest creation",
      "images": ["storage/uploads/image1.jpg"],
      "tags": ["anime", "digital art"],
      "postLikeStatus": false,
      "bookmarkStatus": true,
      "likeCount": 25,
      "commentCount": 8
    }
  ]
}
```

### 9. Search Posts by Title and Description

**GET** `/title-desc`

Mencari post berdasarkan title dan description.

**Headers:**

```
Cookie: accessToken=<your_jwt_token>
```

**Query Parameters:**

- `query` (required, string): Kata kunci pencarian
- `page` (optional, number): Halaman yang diminta (default: 1)
- `limit` (optional, number): Jumlah item per halaman (default: 10)

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "avatar": "path/to/avatar.jpg",
      "level": 5,
      "createdAt": "2024-01-15 10:30:00",
      "type": "illustration",
      "title": "Amazing Artwork",
      "description": "This is my latest creation",
      "images": ["storage/uploads/image1.jpg"],
      "tags": ["anime", "digital art"],
      "postLikeStatus": false,
      "bookmarkStatus": true,
      "likeCount": 25,
      "commentCount": 8
    }
  ]
}
```

### 10. Get Single Post by ID

**GET** `/single/:postId`

Mendapatkan detail single post berdasarkan ID.

**Parameters:**

- `postId` (required, number): ID post

**Headers:**

```
Cookie: accessToken=<your_jwt_token>
```

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "avatar": "path/to/avatar.jpg",
    "level": 5,
    "createdAt": "2024-01-15 10:30:00",
    "updatedAt": "2024-01-15 10:30:00",
    "type": "illustration",
    "title": "Amazing Artwork",
    "description": "This is my latest creation",
    "images": ["storage/uploads/image1.jpg"],
    "tags": ["anime", "digital art"],
    "postLikeStatus": false,
    "bookmarkStatus": true,
    "likeCount": 25,
    "commentCount": 8
  }
}
```

### 11. Get User Posts

**GET** `/:userId`

Mendapatkan semua post dari user tertentu.

**Parameters:**

- `userId` (required, number): ID user

**Headers:**

```
Cookie: accessToken=<your_jwt_token>
```

**Query Parameters:**

- `page` (optional, number): Halaman yang diminta (default: 1)
- `limit` (optional, number): Jumlah item per halaman (default: 10)

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "avatar": "path/to/avatar.jpg",
      "level": 5,
      "createdAt": "2024-01-15 10:30:00",
      "type": "illustration",
      "title": "Amazing Artwork",
      "description": "This is my latest creation",
      "images": ["storage/uploads/image1.jpg"],
      "tags": ["anime", "digital art"],
      "postLikeStatus": false,
      "bookmarkStatus": true,
      "likeCount": 25,
      "commentCount": 8
    }
  ]
}
```

### 12. Create New Post

**POST** `/create/:userId`

Membuat post baru dengan upload gambar.

**Parameters:**

- `userId` (required, number): ID user yang membuat post

**Headers:**

```
Cookie: accessToken=<your_jwt_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**

- `title` (required, string): Judul post
- `description` (required, string): Deskripsi post
- `type` (required, string): Type post ("illustration", "manga", atau "novel")
- `tags` (optional, array): Array tags untuk post
- `images` (optional, files): File gambar (maksimal 10 file)

**Example Request:**

```javascript
const formData = new FormData();
formData.append("title", "Amazing Artwork");
formData.append("description", "This is my latest creation");
formData.append("type", "illustration");
formData.append("tags", JSON.stringify(["anime", "digital art"]));
formData.append("images", file1);
formData.append("images", file2);
```

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "post": {
      "id": 1,
      "user_id": 1,
      "title": "Amazing Artwork",
      "description": "This is my latest creation",
      "type": "illustration",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    },
    "postTags": [
      {
        "id": 1,
        "post_id": 1,
        "tag_id": 1
      }
    ],
    "postImages": [
      {
        "id": 1,
        "post_id": 1,
        "image_url": "storage/uploads/image1.jpg"
      }
    ]
  }
}
```

### 13. Update Post

**PUT** `/edit/:postId`

Mengupdate post yang sudah ada. Hanya pemilik post yang bisa mengedit.

**Parameters:**

- `postId` (required, number): ID post yang akan diupdate

**Headers:**

```
Cookie: accessToken=<your_jwt_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**

- `title` (required, string): Judul post
- `description` (required, string): Deskripsi post
- `type` (required, string): Type post ("illustration", "manga", atau "novel")
- `tags` (optional, array): Array tags untuk post
- `images` (optional, files): File gambar baru (maksimal 10 file)

**Example Request:**

```javascript
const formData = new FormData();
formData.append("title", "Updated Amazing Artwork");
formData.append("description", "This is my updated creation");
formData.append("type", "illustration");
formData.append("tags", JSON.stringify(["anime", "digital art", "update"]));
formData.append("images", newFile1);
formData.append("images", newFile2);
```

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "post": {
      "id": 1,
      "user_id": 1,
      "title": "Updated Amazing Artwork",
      "description": "This is my updated creation",
      "type": "illustration",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T12:45:00.000Z"
    },
    "deletedTags": [
      {
        "id": 1,
        "post_id": 1,
        "tag_id": 1
      }
    ],
    "newPostTags": [
      {
        "id": 2,
        "post_id": 1,
        "tag_id": 2
      }
    ],
    "deletedImages": [
      {
        "id": 1,
        "post_id": 1,
        "image_url": "storage/uploads/old_image.jpg"
      }
    ],
    "newPostImages": [
      {
        "id": 2,
        "post_id": 1,
        "image_url": "storage/uploads/new_image.jpg"
      }
    ]
  },
  "message": "Post updated successfully"
}
```

### 14. Delete Post

**DELETE** `/delete/:postId`

Menghapus post. Hanya pemilik post yang bisa menghapus.

**Parameters:**

- `postId` (required, number): ID post yang akan dihapus

**Headers:**

```
Cookie: accessToken=<your_jwt_token>
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Title and description are required"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "You are not authorized to edit this post"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Post not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "An unexpected error occurred."
}
```

---

## Notes

### File Upload

- Maksimal 10 file per post
- Format file yang didukung: JPG, JPEG, PNG, GIF
- Maksimal ukuran file: 10MB per file
- File akan disimpan di directory `storage/uploads/`

### Tags

- Tags dapat berupa array string
- Jika tag belum ada, akan dibuat otomatis
- Tags case-insensitive

### Pagination

- Default page: 1
- Default limit: 10
- Maksimal limit: 100

### Authentication

- Semua endpoint memerlukan `accessToken` di cookies
- Token akan diverifikasi untuk mendapatkan user info
- Beberapa operasi (edit, delete) memerlukan validasi kepemilikan

### Gamification

- Membuat post akan memicu event gamifikasi untuk pemberian EXP
- Menghapus post akan memicu event pengurangan EXP
- Update post tidak mempengaruhi EXP

### Database Relations

- Post memiliki relasi dengan User (many-to-one)
- Post memiliki relasi dengan Images (one-to-many)
- Post memiliki relasi dengan Tags (many-to-many)
- Post memiliki relasi dengan Likes (one-to-many)
- Post memiliki relasi dengan Comments (one-to-many)
- Post memiliki relasi dengan Bookmarks (one-to-many)
