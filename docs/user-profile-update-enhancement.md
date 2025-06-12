# User Profile Update Enhancement

## Overview

Dokumentasi ini menjelaskan perubahan yang dilakukan untuk memperbaiki fitur edit user profile agar lebih lengkap dan sesuai dengan struktur database.

## Masalah Sebelumnya

1. **Field yang tidak bisa diupdate**: `first_name` dan `last_name` dari tabel `users` tidak bisa diupdate
2. **Mapping field yang salah**: Field `name` di request dipetakan ke `username` di tabel `user_profiles`
3. **Struktur update yang tidak optimal**: Tidak memisahkan update untuk tabel `users` dan `user_profiles`

## Perubahan yang Dilakukan

### 1. UserProfileController.js

- **Perubahan**: Menambah field `first_name`, `last_name`, dan `username` ke request body
- **Sebelum**: `{ name, bio, location, platforms }`
- **Sesudah**: `{ first_name, last_name, username, bio, location, platforms }`

### 2. UserProfileService.js

#### Method: `updateUserProfile()`

- **Memisahkan update untuk dua tabel**:
  - **Tabel `users`**: `first_name`, `last_name`
  - **Tabel `user_profiles`**: `username`, `bio`, `location`, `avatar`
- **Validasi**: Memastikan baik user maupun user_profile ada sebelum update
- **Error handling**: Lebih spesifik dan informatif

#### Method: `getUserProfileById()`

- **Perubahan**: Mengambil data dari kedua tabel (`users` dan `user_profiles`)
- **Return data lengkap**: Termasuk `first_name`, `last_name`, dan `email` dari tabel `users`

### 3. UserProfileRepository.js

#### Method: `update()`

- **Fix mapping**: Menggunakan `updateData.username` bukan `updateData.name`
- **Optimasi**: Hanya melakukan patch jika ada field yang berubah
- **Return**: Mengembalikan data profile yang sudah diupdate dari database

## Field yang Dapat Diupdate

### Tabel `users`:

- ✅ `first_name` - Nama depan user
- ✅ `last_name` - Nama belakang user
- ❌ `email` - Tidak boleh diubah (keamanan)
- ❌ `password` - Tidak boleh diubah di profile edit
- ❌ `role` - Admin only
- ❌ `status` - Admin only
- ❌ `is_active` - Admin only

### Tabel `user_profiles`:

- ✅ `username` - Username unik user
- ✅ `avatar` - Foto profil user
- ✅ `bio` - Deskripsi profil user
- ✅ `location` - Lokasi user

### Social Links:

- ✅ `platforms` - Array social media links (dihandle oleh `UserSocialLinkService`)

## API Request Format

### Update User Profile

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe123",
  "bio": "Digital artist and illustrator",
  "location": "Jakarta, Indonesia",
  "platforms": [
    {
      "platform": "instagram",
      "url": "https://instagram.com/johndoe"
    },
    {
      "platform": "twitter",
      "url": "https://twitter.com/johndoe"
    }
  ]
}
```

### Form Data (untuk avatar upload):

- `avatar`: File upload (optional)
- `first_name`: String
- `last_name`: String
- `username`: String
- `bio`: String
- `location`: String
- `platforms`: JSON string array

## API Response Format

### Success Response:

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "username": "johndoe123",
    "avatar": "storage/avatars/avatar_123.jpg",
    "bio": "Digital artist and illustrator",
    "location": "Jakarta, Indonesia",
    "created_at": "2025-06-12T10:00:00.000Z",
    "updated_at": "2025-06-12T10:30:00.000Z"
  }
}
```

### Error Response:

```json
{
  "success": false,
  "message": "User or user profile not found"
}
```

## Testing Checklist

- [ ] Test update `first_name` dan `last_name`
- [ ] Test update `username`
- [ ] Test update `bio` dan `location`
- [ ] Test upload avatar baru
- [ ] Test update social links
- [ ] Test kombinasi update semua field
- [ ] Test dengan field kosong/undefined
- [ ] Test error handling untuk user tidak ditemukan
- [ ] Test penghapusan avatar lama saat upload avatar baru

## Database Impact

- **Tabel yang terpengaruh**: `users`, `user_profiles`, `user_social_links`
- **Breaking changes**: Tidak ada (backward compatible)
- **Migration**: Tidak diperlukan (menggunakan struktur database yang sudah ada)

## Security Considerations

- ✅ Avatar upload validation (tipe file, ukuran)
- ✅ Authentication required (JWT token)
- ✅ Input sanitization
- ✅ Field yang sensitif tidak bisa diubah (`email`, `password`, `role`)
- ✅ File upload directory safety

## Performance Impact

- **Minimal**: Hanya menambah satu query tambahan ke tabel `users`
- **Optimasi**: Update hanya dilakukan jika ada field yang berubah
- **File cleanup**: Avatar lama dihapus otomatis saat upload avatar baru
