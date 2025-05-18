import { Stack } from 'expo-router'

const HomeLayout = () => {
  return (
    <Stack screenOptions={{ headerBackTitle: 'Back', headerShown: true, headerTitle: 'Naga Venture' }} >
      <Stack.Screen
        name="AccommodationDirectory"
        options={{
          headerShown: true,
          animation: 'slide_from_right',
          headerTitleAlign: 'center',
          headerTitle: 'Accommodation Directory',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="EventDirectory"
        options={{
          headerShown: true,
          animation: 'slide_from_right',
          headerTitleAlign: 'center',
          headerTitle: 'Event Directory',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="ShopDirectory"
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