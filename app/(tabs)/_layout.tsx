// app/(tabs)/_layout.js
import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';

import LoadingScreen from '@/app/(screens)/LoadingScreen';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate an asynchronous loading process
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust the time as needed
  }, []);

    // Platform check should be before any return
  if (Platform.OS === 'web') {
    return (
      <div></div>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <LoadingScreen />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            paddingTop: 10,
          },
          default: {
            position: 'absolute',
          },
        }),
      }}
    >
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: 'Home',
          headerTitle: 'Naga Venture',
          headerShown: true,
          animation: 'shift',
          headerTitleAlign: 'left',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="house.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          href: null,
          headerTitle: 'Landing Page',
          headerShown: true,
          animation: 'shift',
          headerTitleAlign: 'center',
        }}
      />

      <Tabs.Screen
        name="maps"
        options={{
          title: 'Maps',
          headerShown: true,
          animation: 'shift',
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="map.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          headerShown: true,
          animation: 'shift',
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="heart.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: true,
          animation: 'shift',
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="person.crop.circle" color={color} />,
        }}
      />

      <Tabs.Screen
        name="AccommodationDirectory"
        options={{
          href: null,
          headerTitle: 'Accommodation',
          headerShown: true,
          animation: 'shift',
          headerTitleAlign: 'center',
          headerLeft: () => true,
          headerRight: () => true,
        }}
      />
      <Tabs.Screen
        name="ShopDirectory"
        options={{
          href: null,
          headerTitle: 'Shops',
          headerShown: true,
          animation: 'shift',
          headerTitleAlign: 'center',
          headerLeft: () => true,
          headerRight: () => true,
        }}
      />
      <Tabs.Screen
        name="TouristSpotDirectory"
        options={{
          href: null,
          headerTitle: 'Tourist Spots',
          headerShown: true,
          animation: 'shift',
          headerTitleAlign: 'center',
          headerLeft: () => true,
          headerRight: () => true,
        }}
      />
      <Tabs.Screen
        name="EventDirectory"
        options={{
          href: null,
          headerTitle: 'Events',
          headerShown: true,
          animation: 'shift',
          headerTitleAlign: 'center',
          headerLeft: () => true,
          headerRight: () => true,
        }}
      />
    </Tabs>
  );
}