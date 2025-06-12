# Dokumentasi Admin Backend - Enhanced

## User Management Endpoints

### GET /admin/users

- **Deskripsi:** Mendapatkan daftar semua user dengan fitur pencarian dan pagination
- **Method:** GET
- **Auth:** Admin only (Bearer token required)
- **Query Parameters:**
  - `search` (opsional, string) - Cari berdasarkan username, nama, atau email
  - `page` (opsional, default 1) - Halaman pagination
  - `limit` (opsional, default 20) - Jumlah data per halaman

**Headers:**

```
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

**Response sukses (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "default",
      "is_active": true,
      "status": "active",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z",
      "profile": {
        "username": "johndoe",
        "bio": "Hello world",
        "avatar": "storage/avatars/default.png"
      }
    }
  ]
}
```

### GET /admin/users/:id

- **Deskripsi:** Mendapatkan detail user berdasarkan ID
- **Method:** GET
- **Auth:** Admin only

**Headers:**

```
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

**Response sukses (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "default",
    "is_active": true,
    "status": "active",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z",
    "profile": {
      "username": "johndoe",
      "bio": "Hello world",
      "avatar": "storage/avatars/default.png",
      "location": "Indonesia"
    }
  }
}
```

### PUT /admin/users/:id

- **Deskripsi:** Edit user dengan informasi lengkap (semua field di tabel users)
- **Method:** PUT
- **Auth:** Admin only
- **Validation:** Menggunakan `validateEditUser` middleware

**Headers:**

```
Authorization: Bearer <JWT_ACCESS_TOKEN>
Content-Type: application/json
```

**Body (semua field opsional):**

```json
{
  "email": "newemail@example.com",
  "password": "NewPassword123",
  "first_name": "John Updated",
  "last_name": "Doe Updated",
  "role": "admin",
  "is_active": true,
  "status": "active"
}
```

**Field Validations:**

- `email`: Valid email format, unique
- `password`: Min 6 karakter, harus ada huruf besar, kecil, dan angka
- `first_name`: String, max 255 karakter
- `last_name`: String, max 255 karakter
- `role`: "default" atau "admin"
- `is_active`: Boolean
- `status`: "active", "banned", atau "inactive"

**Response sukses (200):**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "email": "newemail@example.com",
    "first_name": "John Updated",
    "last_name": "Doe Updated",
    "role": "admin",
    "is_active": true,
    "status": "active",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-06-13T10:30:00.000Z"
  }
}
```

**Response error (409) - Email sudah ada:**

```json
{
  "success": false,
  "message": "Email already exists"
}
```

**Response error (400) - Validasi gagal:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Valid email is required",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### PUT /admin/users/:id/ban

- **Deskripsi:** Toggle ban/unban user (banned ↔ active)
- **Method:** PUT
- **Auth:** Admin only

**Headers:**

```
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

**Response sukses (200):**

```json
{
  "success": true,
  "status": "banned" // atau "active"
}
```

### DELETE /admin/users/:id

- **Deskripsi:** Hapus user (hard delete)
- **Method:** DELETE
- **Auth:** Admin only

**Headers:**

```
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

**Response sukses (200):**

```json
{
  "success": true
}
```

## Admin Management Endpoints

### POST /admin/admins

- **Deskripsi:** Membuat admin baru dengan informasi lengkap
- **Method:** POST
- **Auth:** Admin only
- **Validation:** Menggunakan `validateCreateAdmin` middleware

**Headers:**

```
Authorization: Bearer <JWT_ACCESS_TOKEN>
Content-Type: application/json
```

**Body (semua field wajib):**

```json
{
  "email": "newadmin@example.com",
  "password": "AdminPassword123",
  "first_name": "New",
  "last_name": "Admin",
  "role": "admin"
}
```

**Field Validations:**

- `email`: Valid email format, unique, wajib
- `password`: Min 6 karakter, harus ada huruf besar, kecil, dan angka, wajib
- `first_name`: String non-empty, max 255 karakter, wajib
- `last_name`: String non-empty, max 255 karakter, wajib
- `role`: Opsional, default "admin"

**Response sukses (201):**

```json
{
  "success": true,
  "message": "Admin created successfully",
  "data": {
    "id": 10,
    "email": "newadmin@example.com",
    "first_name": "New",
    "last_name": "Admin",
    "role": "admin",
    "is_active": true,
    "status": "active",
    "created_at": "2025-06-13T10:30:00.000Z",
    "updated_at": "2025-06-13T10:30:00.000Z"
  }
}
```

**Response error (409) - Email sudah terdaftar:**

```json
{
  "success": false,
  "message": "Email already registered"
}
```

**Response error (400) - Validasi gagal:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "weak-password",
      "msg": "Password must contain at least one lowercase letter, one uppercase letter, and one number",
      "path": "password",
      "location": "body"
    }
  ]
}
```

