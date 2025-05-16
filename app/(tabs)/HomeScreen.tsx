import CardContainer from '@/components/CardContainer';
import CardView from '@/components/CardView';
import PressableButton from '@/components/PressableButton';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance
} from "react-native-reanimated-carousel";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// const data = [...new Array(6).keys()];

const data = [
  { id: 1, uri: 'https://i0.wp.com/nagayon.com/wp-content/uploads/2024/11/ateneo-de-naga-university1.jpg?resize=768%2C512&ssl=1' },
  { id: 2, uri: 'https://i0.wp.com/nagayon.com/wp-content/uploads/2024/05/Cathedral-Exterior_1-scaled.jpg?resize=768%2C576&ssl=1' },
  { id: 3, uri: 'https://i0.wp.com/nagayon.com/wp-content/uploads/2024/05/Porta-mariae-e1717984426731.jpg?resize=768%2C506&ssl=1' },
  { id: 4, uri: 'https://i0.wp.com/nagayon.com/wp-content/uploads/2024/12/old-abella-arch.jpg?resize=768%2C512&ssl=1' },
  { id: 5, uri: 'https://i0.wp.com/nagayon.com/wp-content/uploads/2024/08/mary-coredemtrix-church.jpg?resize=768%2C432&ssl=1' },
  { id: 6, uri: 'https://i0.wp.com/nagayon.com/wp-content/uploads/2024/09/jmr-coliseum-scaled.jpg?resize=768%2C576&ssl=1' },
];
const width = Dimensions.get("screen").width;

const HomeScreen = () => {
  const colorScheme = useColorScheme();
  const color = colorScheme === 'dark' ? '#fff' : '#000';
  const backgroundColor = colorScheme === 'dark' ? '#000' : '#F8F8F8';

  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView>
          <View style={{ flex: 1, margin: 20, width: width }}>
            <Carousel
              ref={ref}
              width={width / 1.1}
              height={260}
              data={data}
              onProgressChange={progress}
              renderItem={({ item }) => (
                <View style={styles.carouselItem}>
                  <Image
                    source={{ uri: item.uri }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
              )}
            />
          </View>

          <CardContainer style={[styles.directories]} width={width / 1.1}>
            <PressableButton IconSize={24} color={color} direction='column' Title='Place to stay' Icon='hotel' onPress={() => router.navigate('/(tabs)/AccommodationDirectory')}>
            </PressableButton>

            <PressableButton IconSize={24} color={color} direction='column' Title='Shops' Icon="shopping-bag"
              onPress={() => router.navigate('/(tabs)/ShopDirectory')}>
            </PressableButton>

            <PressableButton IconSize={24} color={color} direction='column' Title='Tourist Spots' Icon="map-marker"
              onPress={() => router.navigate('/(tabs)/TouristSpotDirectory')}>
            </PressableButton>

            <PressableButton IconSize={24} color={color} direction='column' Title='Events' Icon="calendar"
              onPress={() => router.navigate('/(tabs)/EventDirectory')}>
            </PressableButton>
          </CardContainer>

          <View style={{ flex: 1, width: width, marginBottom: 70, padding: 20, paddingTop: 0 }}>
            <CardView width={width / 1.1} height={400} radius={10} elevation={0}>
              <View style={{ width: '100%', height: '70%', borderRadius: 10 }}>
                <Image
                  source={{ uri: 'https://i0.wp.com/nagayon.com/wp-content/uploads/2024/08/mary-coredemtrix-church.jpg?resize=768%2C432&ssl=1' }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
              <View style={{ width: '100%', height: '30%', paddingTop: 5, paddingBottom: 5, overflow: 'hidden', }}>
                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, color: color }}>Mary Coredemtrix Church</Text>
                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: color }}>Naga City, Philippines</Text>
              </View>
            </CardView>

            <CardView width={width / 1.1} height={400} radius={10} elevation={0}>
              <View style={{ width: '100%', height: '70%', borderRadius: 10 }}>
                <Image
                  source={{ uri: 'https://i0.wp.com/nagayon.com/wp-content/uploads/2024/08/mary-coredemtrix-church.jpg?resize=768%2C432&ssl=1' }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
              <View style={{ width: '100%', height: '30%', paddingTop: 5, paddingBottom: 5, overflow: 'hidden' }}>
                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, color: color }}>Mary Coredemtrix Church</Text>
                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: color }}>Naga City, Philippines</Text>
              </View>
            </CardView>

            <CardView width={width / 1.1} height={400} radius={10} elevation={0}>
              <View style={{ width: '100%', height: '70%', borderRadius: 10 }}>
                <Image
                  source={{ uri: 'https://i0.wp.com/nagayon.com/wp-content/uploads/2024/08/mary-coredemtrix-church.jpg?resize=768%2C432&ssl=1' }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
              <View style={{ width: '100%', height: '30%', paddingTop: 5, paddingBottom: 5, overflow: 'hidden' }}>
                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, color: color }}>Mary Coredemtrix Church</Text>
                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: color }}>Naga City, Philippines</Text>
              </View>
            </CardView>

            <CardView width={width / 1.1} height={400} radius={10} elevation={0}>
              <View style={{ width: '100%', height: '70%', borderRadius: 10 }}>
                <Image
                  source={{ uri: 'https://i0.wp.com/nagayon.com/wp-content/uploads/2024/08/mary-coredemtrix-church.jpg?resize=768%2C432&ssl=1' }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
              <View style={{ width: '100%', height: '30%', paddingTop: 5, paddingBottom: 5, overflow: 'hidden' }}>
                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, color: color }}>Mary Coredemtrix Church</Text>
                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: color }}>Naga City, Philippines</Text>
              </View>
            </CardView>
          </View>

        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider >
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  text: {

  },

  carouselItem: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },

  directories: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

export default HomeScreen