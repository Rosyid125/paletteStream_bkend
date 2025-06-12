# 🎮 Gamification Hub API Documentation

## Overview

API ini menyediakan endpoint untuk menampilkan data gamifikasi lengkap yang dibutuhkan frontend, termasuk level, EXP, achievements, badges, dan challenges. API ini dirancang khusus untuk mendukung tampilan Gamification Hub di frontend.

## Base URL

```
http://localhost:5000/api/gamification
```

---

## 🏠 Endpoints

### 1. Get Complete Gamification Hub

**Endpoint**: `GET /hub`

**Description**: Mengambil data gamifikasi lengkap untuk user yang sedang login (berdasarkan token).

**Authentication**: Required (Cookie: accessToken)

**Request**:

```http
GET /api/gamification/hub
Cookie: accessToken=<jwt_token>
```

**Response**:

```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "stats": {
      "level": 5,
      "exp": 1250,
      "current_threshold": 1000,
      "next_threshold": 1350,
      "exp_to_next_level": 100,
      "level_progress_percentage": 71,
      "total_achievements": 15,
      "completed_achievements": 3,
      "achievement_completion_percentage": 20,
      "total_badges": 2,
      "challenge_wins": 1,
      "active_challenges": 2
    },
    "level_info": {
      "current_level": 5,
      "current_exp": 1250,
      "current_threshold": 1000,
      "next_threshold": 1350,
      "progress_percentage": 71,
      "exp_needed": 100
    },
    "achievements": {
      "total": 15,
      "completed": 3,
      "completion_percentage": 20,
      "recent_completed": [
        {
          "id": 1,
          "title": "Community Favorite",
          "icon": "👥",
          "description": "Get 20 likes from 10 different users",
          "goal": 10,
          "progress": 10,
          "status": "completed",
          "percentage": 100,
          "is_completed": true
        }
      ],
      "in_progress": [
        {
          "id": 2,
          "title": "Rising Star",
          "icon": "⭐",
          "description": "Get 50 total likes on your posts",
          "goal": 50,
          "progress": 25,
          "status": "in-progress",
          "percentage": 50,
          "is_completed": false
        }
      ]
    },
    "badges": {
      "total": 2,
      "recent": [
        {
          "id": 1,
          "challenge_id": 1,
          "challenge_title": "Fantasy World",
          "badge_img": "storage/badges/fantasy-badge.png",
          "earned_at": "2025-06-10T10:30:00.000Z",
          "admin_note": "Winner of Fantasy World Challenge"
        }
      ],
      "all": [...]
    },
    "challenges": {
      "active": [
        {
          "id": 2,
          "title": "Character Design",
          "description": "Create original character designs",
          "badge_img": "storage/badges/character-badge.png",
          "deadline": "2025-06-20T23:59:59.000Z",
          "status": "active",
          "participants_count": 45,
          "posts_count": 32,
          "days_left": 8
        }
      ],
      "total_active": 2,
      "user_wins": 1,
      "recent_wins": [...]
    }
  }
}
```

---

### 2. Get User Level Info

**Endpoint**: `GET /level/:userId`

**Description**: Mengambil informasi level dan EXP untuk user tertentu.

**Parameters**:

- `userId` (path): ID user yang ingin dilihat level-nya

**Request**:

```http
GET /api/gamification/level/123
```

**Response**:

```json
{
  "success": true,
  "data": {
    "user_id": 123,
    "level": 5,
    "exp": 1250,
    "current_threshold": 1000,
    "next_threshold": 1350,
    "exp_to_next_level": 100,
    "progress_percentage": 71
  }
}
```

---

### 3. Get User Achievements

**Endpoint**: `GET /achievements/:userId`

**Description**: Mengambil data achievements untuk user tertentu dengan filter status.

**Parameters**:

- `userId` (path): ID user
- `status` (query): Filter status achievement
  - `all` (default): Semua achievements
  - `completed`: Hanya yang completed
  - `in-progress`: Hanya yang sedang dikerjakan

**Request**:

```http
GET /api/gamification/achievements/123?status=completed
```

