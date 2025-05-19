import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import TabSwitcher from '../../../../../components/TabSwitcherComponent';
import Details from './details';
import Ratings from './ratings';
import Rooms from './rooms';

const AccommodationProfile = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('details');
  const colorScheme = useColorScheme();
  const color = colorScheme === 'dark' ? '#fff' : '#000';
  const activeBackground = '#0A1B47';

  const [fontsLoaded] = useFonts({
    'Poppins-Black': require('@/assets/fonts/Poppins/Poppins-Black.ttf'),
    'Poppins-Regular': require('@/assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('@/assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('@/assets/fonts/Poppins/Poppins-Bold.ttf'),
  });

  const accommodationName = `Accommodation ${id}`;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: accommodationName,
    });
  }, [navigation, accommodationName]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
  }

  return (
    <ScrollView>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <View style={{ position: 'relative' }}>
        <Image
          source={{
            uri: 'https://media-cdn.tripadvisor.com/media/photo-p/2e/4f/53/15/uma-hotel-residences.jpg',
          }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { fontFamily: 'Poppins-Bold', color: color }]}>
              UMA Residences
            </Text>
            <Text style={{ fontFamily: 'Poppins-Regular', color: color }}>
              <MaterialCommunityIcons name="map-marker" size={20} color="#FFB007" />
              Magsaysay Avenue.
            </Text>
          </View>
          <View>
            <Text style={[styles.ratings, { fontFamily: 'Poppins-SemiBold', color: color }]}>
              <MaterialCommunityIcons name="star" size={20} color="#FFB007" /> 4.5
            </Text>
          </View>
        </View>

        <TabSwitcher
          tabs={[
            { key: 'details', label: 'Details' },
            { key: 'rooms', label: 'Rooms' },
            { key: 'ratings', label: 'Ratings' },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          color={color}
          active={activeBackground}
        />
      </View>

      <View style={styles.tabContent}>
        <View style={{ display: activeTab === 'details' ? 'flex' : 'none' }}>
          <Details />
        </View>
        <View style={{ display: activeTab === 'rooms' ? 'flex' : 'none' }}>
          <Rooms />
        </View>
        <View style={{ display: activeTab === 'ratings' ? 'flex' : 'none' }}>
          <Ratings />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 360,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabContent: {
    paddingTop: 0,
    padding: 16,
  },
  ratings: {
    fontSize: 16,
  },
});

export default AccommodationProfile;
