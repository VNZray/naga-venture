# API Migration Guide: From Mock Data to Real Backend

## Overview
This guide provides step-by-step instructions for migrating the Shop Module from mock data to a real backend API while maintaining all current functionality and user experience.

## Pre-Migration Checklist

### 1. Type Safety Verification
- [ ] Verify `types/shop.ts` matches backend API response format
- [ ] Ensure all hooks return correct TypeScript types
- [ ] Test error handling with proper error types

### 2. Current State Assessment
- [ ] All skeleton loaders working correctly
- [ ] Optimistic UI functioning for favorites
- [ ] Search with debouncing operational
- [ ] Navigation centralized through ShopNavigator
- [ ] Error boundaries implemented

### 3. Backend API Ready
- [ ] API endpoints documented and implemented
- [ ] Authentication system in place
- [ ] Rate limiting configured
- [ ] CORS settings for mobile app
- [ ] SSL certificate installed

## Migration Steps

### Step 1: API Client Infrastructure

#### Install HTTP Client
```bash
cd "c:\Users\Hans Candor\Documents\capstone-NV\naga-venture"
npm install axios
npm install @types/axios --save-dev
```

#### Create API Configuration
```typescript
// config/api.ts
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://localhost:3000/api/v1'
    : 'https://api.nagaventure.com/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

export const ENDPOINTS = {
  SHOPS: '/shops',
  SHOP_BY_ID: '/shops/:id',
  FEATURED_SHOPS: '/shops/featured',
  RECOMMENDED_SHOPS: '/shops/recommended',
  SEARCH_SHOPS: '/shops/search',
  TOGGLE_FAVORITE: '/shops/:id/favorite',
  CATEGORIES: '/shops/categories',
} as const;
```

#### Create HTTP Client
```typescript
// services/api/client.ts
import axios, { AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from '@/config/api';

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = getAuthToken(); // Implement this function
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error(`API Error: ${error.response?.status} ${error.config?.url}`);
    
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      handleUnauthorized();
    }
    
    return Promise.reject(error);
  }
);

// Helper functions
function getAuthToken(): string | null {
  // Implement token retrieval logic
  return null;
}

function handleUnauthorized(): void {
  // Implement logout/redirect logic
}
```

### Step 2: Create API Service Layer

#### Shop Service Implementation
```typescript
// services/api/shopService.ts
import { apiClient } from './client';
import { ENDPOINTS } from '@/config/api';
import type { ShopData } from '@/types/shop';

export class ShopService {
  // Replace fetchAllShops
  static async getAllShops(params?: {
    page?: number;
    limit?: number;
    category?: string;
  }): Promise<ShopData[]> {
    try {
      const response = await apiClient.get(ENDPOINTS.SHOPS, { params });
      return response.data.data.shops;
    } catch (error) {
      console.error('Error fetching all shops:', error);
      throw this.handleApiError(error);
    }
  }

  // Replace fetchShopById
  static async getShopById(id: string): Promise<ShopData | null> {
    try {
      const response = await apiClient.get(
        ENDPOINTS.SHOP_BY_ID.replace(':id', id)
      );
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error(`Error fetching shop ${id}:`, error);
      throw this.handleApiError(error);
    }
  }

  // Replace fetchFeaturedShops
  static async getFeaturedShops(): Promise<ShopData[]> {
    try {
      const response = await apiClient.get(ENDPOINTS.FEATURED_SHOPS);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching featured shops:', error);
      throw this.handleApiError(error);
    }
  }

  // Replace fetchRecommendedShops
  static async getRecommendedShops(params?: {
    limit?: number;
    location?: { latitude: number; longitude: number };
  }): Promise<ShopData[]> {
    try {
      const response = await apiClient.get(ENDPOINTS.RECOMMENDED_SHOPS, { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching recommended shops:', error);
      throw this.handleApiError(error);
    }
  }

  // Replace searchShops
  static async searchShops(query: string): Promise<ShopData[]> {
    try {
      const response = await apiClient.get(ENDPOINTS.SEARCH_SHOPS, {
        params: { q: query }
      });
      return response.data.data.shops;
    } catch (error) {
      console.error(`Error searching shops with query "${query}":`, error);
      throw this.handleApiError(error);
    }
  }

  // Replace direct data mutation
  static async toggleFavorite(shopId: string): Promise<{
    shopId: string;
    isFavorited: boolean;
  }> {
    try {
      const response = await apiClient.post(
        ENDPOINTS.TOGGLE_FAVORITE.replace(':id', shopId)
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error toggling favorite for shop ${shopId}:`, error);
      throw this.handleApiError(error);
    }
  }

  private static handleApiError(error: any): Error {
    if (error.response?.data?.error) {
      return new Error(error.response.data.error.message);
    }
    if (error.message) {
      return new Error(error.message);
    }
    return new Error('An unexpected error occurred');
  }
}
```

### Step 3: Update Hooks to Use API Service

#### Update useShops.ts (Gradual Migration)
```typescript
// hooks/useShops.ts - Updated version
import { ShopService } from '@/services/api/shopService';
import type { ShopData } from '@/types/shop';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Feature flag for gradual migration
const USE_REAL_API = process.env.EXPO_PUBLIC_USE_REAL_API === 'true';