**Response**:

```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 15,
      "completed": 3,
      "in_progress": 12,
      "completion_percentage": 20
    },
    "achievements": [
      {
        "id": 1,
        "title": "Community Favorite",
        "icon": "👥",
        "description": "Get 20 likes from 10 different users",
        "goal": 10,
        "progress": 10,
        "status": "completed",
        "percentage": 100,
        "is_completed": true,
        "unlocked_at": "2025-06-10T08:30:00.000Z"
      },
      {
        "id": 2,
        "title": "Rising Star",
        "icon": "⭐",
        "description": "Get 50 total likes on your posts",
        "goal": 50,
        "progress": 25,
        "status": "in-progress",
        "percentage": 50,
        "is_completed": false,
        "unlocked_at": null
      }
    ]
  }
}
```

---

### 4. Get User Badges

**Endpoint**: `GET /badges/:userId`

**Description**: Mengambil data badges yang diperoleh user.

**Parameters**:

- `userId` (path): ID user

**Request**:

```http
GET /api/gamification/badges/123
```

**Response**:

```json
{
  "success": true,
  "data": {
    "summary": {
      "total_badges": 2,
      "recent_badges": [
        {
          "id": 2,
          "challenge_id": 2,
          "challenge_title": "Character Design",
          "badge_img": "storage/badges/character-badge.png",
          "earned_at": "2025-06-12T15:45:00.000Z",
          "admin_note": "2nd Place Winner",
          "rank": 2
        }
      ]
    },
    "badges": [
      {
        "id": 1,
        "challenge_id": 1,
        "challenge_title": "Fantasy World",
        "badge_img": "storage/badges/fantasy-badge.png",
        "earned_at": "2025-06-10T10:30:00.000Z",
        "admin_note": "Winner of Fantasy World Challenge",
        "rank": 1
      },
      {
        "id": 2,
        "challenge_id": 2,
        "challenge_title": "Character Design",
        "badge_img": "storage/badges/character-badge.png",
        "earned_at": "2025-06-12T15:45:00.000Z",
        "admin_note": "2nd Place Winner",
        "rank": 2
      }
    ]
  }
}
```

---

### 6. Get Profile Badges (For Profile Page)

**Endpoint**: `GET /profile/badges/:userId`

**Description**: Mengambil data badges yang diperoleh user dengan detail lengkap untuk ditampilkan di halaman profil.

**Parameters**:

- `userId` (path): ID user yang ingin dilihat badges-nya

**Request**:

```http
GET /api/gamification/profile/badges/123
```

**Response**:

```json
{
  "success": true,
  "data": {
    "user_id": 123,
    "total_badges": 3,
    "badges": [
      {
        "id": 3,
        "challenge_id": 3,
        "challenge_title": "Character Design",
        "badge_img": "storage/badges/character-badge.png",
        "earned_at": "2025-06-12T15:45:00.000Z",
        "admin_note": "2nd Place Winner",
        "rank": 2,
        "rank_display": "2nd Place"
      },
      {
        "id": 1,
        "challenge_id": 1,
        "challenge_title": "Fantasy World",
        "badge_img": "storage/badges/fantasy-badge.png",
        "earned_at": "2025-06-10T10:30:00.000Z",
        "admin_note": "Winner of Fantasy World Challenge",
        "rank": 1,
        "rank_display": "Winner"
      },
      {
        "id": 2,
        "challenge_id": 2,
        "challenge_title": "Anime Style",
        "badge_img": "storage/badges/anime-badge.png",
        "earned_at": "2025-06-08T14:20:00.000Z",
        "admin_note": "3rd Place Winner",
        "rank": 3,
        "rank_display": "3rd Place"
      }
    ]
  }
}
```

---

### 7. Get Profile Challenges (For Profile Page)

**Endpoint**: `GET /profile/challenges/:userId`

**Description**: Mengambil data partisipasi challenge user dengan detail lengkap untuk ditampilkan di halaman profil, termasuk status menang/kalah.

**Parameters**:

- `userId` (path): ID user yang ingin dilihat challenge history-nya

