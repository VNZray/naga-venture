import CardView from '@/components/CardView';
import SearchBar from '@/components/SearchBar';
import { ThemedText } from '@/components/ThemedText';
import { useAccommodation } from '@/context/AccommodationContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Link } from 'expo-router';
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

const width = Dimensions.get('screen').width;

const AccommodationDirectory = () => {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#151718' : '#FFFFFF';
  const isDarkMode = colorScheme === 'dark';

  const {
    search,
    setSearch,
    handleSearch,
    filteredAccommodations,
    loading,
    showActiveForTourist,
  } = useAccommodation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.SearchContainer}>
        <SearchBar
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            handleSearch(text);
          }}
          onSearch={() => handleSearch(search)}
          placeholder={'Search Accommodation or Location'}
        />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingTop: 86, paddingBottom: 100 }}
      >
        <View style={styles.cardWrapper}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={isDarkMode ? '#fff' : '#000'}
              style={{ marginTop: 40 }}
            />
          ) : filteredAccommodations.length > 0 ? (
            filteredAccommodations.map((acc) => (
              <Link
                href={`/TouristApp/(home)/(accommodations)/profile/${acc.id}`}
                key={acc.id}
              >
                <CardView
                  width={width - 32}
                  height={320}
                  radius={10}
                  elevation={0}
                  imageUri={acc.imageUri}
                  title={acc.name}
                  subtitle={acc.location}
                  price={acc.priceRange}
                />
              </Link>
            ))
          ) : (
            <ThemedText style={{ textAlign: 'center', marginTop: 40 }}>
              No results found.
            </ThemedText>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  SearchContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 16,
    backgroundColor: 'transparent',
  },
  cardWrapper: {
    paddingHorizontal: 16,
    gap: 16,
  },
  imageWrapper: {
    width: '100%',
    height: '88%',
    borderRadius: 10,
    position: 'absolute',
    top: 0,
  },
  cardTextContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderRadius: 10,
    padding: 16,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },

  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    margin: 0,
    borderRadius: '50%',
  },
});

export default AccommodationDirectory;
