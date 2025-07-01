# LinkNest REST API Testing Guide

This guide provides comprehensive instructions for testing all API endpoints and functionality.

## Prerequisites

- LinkNest application running locally (`npm run dev`)
- Postman installed
- Valid authentication token (GitHub/Google OAuth)

## 1. Setting Up Postman

### Import Collection
1. Open Postman
2. Click "Import" 
3. Create a new collection named "LinkNest API"
4. Set base URL variable: `{{base_url}}` = `http://localhost:3000`

### Authentication Setup
1. Get authentication token:
   - Visit `http://localhost:3000`
   - Sign in with GitHub/Google
   - Open browser dev tools → Application → Cookies
   - Copy the `next-auth.session-token` value

2. In Postman collection settings:
   - Go to "Authorization" tab
   - Type: "Bearer Token"
   - Token: `your-session-token`

## 2. Testing CRUD Operations

### 2.1 Create Bookmark (POST)
```
POST {{base_url}}/api/bookmarks
Content-Type: application/json

{
  "url": "https://github.com/vercel/next.js",
  "title": "Next.js Repository",
  "description": "The React Framework for Production",
  "tags": ["react", "nextjs", "framework"],
  "isPublic": false
}
```

**Expected Response (201):**
```json
{
  "id": "clx123...",
  "url": "https://github.com/vercel/next.js",
  "title": "Next.js Repository",
  "description": "The React Framework for Production",
  "tags": ["react", "nextjs", "framework"],
  "isPublic": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2.2 Get All Bookmarks (GET)
```
GET {{base_url}}/api/bookmarks
```

**Query Parameters:**
- `limit`: Number (1-100, default: 20)
- `cursor`: String (for pagination)
- `search`: String (search in title/description)
- `tag`: String (filter by tag name)

### 2.3 Get Single Bookmark (GET)
```
GET {{base_url}}/api/bookmarks/{{bookmark_id}}
```

### 2.4 Update Bookmark (PUT)
```
PUT {{base_url}}/api/bookmarks/{{bookmark_id}}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "tags": ["updated", "tags"],
  "isPublic": true
}
```

### 2.5 Delete Bookmark (DELETE)
```
DELETE {{base_url}}/api/bookmarks/{{bookmark_id}}
```

**Expected Response (200):**
```json
{
  "message": "Bookmark deleted successfully"
}
```

## 3. Testing Tags API

### 3.1 Get All Tags
```
GET {{base_url}}/api/tags
```

**Query Parameters:**
- `limit`: Number (1-100, default: 50)
- `search`: String (search tag names)

### 3.2 Create Tag
```
POST {{base_url}}/api/tags
Content-Type: application/json

{
  "name": "javascript"
}
```

## 4. Testing Public Routes

### 4.1 Get Public Bookmarks (No Auth Required)
```
GET {{base_url}}/api/public/bookmarks
```

### 4.2 Get User's Public Bookmarks
```
GET {{base_url}}/api/public/users/{{user_id}}/bookmarks
```

## 5. Testing Rate Limiting

### 5.1 General API Rate Limit (100 requests/15 minutes)
1. Create a simple GET request to `/api/bookmarks`
2. Use Postman Runner to send 101 requests rapidly
3. After 100 requests, expect **429 Too Many Requests**

### 5.2 Bookmark Creation Rate Limit (10 requests/minute)
1. Create POST requests to `/api/bookmarks` with different URLs
2. Send 11 requests within 1 minute
3. The 11th request should return **429 Too Many Requests**

**Expected Rate Limit Response:**
```json
{
  "error": {
    "message": "Too many requests",
    "code": "RATE_LIMIT_EXCEEDED"
  }
}
```

## 6. Testing Authentication

### 6.1 Protected Routes Without Token
Remove authorization header and test:
```
GET {{base_url}}/api/bookmarks
```

**Expected Response (401):**
```json
{
  "error": {
    "message": "Unauthorized",
    "code": "UNAUTHORIZED"
  }
}
```

### 6.2 Invalid Token
Set invalid token in authorization header:
```
Authorization: Bearer invalid-token-here
GET {{base_url}}/api/bookmarks
```

## 7. Testing Input Validation

### 7.1 Invalid URL Format
```
POST {{base_url}}/api/bookmarks
Content-Type: application/json

