# User Follow Pagination - Quick Reference

## 🚀 New Endpoints Added

### Get Followers (Paginated)

```
GET /api/user-follows/:userId/followers?page=1&limit=10
```

### Get Following (Paginated)

```
GET /api/user-follows/:userId/following?page=1&limit=10
```

## 📊 Response Format

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

## 🔧 Frontend Implementation

### Service Function

```javascript
export const getFollowers = async (userId, page = 1, limit = 10) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(`/api/user-follows/${userId}/followers`, {
    params: { page, limit },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
```

### React Hook

```javascript
const useFollowers = (userId) => {
  const [followers, setFollowers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchFollowers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getFollowers(userId, page);
      setFollowers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { followers, pagination, loading, fetchFollowers };
};
```

## 📝 Files Modified/Created

### Backend Files:

- `routes/userFollowRoutes.js` - Added new paginated endpoints
- `controllers/UserFollowController.js` - Added pagination methods
- `services/UserFollowService.js` - Added pagination business logic
- `repositories/UserFollowRepository.js` - Added database queries with JOIN
- `models/UserFollow.js` - Added additional relations

### Documentation:

- `docs/user-follow-pagination-api.md` - Complete API documentation
- `test-follow-pagination-api.js` - Test script for API endpoints

## 🧪 Testing

Run test script:

```bash
node test-follow-pagination-api.js
```

Remember to update `TEST_USER_ID` and `TEST_TOKEN` in the test file!

## ⚡ Key Features

- ✅ Pagination with configurable page size (max 50)
- ✅ Full user profile data included (name, username, avatar, bio)
- ✅ Sorted by follow date (newest first)
- ✅ Proper error handling and validation
- ✅ Backward compatibility with existing endpoints
- ✅ Performance optimized with database-level pagination
