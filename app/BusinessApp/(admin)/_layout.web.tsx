import { useColorScheme } from '@/hooks/useColorScheme';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const navItems = [
  { name: 'Dashboard', path: '/BusinessApp/(admin)/dashboard' },
  { name: 'Guest', path: '/BusinessApp/(admin)/guest' },
  { name: 'Transactions', path: '/BusinessApp/(admin)/transactions' },
  { name: 'Manage Business', path: '/BusinessApp/(admin)/manage-business' },
  { name: 'Feedback', path: '/BusinessApp/(admin)/feedback' },
  { name: 'Map Navigation', path: '/BusinessApp/(admin)/maps' },
];

export default function AdminLayout() {
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
              onPress={() => router.push(item.path as any)}
            >
              <Text style={styles.navText}>{item.name}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.content}>
          <Stack screenOptions={{ headerShown: false }} />
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
    borderBottomColor: '#ffffff33',
  },
  navText: {
    color: '#fff',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
});