{
  "url": "not-a-valid-url",
  "title": "Test"
}
```

**Expected Response (400):**
```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "url": ["Please enter a valid URL"]
    }
  }
}
```

### 7.2 Missing Required Fields
```
POST {{base_url}}/api/bookmarks
Content-Type: application/json

{
  "title": "Test without URL"
}
```

### 7.3 Invalid Tag Name (Too Long)
```
POST {{base_url}}/api/tags
Content-Type: application/json

{
  "name": "this-is-a-very-long-tag-name-that-exceeds-fifty-characters-limit"
}
```

## 8. Testing Metadata Fetching

### 8.1 URL with Rich Metadata
```
POST {{base_url}}/api/bookmarks
Content-Type: application/json

{
  "url": "https://github.com/microsoft/vscode"
}
```

**Verify Response Includes:**
- Auto-fetched `title`
- Auto-fetched `description`
- `ogImage` URL
- `favicon` URL

### 8.2 URL with Limited Metadata
```
POST {{base_url}}/api/bookmarks
Content-Type: application/json

{
  "url": "https://example.com"
}
```

### 8.3 Invalid/Unreachable URL
```
POST {{base_url}}/api/bookmarks
Content-Type: application/json

{
  "url": "https://this-domain-does-not-exist-12345.com"
}
```

## 9. Testing Pagination

### 9.1 First Page
```
GET {{base_url}}/api/bookmarks?limit=5
```

**Response includes:**
- `data`: Array of bookmarks
- `pagination.hasMore`: Boolean
- `pagination.nextCursor`: String (if hasMore is true)

### 9.2 Next Page
```
GET {{base_url}}/api/bookmarks?limit=5&cursor={{nextCursor}}
```

### 9.3 Large Limit (Should be Capped)
```
GET {{base_url}}/api/bookmarks?limit=999
```

**Verify:** Returns maximum 100 items

## 10. Testing Search and Filtering

### 10.1 Search by Title/Description
```
GET {{base_url}}/api/bookmarks?search=react
```

### 10.2 Filter by Tag
```
GET {{base_url}}/api/bookmarks?tag=javascript
```

### 10.3 Combined Search and Filter
```
GET {{base_url}}/api/bookmarks?search=tutorial&tag=react
```

### 10.4 Case Insensitive Search
```
GET {{base_url}}/api/bookmarks?search=REACT
```

## 11. Testing Error Scenarios

### 11.1 Duplicate URL
1. Create a bookmark with a specific URL
2. Try to create another bookmark with the same URL
3. **Expected:** 409 Conflict error

### 11.2 Non-existent Bookmark ID
```
GET {{base_url}}/api/bookmarks/non-existent-id
```

**Expected Response (404):**
```json
{
  "error": {
    "message": "Bookmark not found",
    "code": "NOT_FOUND"
  }
}
```

### 11.3 Accessing Another User's Bookmark
1. Create a bookmark
2. Use a different user's token
3. Try to access the bookmark
4. **Expected:** 404 Not Found (for privacy)

## 12. Testing Public Route Access

### 12.1 Public Bookmarks Without Auth
Remove all authorization headers:
```
GET {{base_url}}/api/public/bookmarks
```

**Expected:** 200 OK with public bookmarks only

### 12.2 Private Bookmarks Not Visible
1. Create a bookmark with `isPublic: false`
2. Query public endpoints
3. **Verify:** Private bookmark is not returned

## 13. Performance Testing

### 13.1 Large Dataset Query
```
GET {{base_url}}/api/bookmarks?limit=100
```

**Verify:** Response time < 500ms

### 13.2 Search Performance
```
GET {{base_url}}/api/bookmarks?search=common-term&limit=50
```

## Test Checklist

- [ ] All CRUD operations work correctly
- [ ] Rate limiting blocks excessive requests
- [ ] Authentication required on protected routes
- [ ] Input validation rejects invalid data
- [ ] Metadata fetching works for various URLs
- [ ] Pagination returns correct data structure
- [ ] Search and filtering return expected results
- [ ] Public routes accessible without authentication
- [ ] Error responses follow consistent format
- [ ] Duplicate URLs are properly handled
- [ ] Cross-user access is properly restricted

## Automated Testing Script

For automated testing, you can use this Newman command:
```bash
newman run LinkNest-API.postman_collection.json \
  --environment LinkNest-Local.postman_environment.json \
  --reporters cli,html \
  --reporter-html-export test-results.html
```