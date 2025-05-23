import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";

import TabSwitcher from "@/components/TabSwitcherComponent";
import { useAccommodation } from "@/context/AccommodationContext";
import Details from "./details";
import Photos from "./photos";
import Ratings from "./ratings";

const RoomProfile = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("details");
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "#fff" : "#000";
  const activeBackground = "#0A1B47";

  const [fontsLoaded] = useFonts({
    "Poppins-Black": require("@/assets/fonts/Poppins/Poppins-Black.ttf"),
    "Poppins-Regular": require("@/assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("@/assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

  const { filteredAccommodations } = useAccommodation();

  const roomId = parseInt(id?.toString() ?? "", 10);

  let foundRoom = null;
  let parentAccommodation = null;

  for (const accommodation of filteredAccommodations) {
    const room = accommodation.rooms.find((room) => room.id === roomId);
    if (room) {
      foundRoom = room;
      parentAccommodation = accommodation;
      break;
    }
  }

  useEffect(() => {
    if (foundRoom) {
      navigation.setOptions({
        headerTitle: `Room ${foundRoom.roomNumber}`,
      });
    }
  }, [navigation, foundRoom]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#fff" }} />;
  }

  if (!foundRoom || !parentAccommodation) {
    return (
      <View style={styles.centered}>
        <ThemedText type="profileTitle">Room not found.</ThemedText>
        <ThemedText type="subtitle2" style={{ textAlign: "center" }}>
          Please go back and select a valid Room.
        </ThemedText>
        <Link href={"/(home)/"}>
          <ThemedText type="link">Go Home</ThemedText>
        </Link>
      </View>
    );
  }

  return (
    <ScrollView>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: foundRoom.roomImage }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <ThemedText type="profileTitle">Room {foundRoom.roomNumber}</ThemedText>
            <ThemedText type="default2">
              <MaterialCommunityIcons name="star" size={16} color="#FFB007" />{" "}
              {foundRoom.ratings}
            </ThemedText>
          </View>
          <View>
            <ThemedText type="default">₱ {foundRoom.roomPrice.toFixed(2)}</ThemedText>
            <ThemedText type="default2">Per Night</ThemedText>
          </View>
        </View>

        <TabSwitcher
          tabs={[
            { key: "details", label: "Details" },
            { key: "photos", label: "Photos" },
            { key: "ratings", label: "Ratings" },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          color={color}
          active={activeBackground}
        />
      </View>

      <View style={styles.tabContent}>
        <View style={{ display: activeTab === "details" ? "flex" : "none" }}>
          <Details roomId={roomId} />
        </View>
        <View style={{ display: activeTab === "photos" ? "flex" : "none" }}>
          <Photos roomId={roomId} />
        </View>
        <View style={{ display: activeTab === "ratings" ? "flex" : "none" }}>
          <Ratings roomId={roomId} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 360,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  tabContent: {
    paddingTop: 0,
    padding: 16,
    marginBottom: 100,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default RoomProfile;