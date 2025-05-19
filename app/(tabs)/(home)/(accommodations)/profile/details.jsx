import CardContainer from '@/components/CardContainer';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFonts } from 'expo-font';
import { Text, View } from 'react-native';

const details = () => {
  const colorScheme = useColorScheme();
  const color = colorScheme === 'dark' ? '#fff' : '#000';

  const [fontsLoaded] = useFonts({
    'Poppins-Black': require('@/assets/fonts/Poppins/Poppins-Black.ttf'),
    'Poppins-Regular': require('@/assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('@/assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('@/assets/fonts/Poppins/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <View>
      <CardContainer elevation={2} style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Text style={{ color: color, fontFamily: 'Poppins-Medium', fontSize: 16 }}>
          Description
        </Text>
        <Text style={{ color: color, fontFamily: 'Poppins-Regular', fontSize: 14 }}>
          UMA Hotel + Residences is a new Naga City hotel and residence complex on Magsaysay Avenue, beside the historic Naga River, and located at one of the most desirable addresses in the city. It is a blend of the classic and the modern, marrying the grace of local culture and tradition with contemporary amenities to create a warm, welcoming space that is the perfect backdrop for refined tastes and lifestyles.
        </Text>
        <Text style={{ color: color, fontFamily: 'Poppins-Regular', fontSize: 14 }}>
          “UMA” is Sanskrit for “Ina” or “Mother,” a fitting name as it symbolizes the majestic lady of Naga and draws inspiration from the beauty and grace of Our Lady of Peñafrancia, a revered figure in the region.

        </Text>
        <Text style={{ color: color, fontFamily: 'Poppins-Regular', fontSize: 14 }}>
          Come home to Bicol. Come home to UMA.
        </Text>
      </CardContainer>
    </View>
  )
}

export default details