**Query Parameters**:

- `status` (optional): Filter status challenge
  - `all` (default): Semua challenge yang pernah diikuti
  - `won`: Hanya challenge yang dimenangkan
  - `participated`: Hanya challenge yang diikuti tapi tidak menang
  - `active`: Hanya challenge yang masih aktif

**Request**:

```http
GET /api/gamification/profile/challenges/123?status=all
```

**Response**:

```json
{
  "success": true,
  "data": {
    "user_id": 123,
    "stats": {
      "total_participated": 5,
      "total_won": 2,
      "active_participations": 1,
      "win_rate": 40
    },
    "challenges": [
      {
        "id": 4,
        "title": "Digital Painting",
        "description": "Create stunning digital paintings",
        "badge_img": "storage/badges/digital-badge.png",
        "deadline": "2025-06-20T23:59:59.000Z",
        "is_closed": false,
        "status": "active",
        "participation_date": "2025-06-11T08:30:00.000Z",
        "post_id": 145,
        "win_info": null
      },
      {
        "id": 3,
        "title": "Character Design",
        "description": "Design original characters",
        "badge_img": "storage/badges/character-badge.png",
        "deadline": "2025-06-10T23:59:59.000Z",
        "is_closed": true,
        "status": "won",
        "participation_date": "2025-06-05T10:15:00.000Z",
        "post_id": 123,
        "win_info": {
          "rank": 2,
          "rank_display": "2nd Place",
          "final_score": 85,
          "admin_note": "Excellent character development",
          "selected_at": "2025-06-12T15:45:00.000Z"
        }
      },
      {
        "id": 2,
        "title": "Landscape Art",
        "description": "Beautiful landscape illustrations",
        "badge_img": "storage/badges/landscape-badge.png",
        "deadline": "2025-06-05T23:59:59.000Z",
        "is_closed": true,
        "status": "participated",
        "participation_date": "2025-06-01T14:20:00.000Z",
        "post_id": 98,
        "win_info": null
      },
      {
        "id": 1,
        "title": "Fantasy World",
        "description": "Create fantasy world artwork",
        "badge_img": "storage/badges/fantasy-badge.png",
        "deadline": "2025-05-30T23:59:59.000Z",
        "is_closed": true,
        "status": "won",
        "participation_date": "2025-05-25T09:45:00.000Z",
        "post_id": 67,
        "win_info": {
          "rank": 1,
          "rank_display": "Winner",
          "final_score": 95,
          "admin_note": "Outstanding creativity and execution",
          "selected_at": "2025-06-01T10:30:00.000Z"
        }
      }
    ]
  }
}
```

**Challenge Status Explanation**:

- `active`: Challenge masih berlangsung dan user masih berpartisipasi
- `won`: Challenge selesai dan user memenangkan posisi (rank 1-3)
- `participated`: Challenge selesai tapi user tidak memenangkan posisi

---

### 5. Get Leaderboard

**Endpoint**: `GET /leaderboard`

**Description**: Mengambil data leaderboard (placeholder untuk future implementation).

**Query Parameters**:

- `type` (optional): Tipe leaderboard (`level`, `achievements`, `badges`)
- `limit` (optional): Batas jumlah data (default: 10)

**Request**:

```http
GET /api/gamification/leaderboard?type=level&limit=10
```

**Response**:

```json
{
  "success": true,
  "data": {
    "type": "level",
    "leaderboard": []
  }
}
```

---

## 🔧 Implementation Notes

### Data Sources

1. **Level & EXP**: `UserExpService.getUserExpByUserId()`
2. **Achievements**: `AchievementService.getAllAchievements()` + `UserAchievementRepository.findByUserId()`
3. **Badges**: `UserBadgeRepository.findByUserId()`
4. **Challenges**: `ChallengeService.getActiveChallenges()` + `ChallengeWinnerService.getUserWins()`
5. **Profile Badges**: `UserBadgeRepository.findByUserId()` (with detailed formatting)
6. **Profile Challenges**: `ChallengeService.getUserChallengeParticipations()` + `ChallengeWinnerService.getUserWins()`

