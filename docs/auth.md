# Dokumentasi Auth API

## POST /register/otp

- **Deskripsi:** Request OTP ke email untuk proses register akun baru.
- **Headers:** Content-Type: application/json
- **Body:**
  ```json
  { "email": "user@email.com" }
  ```
- **Response sukses:**
  ```json
  { "success": true, "message": "OTP sent to email", "data": { "email": "user@email.com" } }
  ```
- **Response error:**
  ```json
  { "success": false, "message": "Email is required" }
  ```

---

## POST /register

- **Deskripsi:** Register user baru (email & password) dengan OTP (OTP wajib).
- **Headers:** Content-Type: application/json
- **Body:**
  ```json
  { "email": "user@email.com", "password": "string", "firstName": "string", "lastName": "string", "otp": "123456" }
  ```
- **Response sukses:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      /* user object */
    }
  }
  ```
- **Response error:**
  ```json
  { "success": false, "message": "OTP is required for registration" }
  { "success": false, "message": "OTP invalid" }
  { "success": false, "message": "OTP expired" }
  { "success": false, "message": "Email already registered" }
  ```

---

## POST /login

- **Deskripsi:** Login dengan email & password, return JWT (via cookie).
- **Headers:** Content-Type: application/json
- **Body:**
  ```json
  { "email": "user@email.com", "password": "string" }
  ```
- **Response sukses:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      /* user object */
    }
  }
  ```
- **Response error:**
  ```json
  { "success": false, "message": "Invalid email or password" }
  ```

---

## POST /login/email

- **Deskripsi:** Request OTP ke email untuk login.
- **Headers:** Content-Type: application/json
- **Body:**
  ```json
  { "email": "user@email.com" }
  ```
- **Response sukses:**
  ```json
  { "success": true, "message": "OTP sent to email", "data": { "email": "user@email.com" } }
  ```
- **Response error:**
  ```json
  { "success": false, "message": "Email is required" }
  ```

---

## POST /login/email/verify

- **Deskripsi:** Verifikasi OTP dan login, return JWT (via cookie).
- **Headers:** Content-Type: application/json
- **Body:**
  ```json
  { "email": "user@email.com", "otp": "123456" }
  ```
- **Response sukses:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      /* user object */
    }
  }
  ```
- **Response error:**
  ```json
  { "success": false, "message": "OTP invalid" }
  ```

---

## POST /login/email/resend

- **Deskripsi:** Resend OTP ke email (maksimal 5x).
- **Headers:** Content-Type: application/json
- **Body:**
  ```json
  { "email": "user@email.com" }
  ```
- **Response sukses:**
  ```json
  { "success": true, "message": "OTP resent to email" }
  ```
- **Response error:**
  ```json
  { "success": false, "message": "Resend limit reached" }
  ```

---

## GET /me

- **Deskripsi:** Mendapatkan data user yang sedang login (dari JWT/cookie).
- **Headers:** Cookie: accessToken
- **Response sukses:**
  ```json
  {
    "success": true,
    "data": {
      /* user object */
    }
  }
  ```
- **Response error:**
  ```json
  { "error": "Unauthorized" }
  ```

---

## POST /refresh-token

- **Deskripsi:** Refresh access token menggunakan refresh token (dari cookie).
- **Headers:** Cookie: refreshToken
- **Response sukses:**
  ```json
  { "success": true, "message": "Token refreshed successfully" }
  ```
- **Response error:**
  ```json
  { "error": "Unauthorized" }
  ```

---

## POST /logout

- **Deskripsi:** Logout user, hapus token dari cookie.
- **Headers:** Cookie: refreshToken
- **Response sukses:**
  ```json
  { "success": true, "message": "Logged out successfully" }
  ```

---

## GET /login/google

- **Deskripsi:** Redirect ke halaman login Google OAuth2.
- **Headers:** None
- **Response sukses:**
  - Redirect ke Google
- **Response error:**
  ```json
  { "success": false, "message": "..." }
  ```

---

## GET /auth/google/callback

- **Deskripsi:** Callback dari Google OAuth2, login/daftar user, return JWT (via cookie).
- **Headers:** None
- **Query Params:**
  - `code` (dari Google)
- **Response sukses:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      /* user object */
    }
  }
  ```
- **Response error:**
  ```json
  { "success": false, "message": "..." }
  ```

---

## POST /forgot-password

- **Deskripsi:** Request OTP ke email untuk reset password (lupa password).
- **Headers:** Content-Type: application/json
- **Body:**
  ```json
  { "email": "user@email.com" }
  ```
- **Response sukses:**
  ```json
  { "success": true, "message": "OTP sent to email", "data": { "email": "user@email.com" } }
  ```
- **Response error:**
  ```json
  { "success": false, "message": "Email is required" }
  { "success": false, "message": "User not found" }
  ```

---

## POST /forgot-password/verify

- **Deskripsi:** Verifikasi OTP lupa password.
- **Headers:** Content-Type: application/json
- **Body:**
  ```json
  { "email": "user@email.com", "otp": "123456" }
  ```
- **Response sukses:**
  ```json
  { "success": true, "message": "OTP verified. You can now reset your password." }
  ```
- **Response error:**
  ```json
  { "success": false, "message": "OTP not found" }
  { "success": false, "message": "OTP invalid" }
  ```

---

## POST /forgot-password/reset

- **Deskripsi:** Reset password menggunakan OTP yang sudah diverifikasi.
- **Headers:** Content-Type: application/json
- **Body:**
  ```json
  { "email": "user@email.com", "otp": "123456", "newPassword": "newpassword123" }
  ```
- **Response sukses:**
  ```json
  { "success": true, "message": "Password reset successful. You can now login with your new password." }
  ```
- **Response error:**
  ```json
  { "success": false, "message": "OTP not found" }
  { "success": false, "message": "OTP invalid" }
  { "success": false, "message": "User not found" }
  ```

---

## POST /register/google

- **Deskripsi:** Register user baru via Google OAuth2 (FE mengirim data profil Google).
- **Headers:** Content-Type: application/json
- **Body:**
  ```json
  { "email": "user@email.com", "given_name": "NamaDepan", "family_name": "NamaBelakang" }
  ```
- **Response sukses:**
  ```json
  {
    "success": true,
    "message": "User registered via Google successfully",
    "data": {
      /* user object */
    }
  }
  ```
- **Response error:**
  ```json
  { "success": false, "message": "Email already registered" }
  { "success": false, "message": "Email is required" }
  ```

---

## Catatan

- Semua endpoint mengembalikan response JSON.
- Token dikirim via HTTP-only cookie (accessToken, refreshToken).
- Untuk endpoint yang membutuhkan autentikasi, pastikan cookie dikirimkan.
- Untuk Google OAuth2, FE harus handle redirect/callback.
