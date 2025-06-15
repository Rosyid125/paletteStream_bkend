# User Follow Pagination API Documentation

## Overview

API endpoints untuk mengambil daftar followers dan following dengan paginasi, lengkap dengan informasi profil user.

## Base URL

```
/api/user-follows
```

## Endpoints

### 1. Get User Followers (Paginated)

Mengambil daftar users yang mengikuti user tertentu dengan paginasi.

**Endpoint:** `GET /:userId/followers`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Parameters:**

- `userId` (path parameter) - ID user yang akan dicari followersnya
- `page` (query parameter, optional) - Nomor halaman (default: 1)
- `limit` (query parameter, optional) - Jumlah item per halaman (default: 10, max: 50)

**Example Request:**

```
GET /api/user-follows/123/followers?page=1&limit=10
```

**Example Response:**

```json
{
  "success": true,
  "message": "Followers retrieved successfully",
  "data": [
    {
      "follower_id": 456,
      "followed_at": "2025-06-15T10:30:00Z",
      "user_id": 456,
      "first_name": "John",
      "last_name": "Doe",
      "username": "johndoe",
      "avatar": "https://example.com/avatar.jpg",
      "bio": "Artist and illustrator"
    },
    {
      "follower_id": 789,
      "followed_at": "2025-06-14T15:45:00Z",
      "user_id": 789,
      "first_name": "Jane",
      "last_name": "Smith",
      "username": "janesmith",
      "avatar": null,
      "bio": "Anime lover"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 10,
    "total": 25,
    "total_pages": 3,
    "has_next": true,
    "has_prev": false
  }
}
```

### 2. Get User Following (Paginated)

Mengambil daftar users yang diikuti oleh user tertentu dengan paginasi.

**Endpoint:** `GET /:userId/following`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Parameters:**

- `userId` (path parameter) - ID user yang akan dicari followingnya
- `page` (query parameter, optional) - Nomor halaman (default: 1)
- `limit` (query parameter, optional) - Jumlah item per halaman (default: 10, max: 50)

**Example Request:**

```
GET /api/user-follows/123/following?page=1&limit=10
```

**Example Response:**

```json
{
  "success": true,
  "message": "Following retrieved successfully",
  "data": [
    {
      "followed_id": 456,
      "followed_at": "2025-06-15T10:30:00Z",
      "user_id": 456,
      "first_name": "John",
      "last_name": "Doe",
      "username": "johndoe",
      "avatar": "https://example.com/avatar.jpg",
      "bio": "Artist and illustrator"
    },
    {
      "followed_id": 789,
      "followed_at": "2025-06-14T15:45:00Z",
      "user_id": 789,
      "first_name": "Jane",
      "last_name": "Smith",
      "username": "janesmith",
      "avatar": null,
      "bio": "Anime lover"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 10,
    "total": 15,
    "total_pages": 2,
    "has_next": true,
    "has_prev": false
  }
}
```

## Error Responses

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Token is required"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "An unexpected error occurred."
}
```

## Frontend Implementation Guide

### React/JavaScript Example

#### 1. API Service Function

```javascript
// services/userFollowService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

export const userFollowService = {
  // Get followers with pagination
  getFollowers: async (userId, page = 1, limit = 10) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_BASE_URL}/user-follows/${userId}/followers`, {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching followers:", error);
      throw error;
    }
  },

  // Get following with pagination
  getFollowing: async (userId, page = 1, limit = 10) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_BASE_URL}/user-follows/${userId}/following`, {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching following:", error);
      throw error;
    }
  },
};
```

#### 2. React Component Example

```jsx
// components/UserProfile/FollowersTab.jsx
import React, { useState, useEffect } from "react";
import { userFollowService } from "../../services/userFollowService";

