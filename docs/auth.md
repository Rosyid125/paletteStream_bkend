# Dokumentasi Auth API

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
