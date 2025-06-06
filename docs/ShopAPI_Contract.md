# Shop Module API Contract & Specification

## Overview
This document defines the API contract for the Shop Module of the Naga Venture app. It serves as the formal specification for backend developers to implement the required endpoints that match our TypeScript type definitions and frontend requirements.

## Base URL
```
Production: https://api.nagaventure.com/v1
Development: https://api-dev.nagaventure.com/v1
Local: http://localhost:3000/api/v1
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <jwt_token>
```

## Data Types Contract

### Core Shop Data Structure
The API must return data that matches our `ShopData` interface (see `types/shop.ts`). Key requirements:
- All IDs must be strings
- Images must be absolute URLs
- Coordinates must be decimal degrees (latitude/longitude)
- Ratings must be numbers (0-5 scale)
- Dates must be ISO 8601 format

## API Endpoints

### 1. Get All Shops
**Endpoint:** `GET /shops`
**Purpose:** Retrieve paginated list of all shops
**Hook:** `useShops()`

#### Request Parameters
```typescript
interface GetShopsParams {
  page?: number;           // Default: 1
  limit?: number;          // Default: 20, Max: 100
  category?: string;       // Filter by category
  subcategory?: string;    // Filter by subcategory
  location?: {             // Filter by proximity
    latitude: number;
    longitude: number;
    radiusKm?: number;     // Default: 10km
  };
  sortBy?: 'name' | 'rating' | 'distance' | 'newest';
  sortOrder?: 'asc' | 'desc';
  minRating?: number;      // Filter by minimum rating
  isOpen?: boolean;        // Filter by currently open shops
}
```

#### Response
```typescript
interface GetShopsResponse {
  success: boolean;
  data: {
    shops: ShopData[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  meta?: {
    requestId: string;
    timestamp: string;
  };
}
```

### 2. Get Shop by ID
**Endpoint:** `GET /shops/:id`
**Purpose:** Retrieve detailed information for a specific shop
**Hook:** `useShop(shopId)`

#### Parameters
- `id` (path): Shop ID (string, required)

#### Response
```typescript
interface GetShopResponse {
  success: boolean;
  data: ShopData | null;
  meta?: {
    requestId: string;
    timestamp: string;
  };
}
```

#### Error Cases
- `404` - Shop not found
- `403` - Shop is private/restricted

### 3. Get Featured Shops
**Endpoint:** `GET /shops/featured`
**Purpose:** Retrieve curated list of featured shops
**Hook:** `useFeaturedShops()`

#### Request Parameters
```typescript
interface GetFeaturedShopsParams {
  limit?: number;          // Default: 10, Max: 50
  location?: {             // Prioritize nearby featured shops
    latitude: number;
    longitude: number;
  };
}
```

#### Response
```typescript
interface GetFeaturedShopsResponse {
  success: boolean;
  data: ShopData[];
  meta?: {
    requestId: string;
    timestamp: string;
    featuredReason?: string; // Why these shops are featured
  };
}
```

### 4. Get Recommended Shops
**Endpoint:** `GET /shops/recommended`
**Purpose:** Get personalized shop recommendations
**Hook:** `useRecommendedShops()`

#### Request Parameters
```typescript
interface GetRecommendedShopsParams {
  limit?: number;          // Default: 20, Max: 50
  userId?: string;         // For personalized recommendations
  location?: {
    latitude: number;
    longitude: number;
  };
  basedOn?: 'rating' | 'popularity' | 'similarity' | 'location';
}
```

#### Response
```typescript
interface GetRecommendedShopsResponse {
  success: boolean;
  data: ShopData[];
  meta?: {
    requestId: string;
    timestamp: string;
    recommendationEngine: string;
    confidence?: number;
  };
}
```

### 5. Search Shops
**Endpoint:** `GET /shops/search`
**Purpose:** Full-text search across shops
**Hook:** `useSearchShops(query)`

#### Request Parameters
```typescript
interface SearchShopsParams {
  q: string;               // Search query (required)
  limit?: number;          // Default: 20, Max: 100
  page?: number;           // Default: 1
  filters?: {
    category?: string[];
    rating?: {
      min?: number;
      max?: number;
    };
    priceRange?: string[];
    location?: {
      latitude: number;
      longitude: number;
      radiusKm?: number;
    };
    amenities?: string[];
    isOpen?: boolean;
  };
  sortBy?: 'relevance' | 'rating' | 'distance' | 'name';
}
```

