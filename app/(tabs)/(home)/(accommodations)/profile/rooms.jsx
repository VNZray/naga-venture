import { rooms as allRooms } from "@/app/Controller/AccommodationData";
import RoomCard from "@/components/RoomCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAccommodation } from "@/context/AccommodationContext";
import { Link } from "expo-router";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";

const screenWidth = Dimensions.get("window").width;

const Rooms = ({ accommodationId }) => {
  const { filteredAccommodations } = useAccommodation();

  const accommodation = filteredAccommodations.find(
    (acc) => acc.id === Number(accommodationId)
  );

  if (!accommodation) {
    return (
      <View style={styles.emptyState}>
        <ThemedText type="subtitle">Accommodation not found.</ThemedText>
      </View>
    );
  }

  // Filter rooms for this accommodation from the global rooms array
  const rooms = allRooms.filter(
    (room) => room.accommodationId === accommodation.id
  );

  if (rooms.length === 0) {
    return (
      <View style={styles.emptyState}>
        <ThemedText type="subtitle">
          No rooms available for this accommodation.
        </ThemedText>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.grid}>
        {rooms.map((room) => (
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
    padding: 16,
    paddingTop: 0,
  },
  card: {
    width: (screenWidth - 48) / 2,
    marginBottom: 16, // fallback if gap not supported
    overflow: "visible",
  },
  info: {
    padding: 10,
    borderRadius: 16,
  },
  emptyState: {
    padding: 20,
    alignItems: "center",
  },
});

export default Rooms;
