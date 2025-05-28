// Shop-specific Detail Layout Component
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

interface Shop {
  id: string | number;
  name: string;
  image: string;
  location?: string;
  [key: string]: any;
}

interface ShopDetailLayoutProps {
  children: React.ReactNode;
  shop: Shop;
  showBackButton?: boolean;
}

/**
 * ShopDetailLayout - Composition component for shop detail pages
 * 
 * This layout handles:
 * - Hero image section with back button
 * - Shop title and basic info
 * - Main content area via children prop
 * - Consistent styling across shop detail pages
 * 
 * Used specifically by: Shop detail pages
 */
export const ShopDetailLayout: React.FC<ShopDetailLayoutProps> = ({
  children,
  shop,
  showBackButton = true,
}) => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const backgroundColor = colorScheme === "dark" ? "#0A1B47" : "#F8F8F8";

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <ScrollView>
          {/* Header Image */}
          <View style={styles.headerImageContainer}>
            <Image source={{ uri: shop.image }} style={styles.headerImage} />
            {showBackButton && (
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>

          {/* Details Container */}
          <View style={[styles.detailsContainer, { backgroundColor }]}>
            <View style={styles.titleRow}>
              <Text style={[styles.shopTitle, { color: textColor }]}>
                {shop.name}
              </Text>
              {/* Favorite Button - Add functionality later */}
              <TouchableOpacity style={styles.favoriteButton}>
                <Ionicons name="heart-outline" size={24} color={textColor} />
              </TouchableOpacity>
            </View>

            {shop.location && (
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color="gray" />
                <Text style={styles.locationText}>{shop.location}</Text>
              </View>
            )}

            {/* Main Content */}
            {children}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  headerImageContainer: {
    height: 360,
    width: "100%",
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 15,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 10,
  },
  detailsContainer: {
    flex: 1,
    marginTop: -30,
    paddingTop: 5,
    padding: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  shopTitle: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  locationText: {
    fontSize: 14,
    color: "gray",
    marginLeft: 5,
  },
  favoriteButton: {
    padding: 10,
  },
});

export default ShopDetailLayout;
