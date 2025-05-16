import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

const Profile = () => {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, color: colorScheme === 'dark' ? '#fff' : '#000', fontWeight: 'bold' }}>Profile</Text>

      <Pressable onPress={() => router.navigate('/')}>
        <Text style={{ fontSize: 16, color: colorScheme === 'dark' ? '#fff' : '#000' }}>Log Out</Text>
      </Pressable>
    </View>
  )
}

export default Profile