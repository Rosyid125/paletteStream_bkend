# CORS Multiple Domains Configuration

## Cara Menggunakan Multiple CORS Origins

### 1. Single Domain (sebelumnya)

```env
CORS_ORIGIN=http://localhost:5173
```

### 2. Multiple Domains (sekarang)

```env
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,https://yourdomain.com,https://www.yourdomain.com
```

### 3. Format Penulisan

- Pisahkan setiap domain dengan koma (`,`)
- Tidak ada spasi setelah koma (akan di-trim secara otomatis)
- Sertakan protokol (http/https)
- Sertakan port jika diperlukan

### 4. Contoh Konfigurasi Environment

#### Development

```env
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

#### Production

```env
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com,http://localhost:5173
```

#### Mixed (Development + Production)

```env
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,https://yourdomain.com,https://staging.yourdomain.com
```

### 5. Fitur Tambahan

- **Automatic request without origin**: Aplikasi mobile, Postman, dan tools lainnya akan otomatis diizinkan
- **Flexible methods**: Mendukung GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Cookie support**: Credentials tetap berfungsi untuk semua domain
- **Socket.IO support**: WebSocket connections juga menggunakan konfigurasi yang sama

### 6. Error Handling

Jika domain tidak ada dalam daftar yang diizinkan, akan muncul error:

```
Error: Not allowed by CORS
```

### 7. Testing

Anda dapat menguji dengan:

1. Membuka aplikasi dari domain yang berbeda
2. Menggunakan browser developer tools untuk melihat CORS headers
3. Melakukan request dari Postman atau aplikasi mobile

## Implementasi Code

Konfigurasi ini telah diimplementasikan di:

- **Express CORS**: `server.js` - corsOptions
- **Socket.IO CORS**: `server.js` - io server configuration
