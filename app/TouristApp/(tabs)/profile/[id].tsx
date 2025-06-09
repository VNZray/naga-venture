import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';

const Profile = () => {
  const colorScheme = useColorScheme();
  const color = colorScheme === 'dark' ? '#fff' : '#000';
  const { user, profile } = useAuth();

  useEffect(() => {
    if (!user) {
      router.replace('/TouristApp/(screens)/LoginPage');
    }
  }, [user]);

  if (!user) return null;

  // Get display name from profile or user metadata
  const displayName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
    : user.user_metadata?.first_name || user.email || 'User';

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ThemedText type="title">Hello {displayName}</ThemedText>
      <Pressable onPress={() => router.dismissTo('/TouristApp/LoginPage')}>
        <Text style={{ fontSize: 16, color: color }}>Log Out</Text>
      </Pressable>
    </View>
  );
};

export default Profile;
