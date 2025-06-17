# Cookie Debugging Quick Reference

## 🍪 Troubleshooting Cookie Issues

### 1. Check Cookie Settings in Browser DevTools

```
F12 > Application > Storage > Cookies > your-domain
```

### 2. Common Cookie Problems & Solutions

#### Problem: Cookie tidak terhapus saat logout

```javascript
// ❌ Wrong - tidak ada options
res.clearCookie("accessToken");

// ✅ Correct - pakai options yang sama
res.clearCookie("accessToken", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
});
```

#### Problem: Cookie tidak terkirim cross-origin

```javascript
// ❌ Wrong untuk production CORS
sameSite: "Lax";

// ✅ Correct untuk production CORS
sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax";
```

#### Problem: Cookie tidak secure di production

```javascript
// ❌ Wrong - selalu false
secure: false;

// ✅ Correct - environment-aware
secure: process.env.NODE_ENV === "production";
```

### 3. Environment-Specific Behavior

#### Development (HTTP):

- `secure: false` - OK untuk localhost HTTP
- `sameSite: "Lax"` - OK untuk same-origin
- Domain: `localhost` atau `127.0.0.1`

#### Production (HTTPS):

- `secure: true` - Required untuk HTTPS
- `sameSite: "None"` - Required untuk cross-origin
- Domain: `yourdomain.com`

### 4. Testing Commands

#### Check if cookies are set:

```javascript
// Browser Console
document.cookie;
```

#### Manual cookie clear (testing):

```javascript
// Browser Console
document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
```

#### Test API with cookies:

```bash
# Login first
curl -c cookies.txt -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Use cookies for authenticated request
curl -b cookies.txt http://localhost:5000/api/auth/me

# Logout
curl -b cookies.txt -X POST http://localhost:5000/api/auth/logout

# Should fail after logout
curl -b cookies.txt http://localhost:5000/api/auth/me
```

### 5. CORS & Cookie Checklist

#### Backend (Express):

- [ ] `credentials: true` in CORS config
- [ ] `exposedHeaders: ['Set-Cookie']` in CORS config
- [ ] Cookie options match between set and clear
- [ ] Correct `secure` and `sameSite` for environment

#### Frontend:

- [ ] `credentials: 'include'` in fetch requests
- [ ] Same domain or properly configured CORS
- [ ] HTTPS in production if using `secure: true`

### 6. Debug Logs

Add this to your logout method for debugging:

```javascript
console.log("Before logout - cookies:", req.cookies);
console.log("Cookie options:", cookieOptions);
// ... clear cookies ...
console.log("After logout - should be empty on next request");
```

## 🚨 Red Flags

### Signs of Cookie Problems:

1. `/api/auth/me` still works after logout
2. User can refresh page and stay logged in after logout
3. Cookies visible in DevTools after logout
4. Different behavior between dev and production
5. CORS errors when using cookies

### Quick Fixes:

1. **Always use same options** for set and clear
2. **Environment-aware settings** for secure/sameSite
3. **Test in both environments** (dev HTTP + prod HTTPS)
4. **Check browser console** for cookie/CORS errors
5. **Use helper functions** to avoid inconsistency
