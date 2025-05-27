import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Dimensions, Image, Platform, ScrollView, StyleSheet, View } from "react-native";

import PressableButton from "@/components/PressableButton";
import TabSwitcher from "@/components/TabSwitcherComponent";
import { useAccommodation } from "@/context/AccommodationContext";
import Details from "./details";
import Photos from "./photos";
import Ratings from "./ratings";

const { width, height } = Dimensions.get("window");

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
    "Poppins-Medium": require("@/assets/fonts/Poppins/Poppins-Medium.ttf"),
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

  const statusBar = () => {
    if (Platform.OS === "ios") {
      return <StatusBar style="light" translucent backgroundColor="transparent" />;
    } else {
      return <></>;
    }
  };

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
    <View style={{ height: "100%" }}>
      <ScrollView style={{ marginBottom: 40 }}>
        {statusBar()}
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: foundRoom.roomImage }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={{ padding: 16 }}>
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
            <Ratings roomId={Array.isArray(id) ? id[0] : id} />
          </View>
        </View>
      </ScrollView>

      {activeTab !== "ratings" && (
        <View style={[styles.buttonContainer, Platform.OS === "android" && { marginBottom: 46 },]}>
          <PressableButton
            Title="Book Now"
            type="primary"
            color="#fff"
            height={50}
            TextSize={16}
            onPress={() => { }}
            style={{ flex: 1 }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 16,
    backgroundColor: "transparent",
    marginBottom: 80,
  },
  image: {
    width: width * 1,
    height: height * 0.40
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