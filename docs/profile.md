# 👤 Profile API Documentation

## Overview

API ini menyediakan endpoint untuk mengelola profil user dan menampilkan data gamifikasi dalam konteks profil, termasuk badges dan challenge history. API ini dirancang khusus untuk mendukung halaman profil user di frontend.

## Base URL

```
http://localhost:5000/api
```

---

## 🏠 Profile Endpoints

### 1. Get Profile Badges

**Endpoint**: `GET /gamification/profile/badges/:userId`

**Description**: Mengambil data badges yang diperoleh user dengan detail lengkap untuk ditampilkan di tab Badges pada halaman profil.

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

### 2. Get Profile Challenges

**Endpoint**: `GET /gamification/profile/challenges/:userId`

**Description**: Mengambil data partisipasi challenge user dengan detail lengkap untuk ditampilkan di tab Challenges pada halaman profil, termasuk status menang/kalah.

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

## 🔧 Implementation Details

### Data Sources

1. **Profile Badges**: `UserBadgeRepository.findByUserId()` with detailed challenge info
2. **Profile Challenges**: `ChallengeService.getUserChallengeParticipations()` + `ChallengeWinnerService.getUserWins()`

### Calculated Fields

- `rank_display`: Human-readable rank display (Winner, 2nd Place, 3rd Place)
- `win_rate`: Percentage of challenges won vs participated
- `status`: Challenge status based on participation and winning status
- `participation_date`: When user joined the challenge

### Authentication

- Both endpoints bersifat public (dapat dilihat user lain)
- Tidak memerlukan authentication token

---

## 🎨 Frontend Components

### Profile Badges Tab Component

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

### Profile Challenges Tab Component

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

## 📱 Profile Tab Integration Example

```jsx
import React, { useState } from "react";
import ProfileBadgesTab from "./ProfileBadgesTab";
import ProfileChallengesTab from "./ProfileChallengesTab";

const ProfilePage = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("posts");

  const tabs = [
    { key: "posts", label: "Posts", icon: "📝" },
    { key: "badges", label: "Badges", icon: "🏆" },
    { key: "challenges", label: "Challenges", icon: "🎯" },
    { key: "following", label: "Following", icon: "👥" },
    { key: "followers", label: "Followers", icon: "👥" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "badges":
        return <ProfileBadgesTab userId={userId} />;
      case "challenges":
        return <ProfileChallengesTab userId={userId} />;
      // ...other tabs
      default:
        return <div>Tab content for {activeTab}</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">{/* Profile info content */}</div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.key ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default ProfilePage;
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
- `404`: User not found
- `500`: Internal Server Error

---

## 🎯 Usage Examples

### Fetching Profile Data

```javascript
// Fetch badges for profile
const fetchProfileBadges = async (userId) => {
  try {
    const response = await fetch(`/api/gamification/profile/badges/${userId}`);
    const data = await response.json();

    if (data.success) {
      console.log(`User has ${data.data.total_badges} badges`);
      return data.data.badges;
    }
  } catch (error) {
    console.error("Error fetching profile badges:", error);
    return [];
  }
};

// Fetch challenges with filter
const fetchProfileChallenges = async (userId, status = "all") => {
  try {
    const response = await fetch(`/api/gamification/profile/challenges/${userId}?status=${status}`);
    const data = await response.json();

    if (data.success) {
      console.log(`User participated in ${data.data.stats.total_participated} challenges`);
      console.log(`Win rate: ${data.data.stats.win_rate}%`);
      return data.data.challenges;
    }
  } catch (error) {
    console.error("Error fetching profile challenges:", error);
    return [];
  }
};
```

---

_Last Updated: June 12, 2025_
_API Version: 1.0_
