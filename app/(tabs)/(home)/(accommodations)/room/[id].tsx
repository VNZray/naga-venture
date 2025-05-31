import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  View
} from "react-native";

import BookingFormPopup from "@/components/BookingFormPopUp";
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
  const [isBookingFormVisible, setBookingFormVisible] = useState(false);

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

  const statusBar = Platform.OS === "ios"
    ? <StatusBar style="light" translucent backgroundColor="transparent" />
    : null;

  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return <Details roomId={roomId} />;
      case "photos":
        return <Photos roomId={roomId} />;
      case "ratings":
        return <Ratings roomId={Array.isArray(id) ? id[0] : id} />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={[]}
        keyExtractor={() => "header"}
        renderItem={() => null}
        ListHeaderComponent={
          <>
            {statusBar}
            <Image
              source={{ uri: foundRoom.roomImage }}
              style={styles.image}
              resizeMode="cover"
            />

            <View style={{ padding: 16 }}>
              <View style={styles.header}>
                <View>
                  <ThemedText type="profileTitle">
                    Room {foundRoom.roomNumber}
                  </ThemedText>
                  <ThemedText type="default2">
                    <MaterialCommunityIcons name="star" size={16} color="#FFB007" />{" "}
                    {foundRoom.ratings}
                  </ThemedText>
                </View>
                <View>
                  <ThemedText type="default">
                    ₱ {foundRoom.roomPrice.toFixed(2)}
                  </ThemedText>
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

            <View style={styles.tabContent}>{renderTabContent()}</View>

            <BookingFormPopup
              visible={isBookingFormVisible}
              onClose={() => setBookingFormVisible(false)}
              roomPrice={foundRoom.roomPrice}
            />
          </>
        }
      />

      {activeTab !== "ratings" && (
        <View style={[
          styles.buttonContainer,
          Platform.OS === "android" && { marginBottom: 46 },
        ]}>
          <PressableButton
            Title="Book Now"
            type="primary"
            color="#fff"
            height={50}
            TextSize={16}
            onPress={() => setBookingFormVisible(true)}
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
    width: width,
    height: height * 0.4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  tabContent: {
    paddingTop: 0,
    padding: 16,
    marginBottom: 150,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default RoomProfile;
