import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';

const Profile = () => {
  const colorScheme = useColorScheme();
  const color = colorScheme === 'dark' ? '#fff' : '#000';
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.replace('/TouristApp/(screens)/LoginPage');
    }
  }, [user]);

  if (!user) return null;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ThemedText type="title">Hello {user.name}</ThemedText>
      <Pressable onPress={() => router.dismissTo('/TouristApp/LoginPage')}>
        <Text style={{ fontSize: 16, color: color }}>Log Out</Text>
      </Pressable>
      <Pressable
        style={{
          marginTop: 20,
          padding: 12,
          backgroundColor: '#007AFF',
          borderRadius: 8,
        }}
        onPress={() => router.push('/TouristApp/(screens)/SupportTicket')}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>Contact Support</Text>
      </Pressable>
    </View>
  );
};

export default Profile;
