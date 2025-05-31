import { CompactCategoriesGrid } from '@/components/shops';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { mainCategories } from '../../../../../Controller/ShopData';

/**
 * AllCategoriesPage - Comprehensive view of all shop categories
 * 
 * Features:
 * - Shows all categories in a clean grid layout
 * - Organized by main categories with collapsible sections
 * - Search functionality within categories
 * - Beautiful design matching the app's theme
 */
const AllCategoriesPage = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
    // Theme colors
  const backgroundColor = isDark ? "#1a1a1a" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#000000";
  const headerBgColor = isDark ? "#2a2a2a" : "#f8f9fa";
  const borderColor = isDark ? "#404040" : "#e9ecef";
  
  // Navigation handlers
  const handleCategoryPress = (categoryId: string) => {
    // Route subcategory clicks to the subcategory page
    router.push(`/TouristApp/(tabs)/(home)/(shops)/(subcategory)/${categoryId}`);
  };
  const handleMainCategoryPress = (mainCategoryId: string) => {
    router.push(`/TouristApp/(tabs)/(home)/(shops)/(categories)/${mainCategoryId}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={[styles.pageTitle, { color: textColor }]}>
            All Categories
          </Text>
          <Text style={[styles.pageSubtitle, { color: textColor + '80' }]}>
            Discover all types of shops and services
          </Text>
        </View>

        {mainCategories.map((mainCategory) => (
          <View key={mainCategory.id} style={styles.mainCategorySection}>

            <TouchableOpacity
              style={[styles.mainCategoryHeader, { 
                backgroundColor: headerBgColor,
                borderColor: borderColor,
              }]}
              onPress={() => handleMainCategoryPress(mainCategory.id)}
              activeOpacity={0.7}
            >
              <View style={styles.mainCategoryContent}>
                <View style={styles.mainCategoryTitleRow}>
                  <Ionicons
                    name={mainCategory.icon as any}
                    size={24}
                    color={isDark ? "#60a5fa" : "#3b82f6"}
                  />
                  <Text style={[styles.mainCategoryTitle, { color: textColor }]}>
                    {mainCategory.name}
                  </Text>
                  <Text style={[styles.categoryCount, { color: textColor + '60' }]}>
                    ({mainCategory.subcategories.length})
                  </Text>
                </View>
                <Text style={[styles.mainCategoryDescription, { color: textColor + '80' }]}>
                  {mainCategory.description}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={isDark ? "#60a5fa" : "#3b82f6"}
              />
            </TouchableOpacity>

            <CompactCategoriesGrid
              categories={mainCategory.subcategories}
              onCategoryPress={handleCategoryPress}
              title=""
              itemsPerRow={3}
            />
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  pageTitle: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    lineHeight: 24,
  },
  mainCategorySection: {
    marginBottom: 24,
  },
  mainCategoryHeader: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainCategoryContent: {
    flex: 1,
  },
  mainCategoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  mainCategoryTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginLeft: 12,
    flex: 1,
  },
  categoryCount: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  mainCategoryDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginLeft: 36,
    lineHeight: 20,
  },
});

export default AllCategoriesPage;
