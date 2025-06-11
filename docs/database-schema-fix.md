# Database Schema Fix - Post Reports

## Issue Fixed

Error dalam query PostgresRepository untuk `findPostsWithReports()`:

```
Unknown column 'users.username' in 'field list'
```

## Root Cause

Query mencoba mengakses `users.username` tetapi field `username` berada di tabel `user_profiles`, bukan di tabel `users`.

## Database Structure Clarification

### users table

```sql
- id (PK)
- email
- password
- first_name
- last_name
- role
- is_active
- status
- created_at
- updated_at
```

### user_profiles table

```sql
- id (PK)
- user_id (FK to users.id)
- username  ← Field yang dibutuhkan
- avatar
- bio
- location
- created_at
- updated_at
```

## Solution Applied

### Before (Broken Query):

```sql
SELECT user_posts.*, users.username, users.email, COUNT(post_reports.id) as report_count
FROM user_posts
INNER JOIN users ON user_posts.user_id = users.id
INNER JOIN post_reports ON user_posts.id = post_reports.post_id
GROUP BY user_posts.id, users.username, users.email
```

### After (Fixed Query):

```sql
SELECT user_posts.*, users.email, user_profiles.username, COUNT(post_reports.id) as report_count
FROM user_posts
INNER JOIN users ON user_posts.user_id = users.id
INNER JOIN user_profiles ON users.id = user_profiles.user_id
INNER JOIN post_reports ON user_posts.id = post_reports.post_id
GROUP BY user_posts.id, users.email, user_profiles.username
```

## Files Modified

- `repositories/PostReportRepository.js` - Method `findPostsWithReports()`

## Key Changes

1. Added join to `user_profiles` table
2. Changed `users.username` to `user_profiles.username` in SELECT
3. Updated GROUP BY clause to include correct table references

## Testing

Query tested successfully with MCP MySQL connection. Schema validation confirmed that:

- `username` exists in `user_profiles` table only
- Join relationship: `users.id = user_profiles.user_id` is valid
- Query syntax is now correct and executable
