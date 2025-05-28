import { accommodations } from '@/app/Controller/AccommodationData';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const Maps = () => {
  const colorScheme = useColorScheme();
  const color = colorScheme === 'dark' ? '#fff' : '#000';

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ width: '100%', height: '100%' }}
        initialRegion={{
          latitude: 13.6217, // Centered around Naga City
          longitude: 123.1948,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {accommodations.map((acc) => (
          <Marker
            key={acc.id}
            coordinate={{
              latitude: acc.latitude,
              longitude: acc.longitude,
            }}
            title={acc.name}
            description={acc.location}
          />
        ))}
      </MapView>

      {/* Optional: Display current theme mode for debugging */}
      <Text style={{ position: 'absolute', bottom: 10, alignSelf: 'center', color }}>
        {colorScheme} Mode
      </Text>
    </View>
  );
};

export default Maps;