import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Link, useLocalSearchParams, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import TabSwitcher from '@/components/TabSwitcherComponent';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';

import Details from './details';
import Ratings from './ratings';
import Rooms from './rooms';

import { accommodations } from '@/Controller/AccommodationData';

const { width, height } = Dimensions.get('window');

const AccommodationProfile = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('details');
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const activeBackground = '#0A1B47';

  const [fontsLoaded] = useFonts({
    'Poppins-Black': require('@/assets/fonts/Poppins/Poppins-Black.ttf'),
    'Poppins-Regular': require('@/assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('@/assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('@/assets/fonts/Poppins/Poppins-Bold.ttf'),
  });

  const accommodation = accommodations.find(
    (acc) => acc.id.toString() === id?.toString()
  );

  useEffect(() => {
    if (accommodation?.name) {
      navigation.setOptions({
        headerTitle: accommodation.name,
      });
    }
  }, [navigation, accommodation?.name]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
  }

  const statusBar = () => {
    if (Platform.OS === 'ios') {
      return (
        <StatusBar style="light" translucent backgroundColor="transparent" />
      );
    } else {
      return <></>;
    }
  };

  if (!accommodation) {
    return (
      <View style={styles.notFoundContainer}>
        <ThemedText type="profileTitle">Accommodation not found.</ThemedText>
        <ThemedText type="subtitle2" style={{ textAlign: 'center' }}>
          Please go back and select a valid accommodation.
        </ThemedText>
        <Link href={'/TouristApp/(home)/'}>
          <ThemedText type="link">Go Home</ThemedText>
        </Link>
      </View>
    );
  }

  return (
    <ScrollView style={{ overflow: 'visible' }} nestedScrollEnabled={true}>
      {statusBar()}
      <Image
        source={{ uri: accommodation.imageUri }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <ThemedText type="profileTitle">{accommodation.name}</ThemedText>
            <ThemedText type="default2">
              <MaterialCommunityIcons
                name="map-marker"
                size={16}
                color="#FFB007"
              />{' '}
              {accommodation.location}
            </ThemedText>
          </View>
          <View>
            <ThemedText type="default">
              <MaterialCommunityIcons name="star" size={20} color="#FFB007" />{' '}
              {accommodation.ratings}
            </ThemedText>
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
          color={isDarkMode ? '#fff' : '#000'}
          active={activeBackground}
        />
      </View>

      <View style={styles.tabContent}>
        {activeTab === 'details' && (
          <Details accommodationId={Array.isArray(id) ? id[0] : id} />
        )}
        {activeTab === 'rooms' && (
          <Rooms accommodationId={Array.isArray(id) ? id[0] : id} />
        )}
        {activeTab === 'ratings' && (
          <Ratings accommodationId={Array.isArray(id) ? id[0] : id} />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: width * 1,
    height: height * 0.4,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tabContent: {
    marginBottom: 100,
    overflow: 'visible',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default AccommodationProfile;
