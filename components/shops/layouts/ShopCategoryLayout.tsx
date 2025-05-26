// Shop-specific Category Layout Component
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ShopCategoryLayoutProps {
  children: React.ReactNode;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryTitle: string;
  emptyMessage?: string;
  showEmptyState?: boolean;
}

/**
 * ShopCategoryLayout - Composition component for shop category pages
 * 
 * This layout handles:
 * - Category page structure (SafeAreaView, StatusBar, Search)
 * - Search functionality specific to categories
 * - Empty state display
 * - Main content area via children prop
 * 
 * Used specifically by: Shop category pages
 */
export const ShopCategoryLayout: React.FC<ShopCategoryLayoutProps> = ({
  children,
  searchQuery,
  onSearchChange,
  categoryTitle,
  emptyMessage = "No items found",
  showEmptyState = false,
}) => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const backgroundColor = colorScheme === "dark" ? "#0A1B47" : "#F8F8F8";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder={`Search ${categoryTitle.toLowerCase()}...`}
            placeholderTextColor={
              colorScheme === "dark" ? "#8E9196" : "#9F9EA1"
            }
            value={searchQuery}
            onChangeText={onSearchChange}
          />
          <TouchableOpacity 
            style={[
              styles.searchButton, 
              { backgroundColor: colorScheme === "dark" ? "#152A5E" : "#0077B6" }
            ]}
          >
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Area */}
      {showEmptyState ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="information-circle-outline" size={40} color="gray" />
          <Text style={[styles.emptyText, { color: textColor }]}>
            {emptyMessage}
          </Text>
        </View>
      ) : (
        children
      )}
    </SafeAreaView>
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
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: "#0077B6",
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: "gray",
  },
});

export default ShopCategoryLayout;
