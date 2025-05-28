import { Stack } from 'expo-router'

const HomeLayout = () => {
  return (
    <Stack screenOptions={{ headerBackTitle: 'Back', headerShown: true, headerTitle: 'Naga Venture' }} >
      <Stack.Screen
        name="(accommodations)"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          headerTitleAlign: 'center',
          headerTitle: 'Accommodation Directory',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="(events)"
        options={{
          headerShown: true,
          animation: 'slide_from_right',
          headerTitleAlign: 'center',
          headerTitle: 'Events',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="(shops)"
        options={{
          headerShown: true,
          animation: 'slide_from_right',
          headerTitleAlign: 'center',
          headerTitle: 'Shop Directory',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="(touristSpots)"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          headerTitleAlign: 'center',
          headerTitle: 'Tourist Spots Directory',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  )
}

export default HomeLayout