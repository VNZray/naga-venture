import { Stack } from 'expo-router';

export default function SpotsLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: '',
        headerTitle: 'Spot Details',
        headerBackVisible: true,
      }}
    />
  );
}
