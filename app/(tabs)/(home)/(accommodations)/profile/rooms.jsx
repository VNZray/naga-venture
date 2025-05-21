import { accommodations } from "@/app/Controller/AccommodationData";
import RoomCard from "@/components/RoomCard";
import { ThemedText } from "@/components/ThemedText";
import { Link } from "expo-router";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

const screenWidth = Dimensions.get("window").width;

import { ThemedView } from "@/components/ThemedView";

const Rooms = ({ accommodationId }) => {
  const selectedAccommodation = accommodations.find(
    (acc) => acc.id === Number(accommodationId)
  );

  if (!selectedAccommodation) {
    return (
      <View style={styles.container}>
        <Text>Accommodation not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.grid}>
        {selectedAccommodation.rooms.map((room) => (
          <RoomCard
            key={room.id}
            elevation={3}
            background="#fff"
            imageUri={room.roomImage}
            style={styles.card}
          >
            <Link href={`/room/${room.id}`} key={room.id}>
              <ThemedView style={styles.info}>
                <ThemedText type="cardBoldSubTitle">
                  Room {room.roomNumber}
                </ThemedText>
                <ThemedText type="cardSubTitle">
                  Status: {room.status}
                </ThemedText>
                <ThemedText type="cardSubTitle">
                  Capacity: {room.capacity}
                </ThemedText>
                <ThemedText type="cardSubTitle">
                  Price: ₱{room.roomPrice.toFixed(2)}
                </ThemedText>
              </ThemedView>
            </Link>
          </RoomCard>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "visible",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16, // only works with React Native 0.71+
    overflow: "visible",
    padding: 16,
    paddingTop: 0
  },
  card: {
    width: (screenWidth - 48) / 2, // screen width minus paddings & spacing
    borderRadius: 8,
        overflow: "visible",
  },
  info: {
    padding: 10,
  },
});

export default Rooms;