#### Response
```typescript
interface SearchShopsResponse {
  success: boolean;
  data: {
    shops: ShopData[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    searchMeta: {
      query: string;
      resultCount: number;
      searchTime: number;    // milliseconds
      suggestions?: string[]; // Alternative search terms
    };
  };
}
```

### 6. Toggle Shop Favorite
**Endpoint:** `POST /shops/:id/favorite`
**Purpose:** Add/remove shop from user's favorites
**Hook:** `useToggleFavorite()`

#### Parameters
- `id` (path): Shop ID (string, required)

#### Request Body
```typescript
interface ToggleFavoriteRequest {
  action: 'add' | 'remove' | 'toggle'; // Default: 'toggle'
}
```

#### Response
```typescript
interface ToggleFavoriteResponse {
  success: boolean;
  data: {
    shopId: string;
    isFavorited: boolean;
    favoriteCount?: number; // Optional: total favorites for this shop
  };
  meta?: {
    requestId: string;
    timestamp: string;
  };
}
```

### 7. Get Shop Categories
**Endpoint:** `GET /shops/categories`
**Purpose:** Retrieve hierarchical list of shop categories

#### Response
```typescript
interface GetCategoriesResponse {
  success: boolean;
  data: {
    categories: ShopCategory[];
    mainCategories: MainCategory[];
  };
}
```

### 8. Get Shops by Category
**Endpoint:** `GET /shops/categories/:categoryId`
**Purpose:** Get shops filtered by specific category

#### Parameters
- `categoryId` (path): Category ID (string, required)
- Standard pagination and sorting parameters

## Error Handling

### Standard Error Response
```typescript
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;           // Machine-readable error code
    message: string;        // Human-readable error message
    details?: any;          // Additional error context
    timestamp: string;
    requestId: string;
  };
}
```

### Common Error Codes
- `SHOP_NOT_FOUND` - Shop with given ID does not exist
- `INVALID_PARAMETERS` - Request parameters are invalid
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Access denied
- `RATE_LIMITED` - Too many requests
- `INTERNAL_ERROR` - Server error
- `SEARCH_FAILED` - Search service error

## Performance Requirements

### Response Times (95th percentile)
- Get All Shops: < 500ms
- Get Shop by ID: < 200ms
- Search: < 800ms
- Toggle Favorite: < 300ms

### Caching Strategy
- Shop details: Cache for 15 minutes
- Search results: Cache for 5 minutes
- Categories: Cache for 1 hour
- Featured shops: Cache for 30 minutes

### Rate Limiting
- Authenticated users: 1000 requests/hour
- Search endpoint: 60 requests/minute
- Favorite toggle: 100 requests/hour

## Data Validation

### Shop ID Format
- Must be alphanumeric string
- Length: 6-50 characters
- Pattern: `^[a-zA-Z0-9_-]+$`

### Search Query
- Minimum length: 2 characters
- Maximum length: 200 characters
- Trim whitespace
- Sanitize HTML/SQL injection

### Coordinates
- Latitude: -90 to 90
- Longitude: -180 to 180
- Precision: Up to 6 decimal places

## Implementation Notes

### Database Considerations
1. **Indexing Requirements:**
   - Primary key on shop ID
   - Compound index on (category, rating)
   - Geospatial index on location
   - Full-text index on (name, description, tags)

2. **Full-Text Search:**
   - Implement search across: name, description, category, tags
   - Support partial matches and typo tolerance
   - Implement search result ranking

3. **Favorites System:**
   - User-Shop relationship table
   - Batch operations for optimistic UI support

### Real-time Features (Future)
- WebSocket endpoint for real-time shop updates
- Push notifications for favorite shop promotions
- Live shop status updates (open/closed)

## Testing Requirements

### Unit Tests
- All endpoint handlers
- Request validation
- Response formatting
- Error handling

### Integration Tests
- Database queries
- Search functionality
- Caching behavior
- Rate limiting

### Load Tests
- 1000 concurrent users
- Search under load
- Database performance

## Deployment Checklist

### Environment Variables
```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
SEARCH_SERVICE_URL=...
CDN_BASE_URL=...
```

### Monitoring
- API response times
- Error rates by endpoint
- Search query performance
- Cache hit rates
- Database connection pool

This API contract ensures that our frontend TypeScript types and backend implementation remain in perfect sync, enabling seamless development and maintenance.
