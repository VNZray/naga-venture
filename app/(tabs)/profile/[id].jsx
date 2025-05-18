import { useColorScheme } from '@/hooks/useColorScheme';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

const Profile = () => {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const color = colorScheme === 'dark' ? '#fff' : '#000';

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, color: color, fontWeight: 'bold' }}>Profile {id}</Text>

      <Pressable onPress={() => router.dismissTo('/LoginPage')}>
        <Text style={{ fontSize: 16, color: color }}>Log Out</Text>
      </Pressable>
    </View>
  )
}

export default Profile