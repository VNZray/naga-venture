import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { supabase } from '../lib/supabase';
import { Profile as UserProfile, UserRole } from '../types/supabase';

// Re-export types for backward compatibility
export type { UserProfile, UserRole };

// Define the context type
interface AuthContextType {
  session: Session | null;
  user: SupabaseUser | null;
  isLoading: boolean; // Combined loading state
  authError: Error | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  userProfile: UserProfile | null;
  isUserProfileLoading: boolean;
  userProfileError: Error | null;

  // Legacy compatibility (can be reviewed/removed later if not used)
  login: (userData: any) => void;
  logout: () => void;

  // Utility methods
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isAdmin: () => boolean;
}

// Create the context with correct type or null initially
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the AuthProvider props
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider implementation
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [authError, setAuthError] = useState<Error | null>(null);

  const queryClient = useQueryClient();
  const user = session?.user ?? null;

  console.log(
    '[AuthContext] Render: isLoadingInitial:',
    isLoadingInitial,
    'User exists:',
    !!user,
    'Session exists:',
    !!session
  );
  const {
    data: userProfile,
    isLoading: isUserProfileLoading,
    error: userProfileError,
  } = useQuery<UserProfile | null, Error>({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log(
          '[AuthContext] TanStack Query: Skipping profile fetch - no user ID'
        );
        return null;
      }
      console.log(
        `[AuthContext] TanStack Query: Fetching profile for user ${user.id}`
      );

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error(
          `[AuthContext] TanStack Query: Error fetching profile for user ${user.id}`,
          error
        );
        throw error;
      }

      console.log(
        `[AuthContext] TanStack Query: Profile fetched for user ${user.id}`,
        data
      );
      return data;
    },
    enabled: !!user,
    retry: 1,
  });

  // Combined loading state: initial auth check OR profile loading for authenticated user
  const isLoading = isLoadingInitial || (!!user && isUserProfileLoading);

  console.log(
    '[AuthContext] TanStack Query status:',
    'isUserProfileLoading:',
    isUserProfileLoading,
    'userProfile defined:',
    userProfile !== undefined,
    'Combined isLoading:',
    isLoading
  );
  // Effect for initializing session and listening to auth changes
  useEffect(() => {
    console.log(
      '[AuthContext] Main useEffect for session/auth listener triggered.'
    );

    // Initial check for session
    supabase.auth
      .getSession()
      .then(({ data: { session: currentSession } }) => {
        console.log(
          '[AuthContext] getSession success. Current session:',
          !!currentSession
        );
        setSession(currentSession);
        setIsLoadingInitial(false);
      })
      .catch((err) => {
        console.error('[AuthContext] Error in getSession:', err);
        setAuthError(err);
        setIsLoadingInitial(false);
      });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log(
        `[AuthContext] onAuthStateChange event: ${event}, New session:`,
        !!newSession
      );
      setSession(newSession);

      const oldUserId = session?.user?.id;

      if (event === 'SIGNED_OUT') {
        console.log(
          '[AuthContext] SIGNED_OUT: Clearing authError and profile cache for user:',
          oldUserId
        );
        setAuthError(null);

        if (oldUserId) {
          queryClient.removeQueries({
            queryKey: ['userProfile', oldUserId],
            exact: true,
          });
        } else {
          queryClient.removeQueries({
            queryKey: ['userProfile'],
            exact: false,
          });
        }
      } else if (event === 'SIGNED_IN') {
        console.log('[AuthContext] SIGNED_IN: Clearing authError.');
        setAuthError(null);
        // TanStack Query will automatically fetch profile when user becomes available
      }
    });

    return () => {
      console.log('[AuthContext] Unsubscribing from auth changes.');
      subscription.unsubscribe();
    };
  }, [queryClient, session?.user?.id]);
  const signInWithEmail = async (
    email: string,
    password: string
  ): Promise<void> => {
    console.log(
      `[AuthContext] signInWithEmail: Attempting to sign in ${email}`
    );
    setAuthError(null);

    try {
      // Pre-emptive sign out to prevent issues with lingering old sessions
      await supabase.auth.signOut();
      console.log(
        '[AuthContext] signInWithEmail: Pre-emptive signOut complete.'
      );

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        console.error('[AuthContext] signInWithEmail Error:', signInError);
        setAuthError(new Error(signInError.message || 'Sign in failed.'));
        // Clear any cached profile data
        queryClient.removeQueries({ queryKey: ['userProfile'], exact: false });
      } else if (data.session) {
        console.log(
          '[AuthContext] signInWithEmail: signInWithPassword successful. Session data received.'
        );
        // setSession will be handled by onAuthStateChange
        // TanStack Query will pick up the new user
        setAuthError(null);
      } else {
        console.warn(
          '[AuthContext] signInWithEmail: No error but also no session data.'
        );
        setAuthError(new Error('Sign in failed. No session data.'));
        queryClient.removeQueries({ queryKey: ['userProfile'], exact: false });
      }
    } catch (catchedError: any) {
      console.error(
        '[AuthContext] signInWithEmail Catched Error:',
        catchedError
      );
      setAuthError(
        catchedError instanceof Error
          ? catchedError
          : new Error('Unexpected sign-in error.')
      );
      queryClient.removeQueries({ queryKey: ['userProfile'], exact: false });
    }
  };
  const signOut = async (): Promise<void> => {
    console.log('[AuthContext] signOut: Attempting sign out.');
    setAuthError(null);

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[AuthContext] signOut Error:', error);
      setAuthError(error);
    } else {
      console.log('[AuthContext] signOut: Successful.');
      // setSession(null) will be handled by onAuthStateChange
      // Clearing profile cache is also handled by onAuthStateChange for SIGNED_OUT event
    }
  };
  // Legacy compatibility methods
  const login = (userData: any) => {
    console.warn(
      "[AuthContext] Legacy 'login' method called. Please use 'signInWithEmail'.",
      userData
    );
    // Potentially call signInWithEmail if userData structure is known and compatible
  };

  const logout = () => {
    console.warn(
      "[AuthContext] Legacy 'logout' method called. Please use 'signOut'."
    );
    signOut();
  };

  // Utility methods (use `userProfile` from TanStack Query)
  const hasRole = (role: UserRole): boolean => {
    return userProfile?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return !!userProfile && roles.some((r) => userProfile.role === r);
  };

  const isAdmin = (): boolean => {
    // Define what constitutes an admin role based on your UserRole enum
    return hasAnyRole([
      'tourism_admin',
      'business_listing_manager',
      'tourism_content_manager',
      'business_registration_manager',
    ]);
  };

  console.log(
    '[AuthContext] Provider render. isLoading:',
    isLoading,
    'isUserProfileLoading:',
    isUserProfileLoading,
    'user:',
    !!user,
    'userProfile:',
    !!userProfile
  );
  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        authError,
        signInWithEmail,
        signOut,
        userProfile: userProfile ?? null,
        isUserProfileLoading,
        userProfileError: userProfileError as Error | null,
        login,
        logout,
        hasRole,
        hasAnyRole,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContext.Provider');
  }
  return context;
};
