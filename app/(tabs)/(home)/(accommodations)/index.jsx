import CardView from '@/components/CardView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
const width = Dimensions.get("screen").width;

const AccommodationDirectory = () => {
  const colorScheme = useColorScheme();
  const color = colorScheme === 'dark' ? '#fff' : '#000';
  const backgroundColor = colorScheme === 'dark' ? '#151718' : '#FFFFFF';
  const isDarkMode = colorScheme === 'dark';

  return (
    <ScrollView style={{ paddingTop: 16 }}>
      <View style={{ displat: 'flex', gap: 16, width: width, marginBottom: 100 }}>
        <Link href={'profile/1'}>
          <CardView width={width} height={320} radius={10} elevation={0}>
            <View style={{ width: '100%', height: '88%', borderRadius: 10, position: 'absolute', top: 0 }}>
              <Image
                source={{ uri: 'https://media-cdn.tripadvisor.com/media/photo-p/2e/4f/53/15/uma-hotel-residences.jpg' }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <View style={[styles.cardTextContainer, {
              backgroundColor: backgroundColor,
              shadowColor: isDarkMode ? '#f3f3f3' : '#000000',
              shadowOpacity: isDarkMode ? 0 : 0.2,
              shadowOffset: { width: 0, height: 0 },
              shadowRadius: 6,
            }]}>
              <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 14, color: color }}>UMA Residence</Text>
              <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 10, color: color }}><MaterialCommunityIcons name="map-marker" size={12} color="orange" />
                Naga City, Philippines</Text>
              <Text style={{
                fontFamily: 'Poppins-Bold', fontSize: 12, color: 'orange'
              }}>PHP 500.00 - PHP 3,500.00</Text>
            </View>
          </CardView>
        </Link>
      </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  cardTextContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderRadius: 10,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    justifyContent: 'center'
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },

});

export default AccommodationDirectory