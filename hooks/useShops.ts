// src/hooks/useShops.ts
import {
  destinations as allShopsData,
  getMainCategoryById,
  shopsData,
  featuredShops as staticFeatured,
  mainCategories as staticMainCategories,
} from '@/Controller/ShopData';
import type { MainCategory as MainShopCategory, ShopData } from '@/types/shop'; // Renamed MainCategory to MainShopCategory
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import { useEffect, useState } from 'react';

// --- SIMULATED API CALLS ---
// These functions mimic fetching from a real API.

const fetchAllShops = async (): Promise<ShopData[]> => {
  console.log('Fetching all shops...');
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay
  return Object.values(shopsData) as ShopData[];
};

const fetchShopById = async (id: string): Promise<ShopData | null> => {
  console.log(`Fetching shop by ID: ${id}`);
  await new Promise((resolve) => setTimeout(resolve, 200));
  return (shopsData[id as unknown as keyof typeof shopsData] ||
    null) as ShopData | null;
};

const fetchFeaturedShops = async (): Promise<ShopData[]> => {
  console.log('Fetching featured shops...');
  await new Promise((resolve) => setTimeout(resolve, 300));
  return staticFeatured as ShopData[];
};

const fetchRecommendedShops = async (): Promise<ShopData[]> => {
  console.log('Fetching recommended shops...');
  await new Promise((resolve) => setTimeout(resolve, 300));
  // Filter shops with rating >= 4.5 for recommendations
  return allShopsData.filter((shop) => shop.rating >= 4.5) as ShopData[];
};

const searchShops = async (query: string): Promise<ShopData[]> => {
  console.log(`Searching shops with query: "${query}"`);
  await new Promise((resolve) => setTimeout(resolve, 400)); // Simulate API delay

  if (!query.trim()) {
    return [];
  }

  const lowercaseQuery = query.toLowerCase();
  return allShopsData.filter((shop) => {
    return (
      shop.name.toLowerCase().includes(lowercaseQuery) ||
      shop.category?.toLowerCase().includes(lowercaseQuery) ||
      shop.description?.toLowerCase().includes(lowercaseQuery)
    );
  }) as ShopData[];
};

// --- SIMULATED API CALLS ---
const fetchShopsByCategory = async (
  categoryId: string
): Promise<ShopData[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const mainCategory = getMainCategoryById(categoryId);
  if (!mainCategory) return [];
  const subcategoryIds = mainCategory.subcategories.map(
    (sub: { id: string }) => sub.id
  ); // Added type for sub
  return allShopsData.filter((shop) =>
    subcategoryIds.includes(shop.category)
  ) as ShopData[]; // Added type assertion
};

const fetchShopsBySubcategory = async (
  subcategoryId: string
): Promise<ShopData[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return allShopsData.filter(
    (shop) => shop.category === subcategoryId
  ) as ShopData[]; // Added type assertion
};

// --- SIMULATED API CALL ---
const fetchMainCategories = async (): Promise<MainShopCategory[]> => {
  console.log('Fetching main categories...');
  await new Promise((resolve) => setTimeout(resolve, 400)); // Simulate network delay
  return staticMainCategories;
};

// --- CUSTOM HOOKS ---
// Your components will use these hooks, not the functions above.

export const useShops = () => {
  return useQuery<ShopData[], Error>({
    queryKey: ['shops'],
    queryFn: fetchAllShops,
  });
};

export const useShop = (shopId: string) => {
  return useQuery<ShopData | null, Error>({
    queryKey: ['shop', shopId],
    queryFn: () => fetchShopById(shopId),
    enabled: !!shopId, // Important: only run query if shopId is provided
  });
};

export const useFeaturedShops = () => {
  return useQuery<ShopData[], Error>({
    queryKey: ['shops', 'featured'],
    queryFn: fetchFeaturedShops,
  });
};

export const useRecommendedShops = () => {
  return useQuery<ShopData[], Error>({
    queryKey: ['shops', 'recommended'],
    queryFn: fetchRecommendedShops,
  });
};

export const useShopsByCategory = (categoryId: string) => {
  return useQuery<ShopData[], Error>({
    queryKey: ['shops', { category: categoryId }],
    queryFn: () => fetchShopsByCategory(categoryId),
    enabled: !!categoryId,
  });
};

