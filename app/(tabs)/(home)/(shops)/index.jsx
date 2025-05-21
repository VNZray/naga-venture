import { FeaturedShops, ShopCategories } from '@/app/Controller/ShopData';
import CardView from '@/components/CardView';
import SearchBar from '@/components/SearchBar';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

const width = Dimensions.get('window').width;

const ShopDirectory = () => {
  const [search, setSearch] = useState('');
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          onSearch={() => {}}
          placeholder="Search"
        />
      </View>

      <ScrollView>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Featured Shops</ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredContainer}
          >
            {FeaturedShops.slice(0, 6).map((shop) => (
              <CardView
                key={shop.id}
                width={width * 0.75}
                height={180}
                radius={8}
                elevation={2}
                style={styles.featuredCard}
              >
                <Image 
                  source={{ uri: shop.image }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.shopInfo}>
                  <ThemedText type="cardTitle">{shop.name}</ThemedText>
                  <ThemedText type="cardSubTitle">{shop.location}</ThemedText>
                </View>
              </CardView>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Explore Categories</ThemedText>
          <View style={styles.categoriesContainer}>
            {ShopCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => router.push(`/(tabs)/(home)/(shops)/${category.name.toLowerCase()}`)}
              >
                <View style={styles.categoryIcon}>
                  <FontAwesome name={category.icon} size={24} color="#666" />
                </View>
                <ThemedText style={styles.categoryText}>{category.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.headerRow}>
            <ThemedText style={styles.sectionTitle}>Discover More</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.seeAll}>See all</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.discoverContainer}>
            {FeaturedShops.slice(6, 9).map((shop) => (
              <CardView
                key={shop.id}
                width={width - 32}
                height={160}
                radius={8}
                elevation={2}
              >
                <Image 
                  source={{ uri: shop.image }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.shopInfo}>
                  <ThemedText type="cardTitle">{shop.name}</ThemedText>
                  <ThemedText type="cardSubTitle">{shop.location}</ThemedText>
                </View>
              </CardView>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  featuredContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  featuredCard: {
    marginRight: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: 'center',
    gap: 8,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    fontSize: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
    marginBottom: 12,
  },
  seeAll: {
    color: '#007AFF',
    fontSize: 14,
  },
  discoverContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  shopInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    position: 'absolute',
  },
});

export default ShopDirectory;