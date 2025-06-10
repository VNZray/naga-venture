import AdminHeader from '@/components/AdminHeader';
import { ThemedText } from '@/components/ThemedText';
import { AccommodationProvider } from '@/context/AccommodationContext';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome } from '@expo/vector-icons';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type FontAwesomeIconName =
  | 'dashboard'
  | 'users'
  | 'exchange' // For Bookings & Reservations
  | 'briefcase' // For Business Listings
  | 'comments' // For Reviews & Ratings
  | 'map' // For Tourism Content (e.g., Tourist Spots, Promotions)
  | 'tree' // For Analytics (representing growth/data)
  | 'cog' // For System Settings
  | 'user-plus' // For Content Approval & Business Registrations
  | 'list' // For Categories
  | 'calendar'; // For Events

interface NavItem {
  name: string;
  path: string;
  icon: FontAwesomeIconName;
  roles: string[]; // Allowed roles for this nav item
}

// Define navigation items with role-based access following NAGA VENTURE RBAC Documentation
const allNavItems: NavItem[] = [
  // COMMON TO ALL ROLES
  {
    name: 'Dashboard',
    path: '/TourismCMS/(admin)/dashboard',
    icon: 'dashboard',
    roles: [
      'tourism_admin',
      'business_listing_manager',
      'tourism_content_manager',
      'business_registration_manager',
    ],
  },

  // TOURISM ADMIN EXCLUSIVE SECTIONS
  {
    name: 'User Management',
    path: '/TourismCMS/(admin)/user-management',
    icon: 'users',
    roles: ['tourism_admin'],
  },
  {
    name: 'Bookings & Reservations',
    path: '/TourismCMS/(admin)/bookings-reservations',
    icon: 'exchange',
    roles: ['tourism_admin'],
  },
  {
    name: 'System Settings',
    path: '/TourismCMS/(admin)/system-settings',
    icon: 'cog',
    roles: ['tourism_admin'],
  },

  // BUSINESS LISTING MANAGER SECTIONS
  {
    name: 'Business Listings',
    path: '/TourismCMS/(admin)/business-listings',
    icon: 'briefcase',
    roles: ['tourism_admin', 'business_listing_manager'],
  },

  // Content Approval - Tourism Admin + Business Listing Manager only (per RBAC doc)
  {
    name: 'Content Approval',
    path: '/TourismCMS/(admin)/content-approval',
    icon: 'user-plus',
    roles: ['tourism_admin', 'business_listing_manager'],
  },

  // TOURISM CONTENT MANAGER SECTIONS
  {
    name: 'Tourism Content',
    path: '/TourismCMS/(admin)/tourism-content',
    icon: 'map',
    roles: ['tourism_admin', 'tourism_content_manager'],
  },
  {
    name: 'Events',
    path: '/TourismCMS/(admin)/events',
    icon: 'calendar',
    roles: ['tourism_admin', 'tourism_content_manager'],
  },

  // BUSINESS REGISTRATION MANAGER SECTIONS
  {
    name: 'Business Registrations',
    path: '/TourismCMS/(admin)/business-registrations',
    icon: 'user-plus',
    roles: ['tourism_admin', 'business_registration_manager'],
  },
  {
    name: 'Business Owners',
    path: '/TourismCMS/(admin)/business-owners',
    icon: 'users',
    roles: ['tourism_admin', 'business_registration_manager'],
  },

  // SHARED SECTIONS (multiple roles)
  {
    name: 'Categories',
    path: '/TourismCMS/(admin)/categories',
    icon: 'list',
    roles: [
      'tourism_admin',
      'business_listing_manager',
      'tourism_content_manager',
    ],
  },
  {
    name: 'Reviews & Ratings',
    path: '/TourismCMS/(admin)/reviews-ratings',
    icon: 'comments',
    roles: [
      'tourism_admin',
      'business_listing_manager',
      'tourism_content_manager',
    ],
  },

  // Analytics - All roles (content filtered by backend based on role)
  {
    name: 'Analytics',
    path: '/TourismCMS/(admin)/analytics',
    icon: 'tree',
    roles: [
      'tourism_admin',
      'business_listing_manager',
      'tourism_content_manager',
      'business_registration_manager',
    ],
  },
];

