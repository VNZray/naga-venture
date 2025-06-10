// filepath: hooks/useBusinessManagement.ts
import { supabase } from '@/lib/supabase';
import {
  Business,
  BusinessInsert,
  BusinessUpdate,
  BusinessWithImages,
} from '@/types/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Business Management Hooks
 *
 * Smart hooks for business management operations following the "Smart Hook, Dumb Component" pattern.
 * Handles all business logic, data fetching, caching, and mutations.
 */

// Query Keys
export const businessQueryKeys = {
  all: ['businesses'] as const,
  lists: () => [...businessQueryKeys.all, 'list'] as const,
  list: (filters: BusinessFilters) =>
    [...businessQueryKeys.lists(), filters] as const,
  details: () => [...businessQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...businessQueryKeys.details(), id] as const,
  categories: ['business-categories'] as const,
} as const;

// Types
export interface BusinessFilters {
  status?: 'pending' | 'approved' | 'rejected' | 'inactive';
  business_type?: 'accommodation' | 'shop' | 'service';
  searchQuery?: string;
  page?: number;
  limit?: number;
}

export interface BusinessListResponse {
  data: Business[];
  count: number | null;
  hasMore: boolean;
}

/**
 * Hook: useBusinessListings
 *
 * Fetches paginated and filtered list of businesses with optimized caching.
 * Supports status filtering, business type filtering, and text search.
 */
export function useBusinessListings(filters: BusinessFilters = {}) {
  const { status, business_type, searchQuery, page = 1, limit = 20 } = filters;

  return useQuery({
    queryKey: businessQueryKeys.list(filters),
    queryFn: async (): Promise<BusinessListResponse> => {
      let query = supabase.from('businesses').select(
        `
          *,
          business_images!business_images_business_id_fkey(
            id,
            image_url,
            is_primary,
            caption
          ),
          business_categories!business_categories_business_id_fkey(
            sub_categories!business_categories_sub_category_id_fkey(
              id,
              name,
              main_categories!sub_categories_main_category_id_fkey(
                id,
                name
              )
            )
          ),
          profiles!businesses_owner_id_fkey(
            id,
            first_name,
            last_name,
            email
          )
        `,
        { count: 'exact' }
      );

      // Apply filters
      if (status) {
        query = query.eq('status', status);
      }

      if (business_type) {
        query = query.eq('business_type', business_type);
      }

      if (searchQuery && searchQuery.trim()) {
        query = query.or(
          `business_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
        );
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      // Order by created_at descending
      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        console.error(
          '[useBusinessListings] Error fetching businesses:',
          error
        );
        throw new Error(`Failed to fetch businesses: ${error.message}`);
      }

      const hasMore = count ? from + limit < count : false;

      return {
        data: data || [],
        count,
        hasMore,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
  });
}

/**
 * Hook: useBusiness
 *
 * Fetches detailed data for a single business including related images and categories.
 */
export function useBusiness(businessId: string | undefined) {
  return useQuery({
    queryKey: businessQueryKeys.detail(businessId || ''),
    queryFn: async (): Promise<BusinessWithImages | null> => {
      if (!businessId) return null;

      const { data, error } = await supabase
        .from('businesses')
        .select(
          `
          *,
          business_images!business_images_business_id_fkey(
            id,
            image_url,
            is_primary,
            caption,
            display_order
          ),
          business_categories!business_categories_business_id_fkey(
            id,
            sub_categories!business_categories_sub_category_id_fkey(
              id,
              name,
              description,
              main_categories!sub_categories_main_category_id_fkey(
                id,
                name,
                description
              )
            )
          ),
          business_amenities!business_amenities_business_id_fkey(
            amenities!business_amenities_amenity_id_fkey(
              id,
              name,
              icon_url
            )
          ),
          profiles!businesses_owner_id_fkey(
            id,
            first_name,
            last_name,
            email,
            phone_number
          )
        `
        )
        .eq('id', businessId)
        .single();

      if (error) {
        console.error('[useBusiness] Error fetching business:', error);
        throw new Error(`Failed to fetch business: ${error.message}`);
      }

      return data;
    },
    enabled: !!businessId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
}

/**
 * Hook: useCreateBusiness
 *
 * Mutation for creating a new business with automatic cache invalidation.
 */
export function useCreateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (businessData: BusinessInsert): Promise<Business> => {
      const { data, error } = await supabase
        .from('businesses')
        .insert(businessData)
        .select()
        .single();

      if (error) {
        console.error('[useCreateBusiness] Error creating business:', error);
        throw new Error(`Failed to create business: ${error.message}`);
      }

      return data;
    },
    onSuccess: (newBusiness) => {
      // Invalidate all business list queries to refresh the data
      queryClient.invalidateQueries({ queryKey: businessQueryKeys.lists() });

      // Optionally pre-populate the cache for the new business
      queryClient.setQueryData(
        businessQueryKeys.detail(newBusiness.id),
        newBusiness
      );

      console.log(
        '[useCreateBusiness] Business created successfully:',
        newBusiness.id
      );
    },
    onError: (error) => {
      console.error('[useCreateBusiness] Mutation error:', error);
    },
  });
}

/**
 * Hook: useUpdateBusiness
 *
 * Mutation for updating an existing business with selective cache invalidation.
 */
export function useUpdateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      businessId,
      updateData,
    }: {
      businessId: string;
      updateData: BusinessUpdate;
    }): Promise<Business> => {
      const { data, error } = await supabase
        .from('businesses')
        .update(updateData)
        .eq('id', businessId)
        .select()
        .single();

      if (error) {
        console.error('[useUpdateBusiness] Error updating business:', error);
        throw new Error(`Failed to update business: ${error.message}`);
      }

      return data;
    },
    onSuccess: (updatedBusiness, { businessId }) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: businessQueryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: businessQueryKeys.detail(businessId),
      });

      console.log(
        '[useUpdateBusiness] Business updated successfully:',
        businessId
      );
    },
    onError: (error) => {
      console.error('[useUpdateBusiness] Mutation error:', error);
    },
  });
}

/**
 * Hook: useDeleteBusiness
 *
 * Mutation for deleting a business with confirmation dialog and cache cleanup.
 */
export function useDeleteBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (businessId: string): Promise<void> => {
      // Note: In a real app, you might want to soft delete instead
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', businessId);

      if (error) {
        console.error('[useDeleteBusiness] Error deleting business:', error);
        throw new Error(`Failed to delete business: ${error.message}`);
      }
    },
    onSuccess: (_, businessId) => {
      // Remove from all list caches
      queryClient.invalidateQueries({ queryKey: businessQueryKeys.lists() });

      // Remove specific detail cache
      queryClient.removeQueries({
        queryKey: businessQueryKeys.detail(businessId),
      });

      console.log(
        '[useDeleteBusiness] Business deleted successfully:',
        businessId
      );
    },
    onError: (error) => {
      console.error('[useDeleteBusiness] Mutation error:', error);
    },
  });
}

/**
 * Hook: useBusinessCategories
 *
 * Fetches all business categories for form dropdowns and filters.
 */
export function useBusinessCategories() {
  return useQuery({
    queryKey: businessQueryKeys.categories,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sub_categories')
        .select(
          `
          id,
          name,
          description,
          main_categories!sub_categories_main_category_id_fkey(
            id,
            name,
            description
          )
        `
        )
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error(
          '[useBusinessCategories] Error fetching categories:',
          error
        );
        throw new Error(`Failed to fetch categories: ${error.message}`);
      }

      return data || [];
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - categories change infrequently
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}
