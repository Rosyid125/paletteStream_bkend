# 🛡️ Anti-Spam System - Quick Reference

## ⚡ Quick Start

```bash
# Setup sistem
node setup-anti-spam.js

# Test sistem
node test-anti-spam-system.js

# Lihat statistik
node setup-anti-spam.js --stats
```

## 🎯 Key Features

### Spam Detection

- **Duplicate Comments**: 5 comment sama dalam 10 menit → LOCK
- **Rapid Comments**: 3 comment berbeda dalam 5 menit → LOCK
- **Lock Duration**: 24 jam
- **EXP Block**: Tidak dapat EXP dari comment saat lock

### Admin Controls

- `/api/admin/spam/statistics` - Dashboard stats
- `/api/admin/spam/locks` - Daftar user terkunci
- `/api/admin/spam/user/:id/unlock` - Unlock manual
- `/api/admin/spam/cleanup` - Cleanup manual

## 🔧 Configuration

```javascript
// services/AntiSpamService.js
SPAM_THRESHOLDS = {
  COMMENT_SPAM: {
    MAX_SAME_COMMENTS: 5, // Threshold duplicate
    TIME_WINDOW_MINUTES: 10, // Window deteksi duplicate
    RAPID_COMMENT_LIMIT: 3, // Threshold rapid comment
    RAPID_TIME_WINDOW: 5, // Window rapid comment
    LOCK_DURATION_HOURS: 24, // Durasi lock
  },
};
```

## 📊 Database Tables

### `user_spam_locks`

- Menyimpan user yang di-lock
- Auto-cleanup setelah expired

### `comment_spam_tracking`

- Track semua comment activity
- Hash-based duplicate detection

## 🔄 Flow Diagram

```
Comment Created
       ↓
Spam Detection Check
       ↓
┌─────────────┬─────────────┐
│   SPAM?     │  NORMAL?    │
│     ↓       │     ↓       │
│ Lock User   │ Give EXP    │
│ No EXP      │ Send Notif  │
│ Send Alert  │             │
└─────────────┴─────────────┘
       ↓
Comment Still Saved
```

## ⚠️ Important Notes

1. **Comment Tetap Dibuat**: Meski spam, comment tidak dihapus
2. **EXP Block Only**: Hanya EXP yang diblokir, fitur lain normal
3. **Admin Override**: Admin bisa unlock kapan saja
4. **Auto Cleanup**: Sistem otomatis cleanup expired data
5. **Real-time**: Detection real-time saat comment dibuat

## 🐛 Troubleshooting

### User Complaint: "Tidak dapat EXP dari comment"

1. Cek lock status: `GET /api/admin/spam/user/:id/status`
2. Cek history: `GET /api/admin/spam/user/:id/history`
3. Manual unlock jika perlu: `POST /api/admin/spam/user/:id/unlock`

### Performance Issues

1. Run cleanup: `node setup-anti-spam.js --cleanup`
2. Check database indexes
3. Adjust TIME_WINDOW settings

### False Positives

1. Review SPAM_THRESHOLDS
2. Check user behavior patterns
3. Consider whitelist for trusted users

## 📈 Monitoring

```bash
# Cek logs real-time
tail -f logs/error.log | grep "SPAM"

# Database queries
SELECT * FROM user_spam_locks WHERE is_active = 1;
SELECT COUNT(*) FROM comment_spam_tracking WHERE DATE(created_at) = CURDATE();
```

## 🚀 Production Checklist

- [ ] Migration files applied
- [ ] Scheduler started in server.js
- [ ] Admin routes accessible
- [ ] Test spam detection works
- [ ] Monitor logs for errors
- [ ] Set up alerting for high spam activity
- [ ] Configure cleanup schedule
- [ ] Document admin procedures
