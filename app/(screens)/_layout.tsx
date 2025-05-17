import LoadingScreen from '@/app/(screens)/LoadingScreen'
import { Stack } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'

const Screens = () => {

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

    return (
        <Stack>
            <Stack.Screen name='index' options={{ headerShown: false }} />
            <Stack.Screen name='LoadingScreen' options={{  headerShown: false }} />
            <Stack.Screen name='LoginPage' options={{ headerBackTitle: 'Back', headerTitle: '', headerTintColor: 'black', headerShown: true }} />
            <Stack.Screen name='RegistrationPage' options={{ headerBackTitle: 'Back', headerTintColor: 'black', headerShown: true }} />
        </Stack>
    )
}

export default Screens