## Post Management Endpoints

### GET /admin/posts

- **Deskripsi:** Mendapatkan daftar semua post dengan report count
- **Method:** GET
- **Auth:** Admin only

**Query Parameters:**

- `search` (opsional) - Cari berdasarkan title atau description
- `page` (opsional, default 1)
- `limit` (opsional, default 20)

**Headers:**

```
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

**Response sukses (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "My Artwork",
      "description": "Beautiful artwork",
      "type": "image",
      "user_id": 1,
      "report_count": 2,
      "created_at": "2025-01-01T00:00:00.000Z",
      "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "profile": {
          "username": "johndoe"
        }
      }
    }
  ]
}
```

### DELETE /admin/posts/:id

- **Deskripsi:** Hapus post (hard delete)
- **Method:** DELETE
- **Auth:** Admin only

**Response sukses (200):**

```json
{
  "success": true
}
```

## Dashboard Endpoints

### GET /admin/dashboard

- **Deskripsi:** Mendapatkan statistik dashboard admin
- **Method:** GET
- **Auth:** Admin only

**Response:**

```json
{
  "success": true,
  "data": {
    "totalUsers": 1500,
    "totalPosts": 2340,
    "bannedUsers": 23,
    "totalReports": 145,
    "pendingReports": 12
  }
}
```

### GET /admin/dashboard/trends

- **Deskripsi:** Mendapatkan data trend untuk grafik dashboard
- **Method:** GET
- **Auth:** Admin only

**Response:**

```json
{
  "success": true,
  "data": {
    "userTrendDay": [
      { "date": "2025-06-07", "count": 5 },
      { "date": "2025-06-08", "count": 8 }
    ],
    "userTrendMonth": [
      { "month": "2025-01", "count": 150 },
      { "month": "2025-02", "count": 180 }
    ],
    "postTrendDay": [
      { "date": "2025-06-07", "count": 15 },
      { "date": "2025-06-08", "count": 22 }
    ],
    "postTrendMonth": [
      { "month": "2025-01", "count": 450 },
      { "month": "2025-02", "count": 520 }
    ]
  }
}
```

## Post Report Management Endpoints

### GET /admin/posts/reported

- **Deskripsi:** Mendapatkan daftar post yang dilaporkan
- **Method:** GET
- **Auth:** Admin only

**Query Parameters:**

- `page` (opsional, default 1)
- `limit` (opsional, default 20)

### GET /admin/posts/:postId/reports

- **Deskripsi:** Mendapatkan semua laporan untuk post tertentu
- **Method:** GET
- **Auth:** Admin only

### GET /admin/reports

- **Deskripsi:** Mendapatkan semua laporan
- **Method:** GET
- **Auth:** Admin only

### GET /admin/reports/statistics

- **Deskripsi:** Mendapatkan statistik laporan
- **Method:** GET
- **Auth:** Admin only

### PUT /admin/reports/:reportId/status

- **Deskripsi:** Update status laporan
- **Method:** PUT
- **Auth:** Admin only
- **Validation:** Status harus valid (pending, reviewed, resolved, dismissed)

**Body:**

```json
{
  "status": "resolved"
}
```

### DELETE /admin/reports/:reportId

- **Deskripsi:** Hapus laporan
- **Method:** DELETE
- **Auth:** Admin only

## Error Responses

**401 Unauthorized:**

```json
{
  "message": "Unauthorized"
}
```

**403 Forbidden:**

```json
{
  "message": "Forbidden"
}
```

**404 Not Found:**

```json
{
  "success": false,
  "message": "User not found"
}
```

**500 Internal Server Error:**

```json
{
  "success": false,
  "message": "Internal server error message"
}
```

## Fitur Keamanan

1. **Role-based Access Control:** Semua endpoint memerlukan role admin
2. **JWT Authentication:** Menggunakan access token di cookie atau header
3. **Input Validation:** Validasi ketat untuk semua input menggunakan express-validator
4. **Password Hashing:** Password di-hash menggunakan bcrypt dengan salt 10
5. **Email Uniqueness:** Email harus unik di seluruh sistem
6. **Sanitization:** Input di-sanitize untuk mencegah injection attacks

## Catatan Penting

1. **Default Profile & Experience:** Saat membuat admin baru, otomatis dibuatkan default profile dan experience
2. **Password Policy:** Password harus mengandung minimal 1 huruf kecil, 1 huruf besar, dan 1 angka
3. **Soft vs Hard Delete:** Beberapa endpoint menggunakan hard delete, hati-hati saat menggunakan
4. **Admin Privileges:** Admin dapat mengubah role user lain menjadi admin atau default
5. **Status Management:** Admin dapat mengatur status user (active, banned, inactive) dan is_active flag

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
