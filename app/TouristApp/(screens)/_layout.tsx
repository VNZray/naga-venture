import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

const Screens = () => {
  const colorScheme = useColorScheme();
  const color = colorScheme === 'dark' ? '#fff' : '#000';

  if (Platform.OS === 'web') {
    return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="LoadingScreen" options={{ headerShown: false }} />
        <Stack.Screen
          name="LoginPage"
          options={{
            headerBackTitle: 'Back',
            headerTitle: 'Login',
            headerTintColor: color,
            headerShown: false,
            title: 'Login',
          }}
        />
        <Stack.Screen
          name="RegistrationPage"
          options={{
            headerBackTitle: 'Back',
            headerTintColor: color,
            headerShown: false,
            title: 'Sign Up',
          }}
        />
      </Stack>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="LoadingScreen" options={{ headerShown: false }} />
      <Stack.Screen
        name="LoginPage"
        options={{
          headerBackTitle: 'Back',
          headerTitle: 'Login',
          headerTintColor: color,
          headerShown: true,
          title: 'Login',
        }}
      />
      <Stack.Screen
        name="RegistrationPage"
        options={{
          headerBackTitle: 'Back',
          headerTintColor: color,
          headerShown: true,
          title: 'Sign Up',
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        options={{
          headerBackTitle: 'Back',
          headerTintColor: color,
          headerShown: true,
          title: 'Forgot Password',
        }}
      />
    </Stack>
  );
};

export default Screens;
