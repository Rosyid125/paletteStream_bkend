# Anti-Spam System Documentation

## Overview

Sistem anti-spam untuk melindungi sistem EXP/leveling dari abuse, khususnya untuk aktivitas commenting. Sistem ini mendeteksi pola spam dan memberikan lock sementara untuk mencegah farming EXP.

## Features

### 1. Spam Detection

- **Duplicate Comment Detection**: Mendeteksi comment yang sama berulang (threshold: 5 kali dalam 10 menit)
- **Rapid Commenting Detection**: Mendeteksi comment terlalu cepat (threshold: 3 comment dalam 5 menit)
- **Content Hash Matching**: Menggunakan MD5 hash untuk deteksi duplicate content

### 2. Anti-Spam Lock System

- **24-hour Lock**: User yang terdeteksi spam akan di-lock selama 24 jam
- **EXP Block**: Selama lock, user tidak mendapat EXP dari comment activity
- **Comment Still Allowed**: Comment tetap bisa dibuat, tapi tidak dapat EXP

### 3. Admin Management

- **Lock Statistics**: Admin dashboard untuk melihat statistik spam
- **User Management**: Admin bisa unlock user secara manual
- **Spam History**: Melihat history spam dari user tertentu

## Database Schema

### Table: `user_spam_locks`

```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- spam_type ('comment_spam', etc.)
- spam_data (JSON - detail spam info)
- locked_at (TIMESTAMP)
- unlock_at (TIMESTAMP)
- is_active (BOOLEAN)
- created_at, updated_at
```

### Table: `comment_spam_tracking`

```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- post_id (FOREIGN KEY)
- comment_content (VARCHAR 500)
- content_hash (VARCHAR 255)
- created_at, updated_at
```

## API Endpoints

### Admin Anti-Spam Routes

Base URL: `/api/admin/spam/`

#### GET `/statistics`

Mendapatkan statistik spam untuk admin dashboard

```json
{
  "success": true,
  "data": {
    "total_active_locks": 5,
    "comment_spam_locks": 3,
    "locks_by_type": {
      "comment_spam": 3,
      "other_spam": 2
    }
  }
}
```

#### GET `/locks`

Mendapatkan daftar user yang sedang di-lock

- Query params: `spam_type` (optional)

#### GET `/user/:userId/history`

Mendapatkan history spam dari user tertentu

- Query params: `limit` (default: 20)

#### GET `/user/:userId/status`

Mendapatkan status lock user

```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "locks": [...],
    "is_locked": true
  }
}
```

#### POST `/user/:userId/unlock`

Unlock user secara manual (admin only)

```json
{
  "spam_type": "comment_spam"
}
```

#### POST `/cleanup`

Menjalankan cleanup manual

## Service Architecture

### AntiSpamService

- `checkCommentSpam()`: Main spam detection logic
- `handleSpamDetected()`: Handle ketika spam terdeteksi
- `canUserGetExp()`: Cek apakah user bisa dapat EXP
- `cleanup()`: Cleanup expired locks dan old data

### GamificationService Integration

- `handleCommentWithSpamCheck()`: Integrated comment spam check
- Modified `updateUserExpAndLevel()`: Check spam lock before giving EXP

### PostCommentService Integration

- Modified `create()`: Integrated spam detection in comment creation
- Comment tetap dibuat meski spam, tapi tidak dapat EXP

## Configuration

### Spam Thresholds

```javascript
COMMENT_SPAM: {
  MAX_SAME_COMMENTS: 5,        // Max same comments
  TIME_WINDOW_MINUTES: 10,     // Time window for duplicate detection
  RAPID_COMMENT_LIMIT: 3,      // Max comments in rapid time
  RAPID_TIME_WINDOW: 5,        // Rapid time window (minutes)
  LOCK_DURATION_HOURS: 24      // Lock duration
}
```

## Scheduler

- **Daily Cleanup**: Runs at 2:00 AM daily
- **Expired Lock Cleanup**: Deactivate expired locks
- **Old Data Cleanup**: Remove tracking data older than 30 days

## Testing

### Test File: `test-anti-spam-system.js`

Run tests:

```bash
node test-anti-spam-system.js
```

Tests include:

1. Normal comment (should pass)
2. Spam detection (multiple same comments)
3. User lock status check
4. Rapid commenting detection
5. Spam statistics
6. Cleanup functionality

## Usage Flow

### Normal Comment Flow

1. User creates comment
2. `PostCommentService.create()` called
3. `GamificationService.handleCommentWithSpamCheck()` checks for spam
4. If not spam: Comment created + EXP given
5. If spam: Comment created + No EXP + User locked

### Spam Detection Flow

1. Comment tracked in `comment_spam_tracking`
2. Check for duplicate content (same hash)
3. Check for rapid commenting
4. If threshold exceeded: Create lock in `user_spam_locks`
5. Send notification to user
6. Block EXP for future comments

### Admin Management Flow

1. Admin accesses spam statistics
2. View active locks and user history
3. Manual unlock if needed
4. Monitor spam patterns

## Benefits

- **Fair Play**: Prevents EXP farming through spam
- **User Experience**: Legitimate users unaffected
- **Admin Control**: Full visibility and control over spam
- **Automatic Cleanup**: Self-maintaining system
- **Flexible**: Easy to extend to other spam types

## Future Enhancements

- Machine learning spam detection
- Dynamic threshold adjustment
- Multiple spam types (like, follow, etc.)
- IP-based detection
- Warning system before lock