export default function AdminLayout() {
  const [headerTitle, setHeaderTitle] = useState('Dashboard');
  const { user, userProfile, isLoading, isUserProfileLoading, signOut } =
    useAuth();
  const colorScheme = useColorScheme();
  const navItems = useMemo(() => {
    if (!userProfile?.role) return [];
    return allNavItems.filter((item) => item.roles.includes(userProfile.role));
  }, [userProfile?.role]);
  useEffect(() => {
    // Wait until authentication status and profile are fully loaded
    if (!isLoading && !isUserProfileLoading) {
      if (!user) {
        // If user is not authenticated, redirect to CMS login
        router.replace('/TourismCMS/login');
      } else if (
        userProfile &&
        userProfile.role &&
        navItems.length === 0 &&
        router.canGoBack()
      ) {
        // If user is authenticated, has a profile and role, but no sidebar items for them,
        // and not already on the unauthorized screen (simple check)
        // A more robust check would be to see if current route is already unauthorized.
        router.replace('/TourismCMS/(admin)/unauthorized');
      } else if (
        userProfile &&
        userProfile.role &&
        navItems.length === 0 &&
        !router.canGoBack()
      ) {
        // Edge case: if landed directly on a page they shouldn't access and can't go back (e.g. deep link)
        router.replace('/TourismCMS/(admin)/unauthorized');
      }
      // If user is authenticated and has navItems, they can stay.
    }
  }, [user, userProfile, isLoading, isUserProfileLoading, navItems]);
  // Show loading state while authentication is being determined
  if (isLoading || isUserProfileLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0A1B47" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Redirect if user is not authenticated or profile is missing (initial check before useEffect runs or if it hasn't redirected yet)
  if (!user || !userProfile) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0A1B47" />
        <Text style={styles.loadingText}>Loading User...</Text>
      </View>
    );
  }
  // This case should ideally be caught by the useEffect redirect to unauthorized screen.
  // This provides a fallback UI if the redirect hasn't happened yet.
  if (userProfile && userProfile.role && navItems.length === 0) {
    // It's possible the user is already on the unauthorized screen or being redirected.
    // Showing a generic loading/redirecting message is safer here than trying to render the full layout.
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0A1B47" />
        <Text style={styles.loadingText}>Checking permissions...</Text>
      </View>
    );
  }

  return (
    <AccommodationProvider>
      <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
        <View style={styles.container}>
          {' '}
          {/* Sidebar */}
          <View style={styles.sidebar}>
            <Text style={styles.logo}>Naga Venture</Text>
            {navItems.map((item) => (
              <Pressable
                key={item.name}
                style={styles.navItem}
                onPress={() => {
                  setHeaderTitle(item.name);
                  router.push(item.path as any);
                }}
              >
                <View style={styles.navRow}>
                  <FontAwesome
                    name={item.icon}
                    size={20}
                    color="#fff"
                    style={styles.navIcon}
                  />
                  <ThemedText style={styles.navText}>{item.name}</ThemedText>
                </View>
              </Pressable>
            ))}

            {/* Sign Out Button */}
            <Pressable
              style={[styles.navItem, styles.signOutButton]}
              onPress={async () => {
                try {
                  await signOut();
                  router.replace('/TourismCMS/login');
                } catch (error) {
                  console.error('Sign out error:', error);
                }
              }}
            >
              <View style={styles.navRow}>
                <FontAwesome
                  name="sign-out"
                  size={20}
                  color="#ff4444"
                  style={styles.navIcon}
                />
                <ThemedText style={[styles.navText, styles.signOutText]}>
                  Sign Out
                </ThemedText>
              </View>
            </Pressable>
          </View>
          <View style={styles.content}>
            {' '}
            <AdminHeader
              headerTitle={headerTitle}
              headerUserName={
                userProfile
                  ? `${userProfile.first_name || ''} ${
                      userProfile.last_name || ''
                    }`.trim() || 'User'
                  : 'User'
              }
              headerUserEmail={user?.email ?? ''}
            />
            <Stack
              screenOptions={{ headerShown: false, headerBackVisible: false }}
            ></Stack>
          </View>
        </View>
      </ThemeProvider>
    </AccommodationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: '100%',
    width: '100%',
  },
  sidebar: {
    width: 250,
    backgroundColor: '#0A1B47',
    padding: 20,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  navItem: {
    paddingVertical: 12,
    borderBottomColor: '#fff',
  },
  navText: {
    color: '#fff',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navIcon: {
    marginRight: 16,
  },
  signOutButton: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ffffff33',
    paddingTop: 20,
  },
  signOutText: {
    color: '#ff4444',
    fontSize: 14,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0A1B47',
    fontWeight: '500',
  },
});
