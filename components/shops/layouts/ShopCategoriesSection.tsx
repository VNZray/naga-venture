// Shop-specific Categories Section Component
import CardContainer from '@/components/CardContainer';
import PressableButton from '@/components/PressableButton';
import { useColorScheme } from '@/hooks/useColorScheme';
import type { ShopCategory } from '@/types/shop';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface ShopCategoriesSectionProps {
  categories: ShopCategory[];
  onCategoryPress: (categoryId: string) => void;
  title?: string;
}

/**
 * ShopCategoriesSection - Shop-specific categories component
 * 
 * This component is tailored for shop categories and demonstrates composition by:
 * - Accepting shop category data via props
 * - Handling shop category press via callback
 * - Optimized for shop-specific display (shop count, shop icons)
 * - Using existing CardContainer and PressableButton components
 */
export const ShopCategoriesSection: React.FC<ShopCategoriesSectionProps> = ({
  categories,
  onCategoryPress,
  title = "Shop Categories",
}) => {
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "#fff" : "#000";

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color }]}>
        {title}
      </Text>
      <CardContainer style={styles.directories} height="auto">
        {categories.map((category) => (
          <PressableButton
            key={category.id}
            IconSize={24}
            color={color}
            direction="column"
            Title={category.name}
            Icon={category.icon}
            onPress={() => onCategoryPress(category.id)}
          />
        ))}
      </CardContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 15,
  },
  directories: {
    flex: 1,
    width: "100%",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ShopCategoriesSection;
