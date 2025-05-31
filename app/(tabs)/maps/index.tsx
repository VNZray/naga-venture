import { useColorScheme } from '@/hooks/useColorScheme';
import { Text, View } from 'react-native';


const Maps = () => {
    const colorScheme = useColorScheme();
    const color = colorScheme === 'dark' ? '#fff' : '#000';
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, color: color, fontWeight: 'bold' }}>Maps</Text>
    </View>
  )
}

export default Maps