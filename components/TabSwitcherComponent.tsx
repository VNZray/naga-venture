import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useFonts } from "expo-font";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type TabSwitcherTab = {
  key: string;
  label: string;
};

type TabSwitcherProps = {
  tabs: TabSwitcherTab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  color: string;
  active: string;
};

const TabSwitcher = ({ tabs, activeTab, onTabChange, color, active }: TabSwitcherProps) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const borderColor = colorScheme === "dark" ? "#F8F8F8" : active;

  const [fontsLoaded] = useFonts({
    "Poppins-Black": require("@/assets/fonts/Poppins/Poppins-Black.ttf"),
    "Poppins-Regular": require("@/assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("@/assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.tabsContainer}>
      {tabs.map((tab: TabSwitcherTab) => (
      <TouchableOpacity
        key={tab.key}
        onPress={() => onTabChange(tab.key)}
        style={[
        styles.tab,
        {
          backgroundColor: themeColors.background,
          shadowColor: borderColor,
          shadowOpacity: borderColor ? 0.1 : 0.2,
          shadowOffset: { width: 4, height: 4 },
          shadowRadius: 3,
          elevation: 4, // <-- Android shadow
        },
        activeTab === tab.key && {
          borderWidth: 0.2,
          borderColor: active,
          backgroundColor: active,
          elevation: 6, // <-- Higher elevation for active tab on Android
          shadowColor: active, // Darker shadow for active on iOS
          shadowOpacity: borderColor ? 0.1 : 0.2,
          shadowOffset: { width: 4, height: 4 },
          shadowRadius: 3,
        },
        ]}
      >
        <ThemedText
        type="tabText"
        style={[
          {
          color: activeTab === tab.key ? "#fff" : color,
          },
        ]}
        >
        {tab.label}
        </ThemedText>
      </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
});

export default TabSwitcher;
