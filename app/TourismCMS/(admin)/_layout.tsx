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
  | 'exchange'
  | 'briefcase'
  | 'comments'
  | 'map'
  | 'tree'
  | 'cog'
  | 'user-plus'
  | 'list';

interface NavItem {
  name: string;
  path: string;
  icon: FontAwesomeIconName;
  roles: string[]; // Allowed roles for this nav item
}

// Define navigation items with role-based access
const allNavItems: NavItem[] = [
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
  {
    name: 'User Registration',
    path: '/TourismCMS/(admin)/registration',
    icon: 'user-plus',
    roles: ['tourism_admin', 'business_registration_manager'],
  },
  {
    name: 'Business Listings',
    path: '/TourismCMS/(admin)/businesses',
    icon: 'briefcase',
    roles: ['tourism_admin', 'business_listing_manager'],
  },
  {
    name: 'Tourist Spots',
    path: '/TourismCMS/(admin)/tourist-spots',
    icon: 'tree',
    roles: ['tourism_admin', 'tourism_content_manager'],
  },
  {
    name: 'Events',
    path: '/TourismCMS/(admin)/events',
    icon: 'comments',
    roles: ['tourism_admin', 'tourism_content_manager'],
  },
  {
    name: 'Accommodations',
    path: '/TourismCMS/(admin)/accommodation',
    icon: 'list',
    roles: ['tourism_admin', 'business_listing_manager'],
  },
  {
    name: 'Content Management',
    path: '/TourismCMS/(admin)/content',
    icon: 'exchange',
    roles: ['tourism_admin', 'tourism_content_manager'],
  },
  {
    name: 'System Settings',
    path: '/TourismCMS/(admin)/settings',
    icon: 'cog',
    roles: ['tourism_admin'], // Only tourism_admin can access system settings
  },
];

export default function AdminLayout() {
  const [headerTitle, setHeaderTitle] = useState('Dashboard');
  const { user, profile, isLoading, isProfileLoading } = useAuth();
  const colorScheme = useColorScheme();

  // Filter navigation items based on user role
  const navItems = useMemo(() => {
    if (!profile?.role) return [];
    return allNavItems.filter((item) => item.roles.includes(profile.role));
  }, [profile?.role]);

  useEffect(() => {
    if (!user) {
      router.replace('/TouristApp');
    }
  }, [user]);

  // Show loading state while authentication is being determined
  if (isLoading || isProfileLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0A1B47" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Redirect if user is not authenticated
  if (!user || !profile) {
    return null; // This will trigger the useEffect redirect
  }
  return (
    <AccommodationProvider>
      <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
        <View style={styles.container}>
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
          </View>
          <View style={styles.content}>
            <AdminHeader
              headerTitle={headerTitle}
              headerUserName={
                profile
                  ? `${profile.first_name || ''} ${
                      profile.last_name || ''
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
