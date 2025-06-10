// filepath: app/TourismCMS/(admin)/categories-organization/_layout.tsx
import { Stack } from 'expo-router';

export default function CategoriesOrganizationLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerBackVisible: false,
      }}
    >
      <Stack.Screen name="business-categories/index" />
      <Stack.Screen name="tourism-categories/index" />
    </Stack>
  );
}