const FollowersTab = ({ userId }) => {
  const [followers, setFollowers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFollowers = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userFollowService.getFollowers(userId, page, 10);
      setFollowers(response.data);
      setPagination(response.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError("Failed to load followers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowers(1);
  }, [userId]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchFollowers(newPage);
    }
  };

  if (loading) return <div className="loading">Loading followers...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="followers-tab">
      <h3>Followers ({pagination.total || 0})</h3>

      {/* Followers List */}
      <div className="followers-list">
        {followers.map((follower) => (
          <div key={follower.user_id} className="follower-item">
            <div className="avatar">
              {follower.avatar ? (
                <img src={follower.avatar} alt={follower.username} />
              ) : (
                <div className="avatar-placeholder">
                  {follower.first_name?.[0]}
                  {follower.last_name?.[0]}
                </div>
              )}
            </div>
            <div className="user-info">
              <h4>
                {follower.first_name} {follower.last_name}
              </h4>
              <p className="username">@{follower.username}</p>
              {follower.bio && <p className="bio">{follower.bio}</p>}
              <p className="followed-date">Followed on {new Date(follower.followed_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={!pagination.has_prev} className="btn-pagination">
            Previous
          </button>

          <span className="page-info">
            Page {pagination.current_page} of {pagination.total_pages}
          </span>

          <button onClick={() => handlePageChange(currentPage + 1)} disabled={!pagination.has_next} className="btn-pagination">
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FollowersTab;
```

#### 3. Following Tab Component

```jsx
// components/UserProfile/FollowingTab.jsx
import React, { useState, useEffect } from "react";
import { userFollowService } from "../../services/userFollowService";

const FollowingTab = ({ userId }) => {
  const [following, setFollowing] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFollowing = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userFollowService.getFollowing(userId, page, 10);
      setFollowing(response.data);
      setPagination(response.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError("Failed to load following");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowing(1);
  }, [userId]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchFollowing(newPage);
    }
  };

  if (loading) return <div className="loading">Loading following...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="following-tab">
      <h3>Following ({pagination.total || 0})</h3>

      {/* Following List */}
      <div className="following-list">
        {following.map((user) => (
          <div key={user.user_id} className="following-item">
            <div className="avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} />
              ) : (
                <div className="avatar-placeholder">
                  {user.first_name?.[0]}
                  {user.last_name?.[0]}
                </div>
              )}
            </div>
            <div className="user-info">
              <h4>
                {user.first_name} {user.last_name}
              </h4>
              <p className="username">@{user.username}</p>
              {user.bio && <p className="bio">{user.bio}</p>}
              <p className="followed-date">Following since {new Date(user.followed_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={!pagination.has_prev} className="btn-pagination">
            Previous
          </button>

          <span className="page-info">
            Page {pagination.current_page} of {pagination.total_pages}
          </span>

          <button onClick={() => handlePageChange(currentPage + 1)} disabled={!pagination.has_next} className="btn-pagination">
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FollowingTab;
```

#### 4. Main User Profile Component

```jsx
// components/UserProfile/UserProfile.jsx
import React, { useState } from "react";
import FollowersTab from "./FollowersTab";
import FollowingTab from "./FollowingTab";

const UserProfile = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="user-profile">
      {/* Profile Header */}
      <div className="profile-header">{/* Profile info components */}</div>

      {/* Tabs */}
      <div className="profile-tabs">
        <div className="tab-buttons">
          <button className={activeTab === "posts" ? "active" : ""} onClick={() => setActiveTab("posts")}>
            Posts
          </button>
          <button className={activeTab === "followers" ? "active" : ""} onClick={() => setActiveTab("followers")}>
            Followers
          </button>
          <button className={activeTab === "following" ? "active" : ""} onClick={() => setActiveTab("following")}>
            Following
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "posts" && <div>Posts content</div>}
          {activeTab === "followers" && <FollowersTab userId={userId} />}
          {activeTab === "following" && <FollowingTab userId={userId} />}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
```

#### 5. CSS Styling Example

```css
/* styles/UserProfile.css */
.followers-tab,
.following-tab {
  padding: 20px;
}

.followers-list,
.following-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.follower-item,
.following-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #666;
}

.user-info h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 600;
}

.username {
  color: #666;
  font-size: 14px;
  margin: 0 0 5px 0;
}

.bio {
  color: #888;
  font-size: 14px;
  margin: 0 0 5px 0;
}

.followed-date {
  color: #aaa;
  font-size: 12px;
  margin: 0;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.btn-pagination {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-pagination:hover:not(:disabled) {
  background: #f5f5f5;
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  color: #d32f2f;
}
```

## Implementation Notes

1. **Pagination Logic**:

   - Default limit adalah 10 item per halaman
   - Maximum limit adalah 50 item per halaman
   - Page dimulai dari 1

2. **Performance Considerations**:

   - Data diurutkan berdasarkan tanggal follow (terbaru pertama)
   - Query menggunakan JOIN untuk mendapatkan informasi user profile
   - Pagination di-handle di database level untuk efisiensi

3. **Security**:

   - Semua endpoint memerlukan authentication token
   - Input validation dilakukan di service layer

4. **Frontend Best Practices**:
   - Implement loading states
   - Handle error cases
   - Cache data jika diperlukan
   - Responsive design untuk mobile

## Legacy Endpoints (Backward Compatibility)

Endpoint lama masih tersedia untuk backward compatibility:

- `GET /follower/:followerId` - Returns array of followed_id only
- `GET /followed/:followedId` - Returns array of follower_id only

Disarankan untuk menggunakan endpoint baru dengan paginasi untuk performa yang lebih baik.
