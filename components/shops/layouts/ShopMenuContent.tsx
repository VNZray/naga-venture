// Shop-specific Menu Content Component
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface MenuItem {
  item: string;
  price: string;
}

interface Shop {
  menu?: MenuItem[];
  [key: string]: any;
}

interface ShopMenuContentProps {
  shop: Shop;
}

/**
 * ShopMenuContent - Shop-specific menu content component
 * 
 * This component handles the "Menu" tab content including:
 * - Menu items display
 * - Pricing information
 * - Empty state when no menu available
 */
export const ShopMenuContent: React.FC<ShopMenuContentProps> = ({
  shop,
}) => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "#fff" : "#000";

  return (
    <View style={styles.menuTab}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Menu & Offerings
        </Text>
        {shop.menu && shop.menu.length > 0 ? (
          shop.menu.map((item, index) => (
            <View key={index} style={styles.menuItem}>
              <Text style={[styles.menuItemName, { color: textColor }]}>
                {item.item}
              </Text>
              <Text style={styles.menuItemPrice}>
                {item.price}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ color: "gray" }}>Menu not available.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menuTab: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemName: {
    fontSize: 16,
    flex: 1,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
});

export default ShopMenuContent;
