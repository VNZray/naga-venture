// Shop-specific Directory Layout using composition patterns
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

interface ShopDirectoryLayoutProps {
  children: React.ReactNode;
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showFeaturedSection?: boolean;
  featuredTitle?: string;
  featuredContent?: React.ReactNode;
}

/**
 * ShopDirectoryLayout - Composition component for shop directory pages
 * 
 * This layout handles:
 * - Common shop directory structure (SafeAreaView, StatusBar, Search)
 * - Featured shops section (carousel area)
 * - Main content area via children prop
 * 
 * Used specifically by: Shop directory and related shop pages
 */
export const ShopDirectoryLayout: React.FC<ShopDirectoryLayoutProps> = ({
  children,
  searchPlaceholder = "Search shops...",
  searchQuery = "",
  onSearchChange,
  showFeaturedSection = true,
  featuredTitle = "Featured Shops",
  featuredContent,
}) => {
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "#fff" : "#000";
  const backgroundColor = colorScheme === "dark" ? "#0A1B47" : "#F8F8F8";

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor }]}
        edges={["top"]}
      >
        <StatusBar
          barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        />
        
        {/* Search Section */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={[styles.searchInput, { color: color }]}
              placeholder={searchPlaceholder}
              placeholderTextColor={
                colorScheme === "dark" ? "#8E9196" : "#9F9EA1"
              }
              value={searchQuery}
              onChangeText={onSearchChange}
            />
            <TouchableOpacity
              style={[
                styles.searchButton,
                {
                  backgroundColor:
                    colorScheme === "dark" ? "#152A5E" : "#0077B6",
                },
              ]}
            >
              <Ionicons name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Featured Section - Only show when not searching and enabled */}
          {!searchQuery.trim() && showFeaturedSection && featuredContent && (
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { color: color }]}>
                {featuredTitle}
              </Text>
              <View style={{ height: 200 }}>
                {featuredContent}
              </View>
            </View>
          )}

          {/* Main Content Area - Uses composition via children prop */}
          {children}
          
          {/* Bottom spacing for tab navigation */}
          <View style={{ height: 100 }} />
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 15,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: "#0077B6",
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 15,
  },
});

export default ShopDirectoryLayout;
