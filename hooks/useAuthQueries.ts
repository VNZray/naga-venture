import { UserProfile, UserRole } from '@/context/AuthContext';
import { authKeys } from '@/lib/queryKeys';
import { supabase } from '@/lib/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Custom hooks for authentication-related queries

/**
 * Hook for fetching user profile with caching and automatic refetch
 */
export const useUserProfile = (userId?: string) => {
  return useQuery({
    queryKey: userId ? authKeys.profile(userId) : [],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // Handle RLS infinite recursion error
        if (
          error.code === '42P17' ||
          error.message.includes('infinite recursion')
        ) {
          console.warn(
            'RLS infinite recursion detected in useUserProfile. Using fallback.'
          );
          // Get user info from auth session
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            return {
              id: user.id,
              email: user.email || '',
              first_name: user.user_metadata?.first_name || null,
              last_name: user.user_metadata?.last_name || null,
              phone_number: null,
              profile_image_url: null,
              role: 'tourist' as UserRole,
              is_verified: false,
              created_at: user.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString(),
            } as UserProfile;
          }
        }
        throw new Error(`Failed to fetch user profile: ${error.message}`);
      }

      return data as UserProfile;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook for updating user profile with optimistic updates
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<UserProfile> & { userId: string }) => {
      const { userId, ...profileUpdates } = updates;

      const { error } = await supabase
        .from('profiles')
        .update({
          ...profileUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        throw new Error(`Failed to update profile: ${error.message}`);
      }

      return { userId, updates: profileUpdates };
    },
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: authKeys.profile(variables.userId),
      });

      // Snapshot previous value
      const previousProfile = queryClient.getQueryData(
        authKeys.profile(variables.userId)
      );

      // Optimistically update profile
      queryClient.setQueryData(
        authKeys.profile(variables.userId),
        (old: UserProfile | undefined) => {
          if (!old) return old;
          return { ...old, ...variables };
        }
      );

      return { previousProfile };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousProfile) {
        queryClient.setQueryData(
          authKeys.profile(variables.userId),
          context.previousProfile
        );
      }
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: authKeys.profile(data.userId),
      });
    },
  });
};

/**
 * Hook for fetching users by role (useful for admin interfaces)
 */
export const useUsersByRole = (role?: UserRole) => {
  return useQuery({
    queryKey: ['users', 'by-role', role],
    queryFn: async () => {
      if (!role) return [];

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', role)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch users by role: ${error.message}`);
      }

      return data as UserProfile[];
    },
    enabled: !!role,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for checking if user has specific permissions
 */
export const useUserPermissions = (userId?: string) => {
  const { data: profile } = useUserProfile(userId);

  const hasRole = (role: UserRole): boolean => {
    return profile?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return profile ? roles.includes(profile.role) : false;
  };

  const isAdmin = (): boolean => {
    return hasRole('tourism_admin');
  };

  const isStaff = (): boolean => {
    return hasAnyRole([
      'tourism_admin',
      'business_listing_manager',
      'tourism_content_manager',
      'business_registration_manager',
    ]);
  };

  const canManageContent = (): boolean => {
    return hasAnyRole(['tourism_admin', 'tourism_content_manager']);
  };

  const canManageBusinesses = (): boolean => {
    return hasAnyRole([
      'tourism_admin',
      'business_listing_manager',
      'business_registration_manager',
    ]);
  };

  return {
    profile,
    hasRole,
    hasAnyRole,
    isAdmin,
    isStaff,
    canManageContent,
    canManageBusinesses,
  };
};

/**
 * Hook for real-time profile updates (using Supabase subscriptions)
 */
export const useProfileSubscription = (userId?: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['profile-subscription', userId],
    queryFn: () => null, // This doesn't fetch data, just sets up subscription
    enabled: !!userId,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    initialData: null,
    meta: {
      subscription: () => {
        if (!userId) return () => {};

        const subscription = supabase
          .channel(`profile-${userId}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${userId}`,
            },
            (payload) => {
              console.log('Profile subscription update:', payload);
              // Invalidate profile query to trigger refetch
              queryClient.invalidateQueries({
                queryKey: authKeys.profile(userId),
              });
            }
          )
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      },
    },
  });
};
