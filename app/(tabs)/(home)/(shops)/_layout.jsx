import { Stack } from 'expo-router';

const ShopsLayout = () => {
  return (
    <Stack screenOptions={{ 
      headerBackTitle: 'Back', 
      headerShown: true, 
      headerTitle: 'Shops Directory',
      headerTitleStyle: { fontWeight: 'bold' }
    }}>
      <Stack.Screen
        name="bars"
        options={{
          animation: 'slide_from_right',
          headerTitleAlign: 'center',
          headerTitle: 'Bars',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen
        name="cafe"
        options={{
          animation: 'slide_from_right',
          headerTitleAlign: 'center',
          headerTitle: 'Cafe',
        }}
      />
      <Stack.Screen
        name="dining"
        options={{
          animation: 'slide_from_right',
          headerTitleAlign: 'center',
          headerTitle: 'Dining',
        }}
      />
      <Stack.Screen
        name="souvenir"
        options={{
          animation: 'slide_from_right',
          headerTitleAlign: 'center',
          headerTitle: 'Souvenir',
        }}
      />
    </Stack>
  );
};

export default ShopsLayout;