// Updated hooks
export const useShops = () => {
  return useQuery<ShopData[], Error>({
    queryKey: ['shops'],
    queryFn: USE_REAL_API ? ShopService.getAllShops : fetchAllShops,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useShop = (shopId: string) => {
  return useQuery<ShopData | null, Error>({
    queryKey: ['shop', shopId],
    queryFn: USE_REAL_API 
      ? () => ShopService.getShopById(shopId)
      : () => fetchShopById(shopId),
    enabled: !!shopId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useFeaturedShops = () => {
  return useQuery<ShopData[], Error>({
    queryKey: ['shops', 'featured'],
    queryFn: USE_REAL_API ? ShopService.getFeaturedShops : fetchFeaturedShops,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useRecommendedShops = () => {
  return useQuery<ShopData[], Error>({
    queryKey: ['shops', 'recommended'],
    queryFn: USE_REAL_API ? ShopService.getRecommendedShops : fetchRecommendedShops,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSearchShops = (query: string) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = debounce((searchQuery: string) => {
      setDebouncedQuery(searchQuery);
    }, 300);

    handler(query);
    return () => handler.cancel();
  }, [query]);

  return useQuery<ShopData[], Error>({
    queryKey: ['shops', 'search', debouncedQuery],
    queryFn: USE_REAL_API 
      ? () => ShopService.searchShops(debouncedQuery)
      : () => searchShops(debouncedQuery),
    enabled: !!debouncedQuery.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

// Updated mutation with real API
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: USE_REAL_API 
      ? ShopService.toggleFavorite
      : async (shopId: string) => {
          // Keep existing mock implementation as fallback
          await new Promise((resolve) => setTimeout(resolve, 500));
          const shop = shopsData[shopId as unknown as keyof typeof shopsData];
          if (shop) {
            shop.isFavorited = !shop.isFavorited;
          }
          return shop;
        },

    // Keep existing optimistic update logic
    onMutate: async (shopId) => {
      // ... existing optimistic update code ...
    },

    onError: (err, shopId, context) => {
      // ... existing error rollback code ...
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
    },
  });
};
```

### Step 4: Environment Configuration

#### Add Environment Variables
```bash
# .env.local
EXPO_PUBLIC_USE_REAL_API=false
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
EXPO_PUBLIC_API_URL_PROD=https://api.nagaventure.com/v1
```

#### Update app.config.js
```javascript
// app.config.js
export default {
  expo: {
    // ... existing config
    extra: {
      useRealApi: process.env.EXPO_PUBLIC_USE_REAL_API === 'true',
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      apiUrlProd: process.env.EXPO_PUBLIC_API_URL_PROD,
    },
  },
};
```

### Step 5: Testing Strategy

#### Create Test Environment
```typescript
// __tests__/setup/testApi.ts
import { ShopService } from '@/services/api/shopService';
import { apiClient } from '@/services/api/client';
import MockAdapter from 'axios-mock-adapter';

export const mockApi = new MockAdapter(apiClient);

export const setupMockApi = () => {
  // Mock successful responses
  mockApi.onGet('/shops').reply(200, {
    success: true,
    data: { shops: mockShopsData }
  });

  mockApi.onGet(/\/shops\/[\w-]+$/).reply((config) => {
    const shopId = config.url?.split('/').pop();
    const shop = mockShopsData.find(s => s.id === shopId);
    return shop 
      ? [200, { success: true, data: shop }]
      : [404, { success: false, error: { message: 'Shop not found' } }];
  });

  // Mock other endpoints...
};
```

#### Component Testing
```typescript
// __tests__/components/FeaturedSection.test.tsx
import { render, waitFor } from '@testing-library/react-native';
import { FeaturedSection } from '@/components/shops/sections/FeaturedSection';
import { setupMockApi } from '../setup/testApi';

beforeEach(() => {
  setupMockApi();
});

test('loads featured shops from API', async () => {
  const { getByText } = render(<FeaturedSection />);
  
  await waitFor(() => {
    expect(getByText('Featured Shop Name')).toBeTruthy();
  });
});
```

### Step 6: Gradual Migration Process

#### Phase 1: Read-Only Operations (Week 1)
1. Enable API for development environment
2. Test `useShops()`, `useShop()`, `useFeaturedShops()`
3. Verify skeleton loading still works
4. Test error handling

#### Phase 2: Search Implementation (Week 2)
1. Migrate `useSearchShops()` to real API
2. Test search performance and debouncing
3. Verify search UI remains responsive

#### Phase 3: Mutations (Week 3)
1. Migrate `useToggleFavorite()` to real API
2. Test optimistic UI updates
3. Verify error rollback functionality

#### Phase 4: Production Deployment (Week 4)
1. Set up production API endpoints
2. Configure production environment variables
3. Deploy with feature flag enabled
4. Monitor performance and error rates

### Step 7: Monitoring and Rollback Plan

#### Error Monitoring
```typescript
// services/monitoring/errorTracking.ts
export const trackApiError = (endpoint: string, error: Error) => {
  console.error(`API Error on ${endpoint}:`, error);
  
  // Send to error tracking service (Sentry, Bugsnag, etc.)
  if (process.env.NODE_ENV === 'production') {
    // ErrorTracker.captureException(error, { tags: { endpoint } });
  }
};
```

#### Performance Monitoring
```typescript
// services/monitoring/performance.ts
export const trackApiPerformance = (endpoint: string, duration: number) => {
  console.log(`API Performance ${endpoint}: ${duration}ms`);
  
  // Send to analytics service
  if (process.env.NODE_ENV === 'production') {
    // Analytics.track('api_performance', { endpoint, duration });
  }
};
```

#### Rollback Strategy
```typescript
// config/featureFlags.ts
export const FEATURE_FLAGS = {
  USE_REAL_API: {
    development: process.env.EXPO_PUBLIC_USE_REAL_API === 'true',
    production: true, // Can be toggled remotely
  },
};

// Emergency rollback function
export const rollbackToMockData = () => {
  FEATURE_FLAGS.USE_REAL_API.production = false;
  // Clear all query caches to force re-fetch
  queryClient.clear();
};
```

## Post-Migration Checklist

### Functionality Verification
- [ ] All shops load correctly
- [ ] Shop details display properly
- [ ] Search functionality works
- [ ] Favorites toggle instantly (optimistic UI)
- [ ] Error states display correctly
- [ ] Skeleton loading appears during network requests

### Performance Verification
- [ ] Initial load time < 2 seconds
- [ ] Search results appear < 800ms
- [ ] Smooth scrolling maintained
- [ ] Memory usage stable
- [ ] Battery usage acceptable

### Error Handling Verification
- [ ] Network errors handled gracefully
- [ ] Offline mode functional (if implemented)
- [ ] Rate limiting handled correctly
- [ ] Authentication errors redirect properly

### User Experience Verification
- [ ] Loading states consistent
- [ ] Error messages user-friendly
- [ ] Navigation still smooth
- [ ] Animations/transitions preserved

This migration guide ensures a smooth transition from mock data to real API while maintaining all the performance optimizations and user experience improvements we've implemented.
