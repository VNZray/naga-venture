import AdminHeader from '@/components/AdminHeader';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome } from '@expo/vector-icons';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type FontAwesomeIconName =
  | 'dashboard'
  | 'users'
  | 'exchange'
  | 'briefcase'
  | 'comments'
  | 'map';

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
  { name: 'Feedback', path: '/BusinessApp/(admin)/feedback', icon: 'comments' },
  { name: 'Map', path: '/BusinessApp/(admin)/maps', icon: 'map' },
];
export default function AdminLayout() {
  const [headerTitle, setHeaderTitle] = useState('Dashboard');

  const colorScheme = useColorScheme();
  return (
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
            headerUserName="ray"
            headerUserEmail="ray@gmail.com"
          />
          <Stack
            screenOptions={{ headerShown: false, headerBackVisible: false }}
          ></Stack>
        </View>
      </View>
    </ThemeProvider>
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
    fontSize: 16,
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
});
