# Weekly Challenge API Documentation

## Overview

The Weekly Challenge feature allows admins to create challenges where users can submit posts to compete. Winners receive badges as rewards.

## Admin Endpoints

### Create Challenge

**POST** `/api/challenges`

- **Authorization**: Admin required
- **Content-Type**: `multipart/form-data`

**Request Body:**

```json
{
  "title": "Anime Art Challenge",
  "description": "Create your best anime character artwork",
  "deadline": "2025-06-17T23:59:59.000Z"
}
```

**Files:**

- `badge_img`: Badge image file (optional, PNG/JPG/GIF, max 5MB)

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Anime Art Challenge",
    "description": "Create your best anime character artwork",
    "badge_img": "/storage/badges/badge-1625932800000-123456789.png",
    "deadline": "2025-06-17T23:59:59.000Z",
    "is_closed": false,
    "created_by": 1,
    "created_at": "2025-06-10T12:00:00.000Z",
    "updated_at": "2025-06-10T12:00:00.000Z"
  }
}
```

### Update Challenge

**PUT** `/api/challenges/:id`

- **Authorization**: Admin required
- **Content-Type**: `multipart/form-data`

**Request Body:**

```json
{
  "title": "Updated Anime Art Challenge",
  "description": "Updated description"
}
```

### Close Challenge

**PUT** `/api/challenges/:id/close`

- **Authorization**: Admin required

**Response:**

```json
{
  "success": true,
  "message": "Challenge closed successfully"
}
```

### Delete Challenge

**DELETE** `/api/challenges/:id`

- **Authorization**: Admin required

**Response:**

```json
{
  "success": true,
  "message": "Challenge deleted successfully"
}
```

### Select Winners

**POST** `/api/challenges/:id/select-winners`

- **Authorization**: Admin required

**Request Body:**

```json
{
  "winnerUserIds": [1, 2, 3],
  "adminNote": "Congratulations! Outstanding artwork!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Awarded badges to 3 winners",
  "awardedBadges": [...],
  "errors": []
}
```

## Public Endpoints

### Get All Challenges

**GET** `/api/challenges`

**Query Parameters:**

- None

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Anime Art Challenge",
      "description": "Create your best anime character artwork",
      "badge_img": "/storage/badges/badge-1625932800000-123456789.png",
      "deadline": "2025-06-17T23:59:59.000Z",
      "is_closed": false,
      "created_by": 1,
      "creator": {
        "id": 1,
        "firstName": "Admin",
        "lastName": "User",
        "profile": {
          "username": "admin",
          "avatar": null
        }
      },
      "challengePosts": [...],
      "userBadges": [...]
    }
  ]
}
```

### Get Active Challenges

**GET** `/api/challenges/active`

Returns only challenges that are not closed and deadline hasn't passed.

### Get Challenge by ID

**GET** `/api/challenges/:id`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Anime Art Challenge",
    "description": "Create your best anime character artwork",
    "badge_img": "/storage/badges/badge-1625932800000-123456789.png",
    "deadline": "2025-06-17T23:59:59.000Z",
    "is_closed": false,
    "creator": {...},
    "challengePosts": [
      {
        "id": 1,
        "challenge_id": 1,
        "post_id": 10,
        "user_id": 2,
        "created_at": "2025-06-15T14:30:00.000Z",
        "post": {
          "id": 10,
          "title": "My Anime Character",
          "description": "A beautiful anime girl",
          "images": [...],
          "tags": [...],
          "user": {...}
        }
      }
    ],
    "userBadges": [...]
  }
}
```

### Get Challenge Leaderboard

**GET** `/api/challenges/:id/leaderboard`

Returns challenge with posts sorted by likes count (most liked first).

### Get Challenge Winners

**GET** `/api/challenges/:id/winners`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 2,
      "challenge_id": 1,
      "badge_img": "/storage/badges/badge-1625932800000-123456789.png",
      "admin_note": "Congratulations! Outstanding artwork!",
      "awarded_at": "2025-06-18T10:00:00.000Z",
      "user": {
        "id": 2,
        "firstName": "John",
        "lastName": "Doe",
        "profile": {
          "username": "johndoe",
          "avatar": "/storage/avatars/avatar.jpg"
        }
      }
    }
  ]
}
```

## User Endpoints

### Submit Post to Challenge

**POST** `/api/challenges/:id/submit-post`

- **Authorization**: Required

**Request Body:**

```json
{
  "postId": 10
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "challenge_id": 1,
    "post_id": 10,
    "user_id": 2,
    "created_at": "2025-06-15T14:30:00.000Z",
    "updated_at": "2025-06-15T14:30:00.000Z"
  }
}
```

### Get User Challenge History

**GET** `/api/user/challenge-history`

- **Authorization**: Required

**Response:**

```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": 1,
        "challenge_id": 1,
        "post_id": 10,
        "user_id": 2,
        "created_at": "2025-06-15T14:30:00.000Z",
        "challenge": {...},
        "post": {...}
      }
    ],
    "badges": [
      {
        "id": 1,
        "user_id": 2,
        "challenge_id": 1,
        "badge_img": "/storage/badges/badge-1625932800000-123456789.png",
        "admin_note": "Congratulations! Outstanding artwork!",
        "awarded_at": "2025-06-18T10:00:00.000Z",
        "challenge": {...}
      }
    ]
  }
}
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Challenge deadline has passed"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Challenge not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "An unexpected error occurred."
}
```

## Business Rules

1. **Challenge Creation**:

   - Only admins can create challenges
   - Deadline must be in the future
   - Badge image is optional

2. **Post Submission**:

   - Users can only submit once per challenge
   - Cannot submit if challenge is closed
   - Cannot submit if deadline has passed
   - Post must belong to the submitting user

3. **Badge Award**:

   - Only admins can award badges
   - Challenge must be closed before selecting winners
   - Users must have participated in the challenge
   - One badge per user per challenge

4. **Auto-Close**:
   - Challenges are automatically closed after deadline
   - Scheduler runs every hour to check expired challenges

## File Upload

### Badge Images

- **Location**: `/storage/badges/`
- **Formats**: PNG, JPG, JPEG, GIF
- **Size Limit**: 5MB
- **Naming**: `badge-{timestamp}-{random}.{extension}`

## Scheduler

The system includes an automatic scheduler that:

- Runs every hour
- Checks for challenges past their deadline
- Automatically closes expired challenges
- Logs all operations

To manually trigger the auto-close process (for testing):

```javascript
const ChallengeScheduler = require("./utils/ChallengeScheduler");
await ChallengeScheduler.triggerAutoClose();
```
