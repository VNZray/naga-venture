import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { supabase } from '../lib/supabase';

// Define the user role enum
export type UserRole =
  | 'tourism_admin'
  | 'business_listing_manager'
  | 'tourism_content_manager'
  | 'business_registration_manager'
  | 'business_owner'
  | 'tourist';

// Define the profile interface based on database schema
export interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  profile_image_url: string | null;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Define the context type
interface AuthContextType {
  // Supabase session and user
  session: Session | null;
  user: SupabaseUser | null;

  // Custom profile data
  profile: UserProfile | null;

  // Loading states
  isLoading: boolean;
  isProfileLoading: boolean;

  // Error state
  error: Error | null;

  // Auth methods
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    profileData?: Partial<UserProfile>
  ) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;

  // Legacy compatibility
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

// Helper function to fetch user profile with RLS error handling
const fetchUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  if (!userId) return null;

  try {
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
          'RLS infinite recursion detected. Using fallback profile.'
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
            role: 'tourist', // Default role
            is_verified: false,
            created_at: user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as UserProfile;
        }
      }
      console.error('Profile fetch error:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

// AuthProvider implementation
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true); // For initial auth check
  const [isProfileLoading, setIsProfileLoading] = useState(false); // For profile data fetching
  const [error, setError] = useState<Error | null>(null);

  // Effect for initializing session and listening to auth changes
  useEffect(() => {
    console.log('[AuthContext] Initializing AuthState...');
    // setIsLoading(true); // isLoading is already true by default

    supabase.auth
      .getSession()
      .then(({ data: { session: currentSession } }) => {
        console.log('[AuthContext] getSession completed.', currentSession);
        setSession(currentSession);
        const currentUser = currentSession?.user ?? null;
        setUser(currentUser); // This will trigger the user-dependent useEffect if currentUser exists

        if (!currentUser) {
          // No active session from getSession, initial auth check is done for this path.
          setIsLoading(false);
          setProfile(null);
          setIsProfileLoading(false); // Ensure this is also false
          console.log(
            '[AuthContext] No active session from getSession. isLoading set to false.'
          );
        } else {
          // User exists from getSession. isLoading remains true.
          // The useEffect([user,...]) will be triggered to fetch the profile.
          // onAuthStateChange with INITIAL_SESSION or SIGNED_IN might also fire.
          console.log(
            `[AuthContext] Active session found by getSession for user ${currentUser.id}. Profile will be fetched if needed by user effect.`
          );
        }
      })
      .catch((err) => {
        console.error('[AuthContext] Error in getSession:', err);
        setIsLoading(false); // Stop loading on error
        setProfile(null);
        setIsProfileLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log(
        `[AuthContext] onAuthStateChange event: ${event}, User: ${newSession?.user?.id}, Current Profile ID: ${profile?.id}, isProfileLoading: ${isProfileLoading}, isLoading: ${isLoading}`
      );
      setSession(newSession);
      const newAuthUser = newSession?.user ?? null;
      // Setting user here will trigger the user-dependent useEffect if newAuthUser is different or causes a relevant state change.
      setUser(newAuthUser);

      if (event === 'SIGNED_IN' && newAuthUser) {
        console.log(
          `[AuthContext] SIGNED_IN handler for user ${newAuthUser.id}.`
        );
        // Scenario 1: Profile for this user is already loaded and no fetch is in progress.
        if (profile?.id === newAuthUser.id && !isProfileLoading) {
          console.log(
            '[AuthContext] SIGNED_IN: Profile already loaded for this user. No fetch needed.'
          );
          setIsLoading(false); // Ensure overall loading indicator is off.
        }
        // Scenario 2: A profile fetch is already in progress (possibly for this user or another).
        else if (isProfileLoading) {
          console.log(
            '[AuthContext] SIGNED_IN: Profile fetch already in progress. Skipping new fetch.'
          );
          // The ongoing fetch's finally block will handle setting isLoading and isProfileLoading.
          // If the ongoing fetch is for a *different* user, the setUser above might trigger the user effect
          // to correct this once the current fetch completes.
        }
        // Scenario 3: Need to fetch profile (no profile, different user's profile, or no fetch in progress for current user).
        else {
          console.log(
            `[AuthContext] SIGNED_IN: Conditions met to fetch profile for user ${newAuthUser.id}.`
          );
          setIsProfileLoading(true);
          // Clear profile if it's for a different user or to ensure fresh state
          if (!profile || profile.id !== newAuthUser.id) {
            setProfile(null);
          }

          try {
            const profileData = await fetchUserProfile(newAuthUser.id);
            console.log(
              '[AuthContext] SIGNED_IN: Profile fetched successfully.',
              profileData
            );
            setProfile(profileData);
          } catch (profileError) {
            console.error(
              '[AuthContext] SIGNED_IN: Error fetching profile:',
              profileError
            );
            setError(
              profileError instanceof Error
                ? profileError
                : new Error('Failed to fetch profile')
            );
            setProfile(null);
          } finally {
            setIsProfileLoading(false);
            setIsLoading(false); // Mark loading as complete after this auth event processing.
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log(
          '[AuthContext] SIGNED_OUT: Clearing user, profile, and error states.'
        );
        // setUser(null); // Already handled by common setUser(newAuthUser) call where newAuthUser would be null
        setProfile(null);
        setError(null);
        setIsProfileLoading(false);
        setIsLoading(false);
      } else if (event === 'USER_UPDATED' && newAuthUser) {
        console.log(
          `[AuthContext] USER_UPDATED event for user ${newAuthUser.id}.`
        );
        // setUser(newAuthUser) is already called.
        // If profile needs re-fetch based on user_metadata, the user effect might handle it if profile.id mismatches,
        // or specific logic could be added here.
        // For now, ensure isLoading is false if no profile fetch is triggered by this.
        if (!isProfileLoading) {
          setIsLoading(false);
        }
      } else if (event === 'INITIAL_SESSION') {
        console.log(
          `[AuthContext] INITIAL_SESSION event. User from session: ${newAuthUser?.id}`
        );
        if (newAuthUser) {
          // User is present from initial session.
          // If profile isn't loaded for this user and no fetch is in progress,
          // the user-dependent useEffect should pick this up.
          // isLoading remains true, user-effect will set it false after profile fetch.
          // If profile *is* already loaded for this user (e.g. from a quick getSession + user effect),
          // and isProfileLoading is false, then we can set isLoading to false.
          if (profile?.id === newAuthUser.id && !isProfileLoading) {
            console.log(
              '[AuthContext] INITIAL_SESSION: User and matching profile already present. Setting isLoading false.'
            );
            setIsLoading(false);
          } else if (!isProfileLoading) {
            // Profile not loaded or mismatch, and no fetch in progress. User effect will handle.
            console.log(
              '[AuthContext] INITIAL_SESSION: User present, profile needs fetch (will be handled by user effect). isLoading remains true.'
            );
          }
        } else {
          // No user from INITIAL_SESSION. Auth state is determined.
          console.log(
            '[AuthContext] INITIAL_SESSION: No user. Setting isLoading to false.'
          );
          setProfile(null);
          setIsProfileLoading(false);
          setIsLoading(false);
        }
      }
    });

    return () => {
      console.log('[AuthContext] Unsubscribing from auth changes.');
      subscription.unsubscribe();
    };
  }, [profile, isProfileLoading, isLoading]); // Added missing dependencies

  // Effect for fetching profile when user object changes or is initially set,
  // and profile is missing, for a different user, or a fetch is not already in progress.
  useEffect(() => {
    console.log(
      `[AuthContext] User effect triggered. User ID: ${user?.id}, Profile ID: ${profile?.id}, isProfileLoading: ${isProfileLoading}, isLoading: ${isLoading}`
    );
    if (user?.id) {
      // Only proceed if a profile fetch is not already in progress for the current user context
      if (!isProfileLoading) {
        // Fetch if profile is null or for a different user
        if (!profile || profile.id !== user.id) {
          console.log(
            `[AuthContext] User effect: User (${
              user.id
            }) requires profile fetch. Current profile: ${
              profile ? `ID ${profile.id}` : 'null'
            }.`
          );
          setIsProfileLoading(true);
          // setProfile(null); // Clear profile before fetch if it's stale or null - fetchUserProfile is for user.id

          fetchUserProfile(user.id)
            .then((profileData) => {
              console.log(
                '[AuthContext] User effect: Profile fetched successfully.',
                profileData
              );
              setProfile(profileData);
            })
            .catch((profileError) => {
              console.error(
                '[AuthContext] User effect: Error fetching profile:',
                profileError
              );
              setError(
                profileError instanceof Error
                  ? profileError
                  : new Error('Failed to fetch profile')
              );
              setProfile(null);
            })
            .finally(() => {
              setIsProfileLoading(false);
              // This effect might be part of the initial load sequence or a user change.
              // If isLoading was true, and we've now settled the profile, isLoading should become false.
              console.log(
                `[AuthContext] User effect: Profile fetch finished. Current isLoading: ${isLoading}. Setting isLoading to false.`
              );
              setIsLoading(false);
            });
        } else {
          // User exists, profile exists for this user, and not currently loading.
          // This means the state is consistent regarding this user and their profile.
          // If isLoading is true, it means this might be the final step of an initial load.
          if (isLoading) {
            console.log(
              '[AuthContext] User effect: User and matching profile exist. Initial load sequence likely complete. Setting isLoading to false.'
            );
            setIsLoading(false);
          }
        }
      } else {
        console.log(
          `[AuthContext] User effect: User (${user.id}) present, but profile fetch already in progress by another process. Skipping.`
        );
        // If a fetch is in progress, that fetch's finally block will handle isLoading.
      }
    } else if (!user) {
      // User is null. This case is primarily handled by onAuthStateChange SIGNED_OUT.
      // This branch ensures profile is cleared if user becomes null for any other reason
      // and that loading states are false if not already.
      console.log(
        '[AuthContext] User effect: User is null. Ensuring profile is null and loading states are false.'
      );
      setProfile(null); // Ensure profile is cleared
      if (isProfileLoading) setIsProfileLoading(false); // Should be false if user is null
      if (isLoading) setIsLoading(false); // If user is null, auth state is determined (not loading).
    }
  }, [user, profile, isProfileLoading, isLoading]); // Added missing dependency 'profile'

  // Auth methods
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  // New signInWithEmail function as specified
  const signInWithEmail = async (
    email: string,
    password: string
  ): Promise<void> => {
    console.log('[AuthContext] signInWithEmail started.');
    setIsLoading(true); // Indicate that an auth operation is in progress.
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        console.error(
          '[AuthContext] signInWithEmail: Supabase sign-in error:',
          signInError
        );
        setError(new Error(signInError.message || 'Sign in failed'));
        setIsLoading(false); // Critical: if sign-in itself fails, stop loading.
      } else {
        console.log(
          '[AuthContext] signInWithEmail: Supabase sign-in successful. Waiting for onAuthStateChange to handle session and profile.'
        );
        // On success, onAuthStateChange will fire.
        // It will manage further state updates including profile fetching and ultimately setIsLoading(false).
        // So, we don't set isLoading to false here on direct success of signInWithPassword.
      }
    } catch (catchedError: any) {
      console.error(
        '[AuthContext] signInWithEmail: Unexpected error:',
        catchedError
      );
      setError(
        catchedError instanceof Error
          ? catchedError
          : new Error('An unexpected error occurred during sign in.')
      );
      setIsLoading(false); // Critical: on unexpected error, stop loading.
    }
    // No finally block changing isLoading here. It's handled by success/error paths or onAuthStateChange.
  };

  const signUp = async (
    email: string,
    password: string,
    profileData?: Partial<UserProfile>
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: profileData || {},
      },
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };
  // Legacy compatibility methods
  const login = (userData: any) => {
    // For backward compatibility, set a mock session
    setUser({
      id: userData.id?.toString() || '1',
      email: userData.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_metadata: {},
      aud: 'authenticated',
      user_metadata: {
        first_name: userData.name?.split(' ')[0] || '',
        last_name: userData.name?.split(' ').slice(1).join(' ') || '',
      },
    } as SupabaseUser);
  };

  const logout = () => {
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  // Utility methods
  const hasRole = (role: UserRole): boolean => {
    return profile?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return profile ? roles.includes(profile.role) : false;
  };

  const isAdmin = (): boolean => {
    return hasRole('tourism_admin');
  };
  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        isProfileLoading,
        error,
        signIn,
        signInWithEmail,
        signUp,
        signOut,
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

// Hook to access the context safely
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
