import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Import the central data
import { touristSpotsData } from '../data';

const CategoryPage = () => {
  const { category: categoryId } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? '#fff' : '#000';
  const backgroundColor = colorScheme === 'dark' ? '#0A1B47' : '#F8F8F8';
  const cardBackgroundColor = colorScheme === 'dark' ? '#1E293B' : '#fff';
  const shadowColor = colorScheme === 'dark' ? '#000' : '#ccc';

  // Define category title based on categoryId
  const getCategoryTitle = (id) => {
    switch (id) {
      case "historical":
        return "Historical Places";
      case "natural":
        return "Natural Wonders";
      case "urban":
        return "Urban Attractions";
      case "museums":
        return "Museums & Galleries";
      case "resorts":
        return "Resorts & Recreation";
      default:
        return "Places";
    }
  };

  // Filter tourist spots based on the categoryId
  const categoryItems = Object.values(touristSpotsData).filter(
    (item) => item.category === categoryId
  );

  const handleBackClick = () => {
    router.back();
  };

  const handleItemClick = (itemId) => {
    router.push(`/(tabs)/(home)/(touristSpots)/spot/${itemId}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#fff', shadowColor }]}>
        <Text style={[styles.title, { color: textColor, textAlign: "center"}]}>
          {getCategoryTitle(categoryId)}
        </Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {categoryItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleItemClick(item.id)}
            style={[styles.itemContainer, { backgroundColor: cardBackgroundColor, shadowColor }]}
          >
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={[styles.itemName, { color: textColor }]}>{item.name}</Text>
              <Text style={[styles.itemDescription, { color: textColor }]}>{item.description}</Text>
              <View style={styles.itemFooter}>
                <View style={styles.location}>
                  <Ionicons name="location" size={16} color="#007AFF" />
                  <Text style={styles.locationText}>Naga City</Text>
                </View>
                <View style={styles.detailsButton}>
                  <Text style={styles.detailsButtonText}>View Details</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Navigation Placeholder */}
      <View style={styles.bottomNav}>
        <Text style={{ color: textColor }}>Bottom Navigation Placeholder</Text>
        {/* Integrate your bottom navigation here */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  content: {
    padding: 10,
    paddingBottom: 100,
  },
  itemContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  itemImage: {
    width: '100%',
    height: 200,
  },
  itemDetails: {
    padding: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 5,
    color: '#007AFF',
    fontSize: 12,
  },
  detailsButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  detailsButtonText: {
    color: '#333',
    fontSize: 12,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

export default CategoryPage;