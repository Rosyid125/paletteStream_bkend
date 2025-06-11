# Post Reporting System Documentation

## Overview

The Post Reporting System allows users to report inappropriate or problematic posts. Admins can view, manage, and resolve these reports through a comprehensive dashboard.

## Database Schema

### post_reports Table

```sql
CREATE TABLE post_reports (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL REFERENCES user_posts(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason ENUM(...) NOT NULL,
  additional_info TEXT NULL,
  status ENUM('pending', 'reviewed', 'resolved', 'dismissed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_post_report (post_id, user_id)
);
```

## API Endpoints

### User Endpoints

#### Get Report Reasons

```
GET /api/reports/reasons
Authorization: Bearer token
```

Returns available report reasons for frontend dropdown.

#### Report a Post

```
POST /api/reports/posts/:postId
Authorization: Bearer token
Content-Type: application/json

Body:
{
  "reason": "inappropriate_content",
  "additional_info": "Optional detailed explanation"
}
```

**Rate Limiting:** 5 reports per hour per user

**Validation:**

- Valid reason required
- Cannot report own posts
- Cannot report same post twice
- Additional info max 1000 characters

### Admin Endpoints

#### Get Reported Posts

```
GET /api/admin/posts/reported?page=1&limit=20
Authorization: Bearer token (Admin only)
```

Returns posts that have at least one report, ordered by report count.

#### Get Reports for Specific Post

```
GET /api/admin/posts/:postId/reports
Authorization: Bearer token (Admin only)
```

Returns all reports for a specific post with reporter details.

#### Get All Reports

```
GET /api/admin/reports
Authorization: Bearer token (Admin only)
```

Returns all reports with post and reporter information.

#### Get Report Statistics

```
GET /api/admin/reports/statistics
Authorization: Bearer token (Admin only)
```

Returns report statistics for dashboard:

- Status breakdown (pending, reviewed, resolved, dismissed)
- Reason breakdown
- Total reports count

#### Update Report Status

```
PUT /api/admin/reports/:reportId/status
Authorization: Bearer token (Admin only)
Content-Type: application/json

Body:
{
  "status": "resolved"
}
```

#### Delete Report

```
DELETE /api/admin/reports/:reportId
Authorization: Bearer token (Admin only)
```

## Report Reasons

| Value                   | Label                 |
| ----------------------- | --------------------- |
| `inappropriate_content` | Inappropriate Content |
| `spam`                  | Spam                  |
| `harassment`            | Harassment            |
| `copyright_violation`   | Copyright Violation   |
| `fake_content`          | Fake Content          |
| `violence`              | Violence              |
| `adult_content`         | Adult Content         |
| `hate_speech`           | Hate Speech           |
| `other`                 | Other                 |

## Report Statuses

| Status      | Description                           |
| ----------- | ------------------------------------- |
| `pending`   | Newly created report, awaiting review |
| `reviewed`  | Report has been reviewed by admin     |
| `resolved`  | Action taken, report resolved         |
| `dismissed` | Report rejected/dismissed as invalid  |

## Features

### Security & Validation

- **Rate Limiting**: Users limited to 5 reports per hour
- **Input Validation**: Comprehensive validation of all input data
- **Duplicate Prevention**: Users cannot report the same post twice
- **Self-Report Prevention**: Users cannot report their own posts

### Notifications

- Post owners receive notifications when their posts are reported
- Notification type: `post_reported`

### Admin Dashboard Integration

- Report counts displayed in post listings
- Dashboard statistics include report metrics
- Comprehensive report management interface

### Performance Optimizations

- Database indexes on frequently queried columns
- Efficient queries using joins for report counts
- Pagination support for large datasets

## Architecture

The system follows the MVC-SR (Model-View-Controller-Service-Repository) pattern:

### Models

- **PostReport**: Objection.js model with relations to User and UserPost

### Controllers

- **PostReportController**: Handles user report submissions
- **AdminController**: Extended with report management methods

### Services

- **PostReportService**: Business logic for report operations
- **NotificationService**: Extended to handle report notifications

### Repositories

- **PostReportRepository**: Database operations for reports

### Middleware

- **reportRateLimit**: Rate limiting for report submissions
- **reportValidation**: Input validation for reports

## Error Handling

All endpoints include comprehensive error handling:

- Input validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Rate limiting errors (429)
- Server errors (500)

## Testing

Recommended test cases:

1. Report creation with valid data
2. Rate limiting enforcement
3. Duplicate report prevention
4. Self-report prevention
5. Admin report management
6. Notification creation
7. Statistics calculation

## Migration Command

To create the post_reports table:

```bash
npx knex migrate:make create_post_reports
```

Then run the migration:

```bash
npx knex migrate:latest
```