export const useShopsBySubcategory = (subcategoryId: string) => {
  return useQuery<ShopData[], Error>({
    queryKey: ['shops', { subcategory: subcategoryId }],
    queryFn: () => fetchShopsBySubcategory(subcategoryId),
    enabled: !!subcategoryId,
  });
};

// Search hook with debouncing
export const useSearchShops = (query: string) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce the search query to avoid too many API calls
  useEffect(() => {
    const handler = debounce((searchQuery: string) => {
      setDebouncedQuery(searchQuery);
    }, 300);

    handler(query);

    return () => {
      handler.cancel();
    };
  }, [query]);

  return useQuery<ShopData[], Error>({
    queryKey: ['shops', 'search', debouncedQuery],
    queryFn: () => searchShops(debouncedQuery),
    enabled: !!debouncedQuery.trim(), // Only search if there's a query
  });
};

// --- CUSTOM HOOK ---
export const useMainCategories = () => {
  return useQuery<MainShopCategory[], Error>({
    queryKey: ['categories', 'main'], // A unique key for this data
    queryFn: fetchMainCategories,
  });
};

// --- MUTATION HOOK for updating data ---
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (shopId: string) => {
      // In a real app, this would be a POST/PATCH request to your API.
      // For now, we directly mutate the mock data.
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      const shop = shopsData[shopId as unknown as keyof typeof shopsData];
      if (shop) {
        shop.isFavorited = !shop.isFavorited;
      }
      return shop;
    },

    // This runs BEFORE the mutation function
    onMutate: async (shopId) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['shops'] });
      await queryClient.cancelQueries({ queryKey: ['shop', shopId] });

      // Snapshot the previous values
      const previousShops = queryClient.getQueryData(['shops']);
      const previousFeaturedShops = queryClient.getQueryData([
        'shops',
        'featured',
      ]);
      const previousRecommendedShops = queryClient.getQueryData([
        'shops',
        'recommended',
      ]);
      const previousShop = queryClient.getQueryData(['shop', shopId]);

      // Optimistically update all relevant queries
      queryClient.setQueryData(['shops'], (old: ShopData[] | undefined) => {
        return old
          ? old.map((shop) =>
              shop.id === shopId
                ? { ...shop, isFavorited: !shop.isFavorited }
                : shop
            )
          : [];
      });

      queryClient.setQueryData(
        ['shops', 'featured'],
        (old: ShopData[] | undefined) => {
          return old
            ? old.map((shop) =>
                shop.id === shopId
                  ? { ...shop, isFavorited: !shop.isFavorited }
                  : shop
              )
            : [];
        }
      );

      queryClient.setQueryData(
        ['shops', 'recommended'],
        (old: ShopData[] | undefined) => {
          return old
            ? old.map((shop) =>
                shop.id === shopId
                  ? { ...shop, isFavorited: !shop.isFavorited }
                  : shop
              )
            : [];
        }
      );

      queryClient.setQueryData(
        ['shop', shopId],
        (old: ShopData | null | undefined) => {
          return old ? { ...old, isFavorited: !old.isFavorited } : old;
        }
      );

      // Return a context object with the snapshotted values
      return {
        previousShops,
        previousFeaturedShops,
        previousRecommendedShops,
        previousShop,
      };
    },

    // If the mutation fails, use the context we returned to roll back
    onError: (err, shopId, context) => {
      if (context?.previousShops) {
        queryClient.setQueryData(['shops'], context.previousShops);
      }
      if (context?.previousFeaturedShops) {
        queryClient.setQueryData(
          ['shops', 'featured'],
          context.previousFeaturedShops
        );
      }
      if (context?.previousRecommendedShops) {
        queryClient.setQueryData(
          ['shops', 'recommended'],
          context.previousRecommendedShops
        );
      }
      if (context?.previousShop) {
        queryClient.setQueryData(['shop', shopId], context.previousShop);
      }
    },

    // Always refetch after error or success to ensure server state
    onSettled: (data, error, shopId) => {
      // Added shopId parameter
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      queryClient.invalidateQueries({ queryKey: ['shop', shopId] }); // Invalidate single shop query
    },
  });
};
