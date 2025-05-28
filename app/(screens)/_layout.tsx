import LoadingScreen from '@/app/(screens)/LoadingScreen'
import { useColorScheme } from '@/hooks/useColorScheme'
import { Stack } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Platform, View } from 'react-native'

const Screens = () => {

  const colorScheme = useColorScheme();
  const color = colorScheme === 'dark' ? '#fff' : '#000';

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate an asynchronous loading process
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust the time as needed
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <LoadingScreen />
      </View>
    );
  }

  if (Platform.OS === "web") {
    return (
      <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name='LoadingScreen' options={{ headerShown: false }} />
        <Stack.Screen name='LoginPage' options={{ headerBackTitle: 'Back', headerTitle: 'Login', headerTintColor: color, headerShown: false, title: 'Login' }} />
        <Stack.Screen name='RegistrationPage' options={{ headerBackTitle: 'Back', headerTintColor: color, headerShown: false, title: 'Sign Up' }} />
      </Stack>
    );
  }


  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='LoadingScreen' options={{ headerShown: false }} />
      <Stack.Screen name='LoginPage' options={{ headerBackTitle: 'Back', headerTitle: 'Login', headerTintColor: color, headerShown: true, title: 'Login' }} />
      <Stack.Screen name='RegistrationPage' options={{ headerBackTitle: 'Back', headerTintColor: color, headerShown: true, title: 'Sign Up' }} />
    </Stack>
  )
}

export default Screens