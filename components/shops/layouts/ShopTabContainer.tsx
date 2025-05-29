// Shop-specific tab container for detail pages
import { useColorScheme } from '@/hooks/useColorScheme';
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ShopTabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface ShopTabContainerProps {
  tabs: ShopTabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

/**
 * ShopTabContainer - Shop-specific tab component
 * 
 * This demonstrates composition for shop detail pages:
 * - Each tab's content is passed as React.ReactNode (children-like pattern)
 * - The component focuses on tab behavior for shop details
 * - Shop-themed styling
 * - Used specifically for shop detail pages (details, reviews, photos, etc.)
 */
const ShopTabContainer: React.FC<ShopTabContainerProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === "dark" ? "#1E293B" : "#f0f0f0";
  const activeBackgroundColor = colorScheme === "dark" ? "#0077B6" : "#0077B6";
  const textColor = colorScheme === "dark" ? "#fff" : "#666";
  const activeTextColor = "#fff";

  return (
    <View style={styles.container}>
      {/* Tab Headers */}
      <View style={[styles.tabsContainer, { backgroundColor }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              activeTab === tab.id && {
                backgroundColor: activeBackgroundColor,
              },
            ]}
            onPress={() => onTabChange(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab.id ? activeTextColor : textColor },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    marginVertical: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  tabContent: {
    flex: 1,
  },
});

export default ShopTabContainer;
