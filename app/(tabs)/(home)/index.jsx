import CardContainer from "@/components/CardContainer";
import CardView from "@/components/CardView";
import PressableButton from "@/components/PressableButton";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { FeaturedLocation } from "../../Controller/HomeData";


const width = Dimensions.get("screen").width;

const HomeScreen = () => {
  const { user } = useAuth();

  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "#fff" : "#000";
  const backgroundColor = colorScheme === "dark" ? "#151718" : "#FFFFFF";
  const isDarkMode = colorScheme === "dark";

  const ref = React.useRef(null);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!user) {
      router.replace("/(screens)/LoginPage");
    }
  }, [user]);

  if (!user) return null;

  const mobilePlatform = (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
          </View>
          <View style={{ flex: 1, width: width }}>
            <Carousel
              style={{ borderRadius: 10 }}
              ref={ref}
              width={width}
              height={260}
              data={FeaturedLocation}
              onProgressChange={progress}
              renderItem={({ item }) => (
                <View style={styles.carouselItem}>
                  <Image
                    source={{ uri: item.uri }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
              )}
            />
          </View>

          <View
            style={{
              flex: 1,
              paddingLeft: 16,
              paddingTop: 0,
              paddingRight: 16,
              paddingBottom: 0,
            }}
          >
            <CardContainer
              elevation={2}
              style={[styles.directories]}
              height={"auto"}
            >
              <PressableButton
                IconSize={24}
                color={color}
                direction="column"
                Title="Place to stay"
                Icon="hotel"
                onPress={() => router.push("/(tabs)/(home)/(accommodations)/")}
              ></PressableButton>

              <PressableButton
                IconSize={24}
                color={color}
                direction="column"
                Title="Shops"
                Icon="shopping-bag"
                onPress={() => router.push("/(tabs)/(home)/(shops)/")}
              ></PressableButton>

              <PressableButton
                IconSize={24}
                color={color}
                direction="column"
                Title="Tourist Spots"
                Icon="map-marker"
                onPress={() => router.push("/(tabs)/(home)/(touristSpots)")}
              ></PressableButton>

              <PressableButton
                IconSize={24}
                color={color}
                direction="column"
                Title="Events"
                Icon="calendar"
                onPress={() => router.push("/(tabs)/(home)/EventDirectory")}
              ></PressableButton>
            </CardContainer>
          </View>

          <View
            style={{
              displat: "flex",
              width: width,
              marginBottom: 70,
              padding: 16,
            }}
          >
            <CardView height={350} radius={10} elevation={0}>
              <View
                style={{
                  width: "100%",
                  height: "85%",
                  borderRadius: 10,
                  position: "absolute",
                  top: 0,
                  paddingTop: 16,
                }}
              >
                <Image
                  source={{
                    uri: "https://i0.wp.com/nagayon.com/wp-content/uploads/1624/08/mary-coredemtrix-church.jpg?resize=768%2C432&ssl=1",
                  }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
              <View
                style={[
                  styles.cardTextContainer,
                  {
                    backgroundColor: backgroundColor,
                    shadowColor: isDarkMode ? "#f3f3f3" : "#000000",
                    shadowOpacity: isDarkMode ? 0 : 0.2,
                    shadowOffset: { width: 0, height: 0 },
                    shadowRadius: 6,
                  },
                ]}
              >
                <ThemedText type="cardTitle">
                  Mary Coredemtrix Church
                </ThemedText>
                <ThemedText type="cardSubTitle">
                  Naga City, Philippines
                </ThemedText>
                <ThemedText style={{ color: "#FF5310" }} type="cardSubTitle">
                  10:00 AM - 10:00 PM
                </ThemedText>
              </View>
            </CardView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );

  const webPlatfrom = (
    <div style={{ flex: 1 }}>
      <header>
        <h1 style={{ color: color }}>Welcome to Naga Venture</h1>
        <p style={{ color: color }}>Explore the best of Naga City</p>
      </header>
    </div>
  );

  if (Platform.OS === "web") {
    return webPlatfrom;
  }
  return mobilePlatform;
};

const styles = StyleSheet.create({
  text: {},
  cardTextContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderRadius: 10,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 5,
    justifyContent: "center",
  },

  carouselItem: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
    padding: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },

  directories: {
    flex: 1,
    width: "100%",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default HomeScreen;
