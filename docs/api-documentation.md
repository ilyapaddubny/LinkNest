# LinkNest API Documentation

## Overview

The LinkNest API provides endpoints for managing bookmarks, tags, and public bookmark collections. All authenticated endpoints require a valid session.

## Base URL

```
http://localhost:3000/api (development)
https://your-domain.com/api (production)
```

## Authentication

All protected endpoints require authentication via NextAuth.js session cookies.

## Rate Limiting

- General API endpoints: 100 requests per 15 minutes
- Bookmark creation: 10 requests per minute
- Authentication: 5 requests per minute

Rate limit headers:

- `X-RateLimit-Limit`: Request limit per window
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Time when the rate limit resets (Unix timestamp)

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

Common error codes:

- `VALIDATION_ERROR` (400): Invalid input data
- `UNAUTHORIZED` (401): Authentication required
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Resource already exists
- `RATE_LIMIT_EXCEEDED` (429): Too many requests

## Endpoints

### Bookmarks

#### GET /api/bookmarks

Get user's bookmarks with optional filtering and pagination.

**Query Parameters:**

- `search` (string, optional): Search bookmarks by title, description, or URL
- `tag` (string, optional): Filter by tag name
- `limit` (number, optional): Number of bookmarks to return (1-100, default: 20)
- `cursor` (string, optional): Pagination cursor from previous response
- `isPublic` (boolean, optional): Filter by public/private status

**Response:**

```json
{
  "data": [
    {
      "id": "bookmark_id",
      "url": "https://example.com",
      "title": "Example Site",
      "description": "An example website",
      "image": "https://example.com/og-image.jpg",
      "favicon": "https://example.com/favicon.ico",
      "isPublic": false,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "tags": ["web", "example"]
    }
  ],
  "pagination": {
    "hasMore": true,
    "nextCursor": "next_cursor_string"
  }
}
```

#### POST /api/bookmarks

Create a new bookmark.

**Request Body:**

```json
{
  "url": "https://example.com",
  "title": "Example Site (optional)",
  "description": "Description (optional)",
  "tags": ["tag1", "tag2"],
  "isPublic": false
}
```

**Response:** Created bookmark object (201)

#### GET /api/bookmarks/[id]

Get a specific bookmark by ID.

**Response:** Bookmark object

#### PUT /api/bookmarks/[id]

Update a bookmark.

**Request Body:** Same as POST but all fields optional

**Response:** Updated bookmark object

#### DELETE /api/bookmarks/[id]

Soft delete a bookmark.

**Response:**

```json
{
  "message": "Bookmark deleted successfully"
}
```

### Tags

#### GET /api/tags

Get user's tags with bookmark counts.

**Query Parameters:**

- `limit` (number, optional): Number of tags to return (1-100, default: 50)
- `search` (string, optional): Search tags by name

**Response:**

```json
[
  {
    "id": "tag_id",
    "name": "web",
    "count": 5,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### GET /api/tags/[name]/bookmarks

Get bookmarks with a specific tag.

**Query Parameters:** Same as GET /api/bookmarks

**Response:**

```json
{
  "data": [...bookmarks],
  "pagination": {...},
  "tag": {
    "name": "web",
    "count": 5
  }
}
```

### Public Routes

#### GET /api/public/[username]

Get public bookmarks for a user.

**Parameters:**

- `username` (string): User's email/username

**Query Parameters:** Same as GET /api/bookmarks (excluding isPublic)

**Response:**

```json
{
  "data": [...public_bookmarks],
  "pagination": {...},
  "user": {
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

## Server Actions

Server actions are used for mutations in Next.js applications.

### createBookmark(data)

Create a new bookmark using server action.

**Parameters:**

- `data`: CreateBookmarkInput object

**Returns:**

```typescript
{
  success: boolean;
  data?: Bookmark;
  error?: string;
  details?: unknown;
}
```

### updateBookmark(id, data)

Update a bookmark using server action.

### deleteBookmark(id)

Delete a bookmark using server action.

## Data Types

### Bookmark

```typescript
{
  id: string;
  url: string;
  title: string;
  description?: string;
  image?: string;
  favicon?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}
```

### Tag

```typescript
{
  id: string;
  name: string;
  count: number;
  createdAt: Date;
}
```

## Examples

### Create a bookmark with cURL

```bash
curl -X POST http://localhost:3000/api/bookmarks \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your-session-token" \
  -d '{
    "url": "https://example.com",
    "title": "Example Site",
    "tags": ["web", "example"],
    "isPublic": false
  }'
```

### Search bookmarks

```bash
curl "http://localhost:3000/api/bookmarks?search=example&limit=10" \
  -H "Cookie: next-auth.session-token=your-session-token"
```

### Get public bookmarks

```bash
curl "http://localhost:3000/api/public/user@example.com?limit=10"
```
