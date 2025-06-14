import LoadingScreen from '@/app/TouristApp/(screens)/LoadingScreen';
import { ThemedText } from '@/components/ThemedText';
import AdminHeader from '@/components/web-components/AdminHeader';
import { useAuth } from '@/context/AuthContext';
import { BusinessProvider } from '@/context/BusinessContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome } from '@expo/vector-icons';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type FontAwesomeIconName =
  | 'dashboard'
  | 'users'
  | 'exchange'
  | 'briefcase'
  | 'comments'
  | 'map'
  | 'user-circle-o';

const navItems: { name: string; path: string; icon: FontAwesomeIconName }[] = [
  {
    name: 'Dashboard',
    path: '/BusinessApp/(admin)/dashboard',
    icon: 'dashboard',
  },
  { name: 'Guest', path: '/BusinessApp/(admin)/guest', icon: 'users' },
  {
    name: 'Transactions',
    path: '/BusinessApp/(admin)/transactions',
    icon: 'exchange',
  },
  {
    name: 'Manage Business',
    path: '/BusinessApp/(admin)/manage-business',
    icon: 'briefcase',
  },
  { name: 'Reviews', path: '/BusinessApp/(admin)/reviews', icon: 'comments' },
  { name: 'Map', path: '/BusinessApp/(admin)/maps', icon: 'map' },
  {
    name: 'Profile',
    path: '/BusinessApp/(admin)/profile',
    icon: 'user-circle-o',
  },
];

export default function AdminLayout() {
  const [headerTitle, setHeaderTitle] = useState('Dashboard');
  const { user, logout, loading } = useAuth(); // ✅ include loading
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/BusinessApp/login');
    }
  }, [loading, user]);

  // ✅ Wait for session to load before rendering
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BusinessProvider>
      <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
        <View style={styles.container}>
          {/* Sidebar */}
          <View style={styles.sidebar}>
            <ThemedText style={styles.logo}>Naga Venture</ThemedText>

            <View style={styles.sidebarContent}>
              <View>
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
                      <ThemedText style={styles.navText}>
                        {item.name}
                      </ThemedText>
                    </View>
                  </Pressable>
                ))}
              </View>

              <Pressable
                style={styles.navItem}
                onPress={async () => {
                  try {
                    await logout();
                    router.replace('/BusinessApp/login');
                  } catch (err) {
                    console.error('Logout failed:', err);
                  }
                }}
              >
                <View style={styles.navRow}>
                  <FontAwesome
                    name="sign-out"
                    size={20}
                    color="#fff"
                    style={styles.navIcon}
                  />
                  <ThemedText style={styles.navText}>Logout</ThemedText>
                </View>
              </Pressable>
            </View>
          </View>

          <View style={styles.content}>
            <AdminHeader
              headerTitle={headerTitle}
              headerUserName={user?.display_name ?? ''}
              headerUserEmail={user?.email ?? ''}
            />
            <Stack
              screenOptions={{ headerShown: false, headerBackVisible: false }}
            />
          </View>
        </View>
      </ThemeProvider>
    </BusinessProvider>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebarContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
