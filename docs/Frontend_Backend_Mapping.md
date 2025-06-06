# Frontend-Backend API Mapping

## Overview
This document maps our React Native frontend hooks to their corresponding backend API endpoints, making it clear how data flows through the application.

## Hook-to-Endpoint Mapping

### 1. useShops()
```typescript
// Frontend Hook
const { data: shops, isLoading, error } = useShops();

// Maps to API Endpoint
GET /shops
```
**Purpose:** Fetch all shops with pagination
**Current Implementation:** Fetches from `ShopData.js` mock data
**Future Implementation:** HTTP request to backend API

### 2. useShop(shopId)
```typescript
// Frontend Hook
const { data: shop, isLoading, error } = useShop(shopId);

// Maps to API Endpoint
GET /shops/:id
```
**Purpose:** Fetch detailed information for a specific shop
**Current Implementation:** Lookup in `shopsData` object by ID
**Future Implementation:** HTTP request with shop ID parameter

### 3. useFeaturedShops()
```typescript
// Frontend Hook
const { data: featuredShops, isLoading, error } = useFeaturedShops();

// Maps to API Endpoint
GET /shops/featured
```
**Purpose:** Fetch curated featured shops
**Current Implementation:** Returns static `featuredShops` array
**Future Implementation:** Dynamic featured shops from backend

### 4. useRecommendedShops()
```typescript
// Frontend Hook
const { data: recommendedShops, isLoading, error } = useRecommendedShops();

// Maps to API Endpoint
GET /shops/recommended
```
**Purpose:** Fetch personalized shop recommendations
**Current Implementation:** Filters shops with rating >= 4.5
**Future Implementation:** AI-powered recommendations from backend

### 5. useSearchShops(query)
```typescript
// Frontend Hook
const { data: searchResults, isLoading, error } = useSearchShops(query);

// Maps to API Endpoint
GET /shops/search?q=${query}
```
**Purpose:** Search shops with debounced input
**Current Implementation:** Client-side filtering of mock data
**Future Implementation:** Full-text search via backend API

### 6. useToggleFavorite()
```typescript
// Frontend Hook
const toggleFavorite = useToggleFavorite();
await toggleFavorite.mutateAsync(shopId);

// Maps to API Endpoint
POST /shops/:id/favorite
```
**Purpose:** Add/remove shop from user favorites
**Current Implementation:** Direct mutation of mock data object
**Future Implementation:** HTTP POST with optimistic UI updates

## Data Flow Architecture

### Current (Mock Data)
```
Component → Hook → Mock Function → Local Data → State Update
```

### Future (Real API)
```
Component → Hook → TanStack Query → HTTP Client → Backend API → Database
```

## Migration Strategy

### Phase 1: API Client Setup
1. Install HTTP client (axios/fetch)
2. Create API service layer
3. Add environment configuration
4. Implement error handling

### Phase 2: Endpoint Migration
1. **Start with Read Operations:**
   - `useShops()` → `GET /shops`
   - `useShop(id)` → `GET /shops/:id`
   - `useFeaturedShops()` → `GET /shops/featured`

2. **Add Search:**
   - `useSearchShops()` → `GET /shops/search`

3. **Add Mutations:**
   - `useToggleFavorite()` → `POST /shops/:id/favorite`

### Phase 3: Advanced Features
1. Real-time updates
2. Offline support
3. Background sync

## API Service Layer Structure

```typescript
// services/api/shopService.ts
class ShopService {
  private baseURL: string;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async getAllShops(params?: GetShopsParams): Promise<ShopData[]> {
    // Replace fetchAllShops()
  }

  async getShopById(id: string): Promise<ShopData | null> {
    // Replace fetchShopById()
  }

  async getFeaturedShops(): Promise<ShopData[]> {
    // Replace fetchFeaturedShops()
  }

  async getRecommendedShops(): Promise<ShopData[]> {
    // Replace fetchRecommendedShops()
  }

  async searchShops(query: string): Promise<ShopData[]> {
    // Replace searchShops()
  }

  async toggleFavorite(shopId: string): Promise<ToggleFavoriteResponse> {
    // Replace direct data mutation
  }
}
```

## Configuration Management

### Environment Variables
```typescript
// config/api.ts
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};
```

### HTTP Client Setup
```typescript
// services/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Error Handling Strategy

### Hook Error Handling
```typescript
export const useShops = () => {
  return useQuery<ShopData[], ApiError>({
    queryKey: ['shops'],
    queryFn: shopService.getAllShops,
    retry: (failureCount, error) => {
      // Retry logic based on error type
      if (error.code === 'NETWORK_ERROR') return failureCount < 3;
      if (error.code === 'RATE_LIMITED') return false;
      return failureCount < 1;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
```

### Global Error Boundary
```typescript
// components/ErrorBoundary.tsx
class ApiErrorBoundary extends ErrorBoundary {
  handleApiError(error: ApiError) {
    switch (error.code) {
      case 'UNAUTHORIZED':
        // Redirect to login
        break;
      case 'NETWORK_ERROR':
        // Show offline message
        break;
      default:
        // Show generic error
    }
  }
}
```

## Testing Strategy

### Mock Service for Testing
```typescript
// services/api/__mocks__/shopService.ts
export const mockShopService = {
  getAllShops: jest.fn().mockResolvedValue(mockShopsData),
  getShopById: jest.fn().mockResolvedValue(mockShopData),
  // ... other methods
};
```

### Hook Testing
```typescript
// hooks/__tests__/useShops.test.ts
import { renderHook } from '@testing-library/react-hooks';
import { useShops } from '../useShops';

test('useShops returns shop data', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useShops());
  
  await waitForNextUpdate();
  
  expect(result.current.data).toHaveLength(expect.any(Number));
  expect(result.current.isLoading).toBe(false);
});
```

## Performance Considerations

### Query Optimization
```typescript
// Prefetch related data
const queryClient = useQueryClient();

// Prefetch shop details when hovering over shop card
const prefetchShop = (shopId: string) => {
  queryClient.prefetchQuery({
    queryKey: ['shop', shopId],
    queryFn: () => shopService.getShopById(shopId),
    staleTime: 5 * 60 * 1000,
  });
};
```

### Background Refetching
```typescript
// Keep data fresh in background
export const useShops = () => {
  return useQuery({
    queryKey: ['shops'],
    queryFn: shopService.getAllShops,
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    refetchIntervalInBackground: false,
  });
};
```

This mapping ensures a smooth transition from mock data to real API integration while maintaining all current functionality and user experience.