### Calculated Fields

- `percentage`: Progress persentase untuk achievements
- `exp_to_next_level`: EXP yang dibutuhkan untuk level selanjutnya
- `level_progress_percentage`: Persentase progress untuk level saat ini
- `achievement_completion_percentage`: Persentase achievements yang sudah selesai
- `days_left`: Hari tersisa untuk challenge (calculated)

### Authentication

- Endpoint `/hub` menggunakan JWT token dari cookie `accessToken`
- Endpoint profile (`/profile/badges/:userId`, `/profile/challenges/:userId`) bersifat public (dapat dilihat user lain)
- Endpoint lainnya bersifat public (dapat dilihat user lain)

---

## 🎯 Profile Tab Implementation

### Badges Tab Component

```jsx
import React, { useState, useEffect } from "react";

const ProfileBadgesTab = ({ userId }) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileBadges();
  }, [userId]);

  const fetchProfileBadges = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/gamification/profile/badges/${userId}`);
      const data = await response.json();

      if (data.success) {
        setBadges(data.data.badges);
      }
    } catch (error) {
      console.error("Error fetching badges:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "text-yellow-500"; // Gold
      case 2:
        return "text-gray-400"; // Silver
      case 3:
        return "text-orange-600"; // Bronze
      default:
        return "text-blue-500";
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading badges...</div>;
  }

  if (badges.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-4xl mb-4">🏆</div>
        <p>No badges earned yet</p>
        <p className="text-sm">Participate in challenges to earn badges!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {badges.map((badge) => (
        <div key={badge.id} className="bg-white rounded-lg shadow-md p-6 border">
          <div className="text-center">
            <img src={badge.badge_img} alt={badge.challenge_title} className="w-16 h-16 mx-auto mb-4 object-contain" />
            <h3 className="font-semibold text-lg mb-2">{badge.challenge_title}</h3>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRankColor(badge.rank)} bg-gray-100`}>
              <span>🏆</span>
              <span className="ml-1">{badge.rank_display}</span>
            </div>
            {badge.admin_note && <p className="text-gray-600 text-sm mt-3 italic">"{badge.admin_note}"</p>}
            <p className="text-gray-500 text-xs mt-2">Earned on {new Date(badge.earned_at).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileBadgesTab;
```

### Challenges Tab Component

```jsx
import React, { useState, useEffect } from "react";

const ProfileChallengesTab = ({ userId }) => {
  const [challenges, setChallenges] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileChallenges();
  }, [userId, filter]);

  const fetchProfileChallenges = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/gamification/profile/challenges/${userId}?status=${filter}`);
      const data = await response.json();

      if (data.success) {
        setChallenges(data.data.challenges);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error("Error fetching challenges:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      won: { color: "bg-green-100 text-green-800", icon: "🏆", label: "Won" },
      active: { color: "bg-blue-100 text-blue-800", icon: "⏳", label: "Active" },
      participated: { color: "bg-gray-100 text-gray-800", icon: "📝", label: "Participated" },
    };
    return badges[status] || badges.participated;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading challenges...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total_participated}</div>
          <div className="text-sm text-gray-600">Participated</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{stats.total_won}</div>
          <div className="text-sm text-gray-600">Won</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.active_participations}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.win_rate}%</div>
          <div className="text-sm text-gray-600">Win Rate</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4 border-b">
        {[
          { key: "all", label: "All" },
          { key: "won", label: "Won" },
          { key: "active", label: "Active" },
          { key: "participated", label: "Participated" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${filter === tab.key ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Challenges List */}
      {challenges.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">🎯</div>
          <p>No challenges found</p>
          <p className="text-sm">{filter === "all" ? "Haven't participated in any challenges yet" : `No ${filter} challenges`}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {challenges.map((challenge) => {
            const statusBadge = getStatusBadge(challenge.status);
            return (
              <div key={challenge.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <img src={challenge.badge_img} alt={challenge.title} className="w-12 h-12 object-contain" />
                      <div>
                        <h3 className="font-semibold text-lg">{challenge.title}</h3>
                        <p className="text-gray-600 text-sm">{challenge.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-3">
                      <span>Joined: {formatDate(challenge.participation_date)}</span>
                      <span>Deadline: {formatDate(challenge.deadline)}</span>
                    </div>

                    {challenge.win_info && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600 font-medium">🏆 {challenge.win_info.rank_display}</span>
                          {challenge.win_info.final_score && <span className="text-gray-600">• Score: {challenge.win_info.final_score}</span>}
                        </div>
                        {challenge.win_info.admin_note && <p className="text-green-700 text-sm mt-1 italic">"{challenge.win_info.admin_note}"</p>}
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                      <span className="mr-1">{statusBadge.icon}</span>
                      {statusBadge.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfileChallengesTab;
```

---

## 🎮 Frontend Integration

### React Example

```javascript
// Fetch gamification hub data
const fetchGamificationHub = async () => {
  try {
    const response = await fetch("/api/gamification/hub", {
      credentials: "include", // Include cookies
    });
    const data = await response.json();

    if (data.success) {
      setGamificationData(data.data);
    }
  } catch (error) {
    console.error("Error fetching gamification data:", error);
  }
};

// Fetch user achievements with filter
const fetchAchievements = async (userId, status = "all") => {
  try {
    const response = await fetch(`/api/gamification/achievements/${userId}?status=${status}`);
    const data = await response.json();

    if (data.success) {
      setAchievements(data.data.achievements);
    }
  } catch (error) {
    console.error("Error fetching achievements:", error);
  }
};

// Fetch profile badges for profile page
const fetchProfileBadges = async (userId) => {
  try {
    const response = await fetch(`/api/gamification/profile/badges/${userId}`);
    const data = await response.json();

    if (data.success) {
      setProfileBadges(data.data.badges);
    }
  } catch (error) {
    console.error("Error fetching profile badges:", error);
  }
};

// Fetch profile challenges for profile page
const fetchProfileChallenges = async (userId, status = "all") => {
  try {
    const response = await fetch(`/api/gamification/profile/challenges/${userId}?status=${status}`);
    const data = await response.json();

    if (data.success) {
      setProfileChallenges(data.data.challenges);
      setChallengeStats(data.data.stats);
    }
  } catch (error) {
    console.error("Error fetching profile challenges:", error);
  }
};
```

### State Management

```javascript
const [gamificationData, setGamificationData] = useState({
  stats: {},
  level_info: {},
  achievements: { total: 0, completed: 0, recent_completed: [], in_progress: [] },
  badges: { total: 0, recent: [], all: [] },
  challenges: { active: [], total_active: 0, user_wins: 0, recent_wins: [] },
});

// For profile page
const [profileBadges, setProfileBadges] = useState([]);
const [profileChallenges, setProfileChallenges] = useState([]);
const [challengeStats, setChallengeStats] = useState({
  total_participated: 0,
  total_won: 0,
  active_participations: 0,
  win_rate: 0,
});

// Profile challenge filter
const [challengeFilter, setChallengeFilter] = useState("all"); // 'all', 'won', 'participated', 'active'
```

---

## 🚀 Error Handling

### Error Responses

```json
{
  "success": false,
  "message": "Error message description"
}
```

### Common Error Codes

- `400`: Bad Request (Invalid user ID)
- `401`: Unauthorized (Missing or invalid token)
- `404`: User not found
- `500`: Internal Server Error

---

## 📊 Sample Data Structure

### Complete Hub Response Structure

```json
{
  "user_id": number,
  "stats": {
    "level": number,
    "exp": number,
    "current_threshold": number,
    "next_threshold": number,
    "exp_to_next_level": number,
    "level_progress_percentage": number,
    "total_achievements": number,
    "completed_achievements": number,
    "achievement_completion_percentage": number,
    "total_badges": number,
    "challenge_wins": number,
    "active_challenges": number
  },
  "level_info": {...},
  "achievements": {...},
  "badges": {...},
  "challenges": {...}
}
```

---

_Last Updated: June 12, 2025_
_API Version: 1.0_
