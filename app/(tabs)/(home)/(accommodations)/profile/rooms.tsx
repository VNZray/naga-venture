import { rooms as allRooms } from "@/app/Controller/AccommodationData";
import RoomCard from "@/components/RoomCard";
import { ThemedText } from "@/components/ThemedText";
import { useAccommodation } from "@/context/AccommodationContext";
import { Link } from "expo-router";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";

const screenWidth = Dimensions.get("window").width;

type RoomsProps = {
  accommodationId: number | string;
};

const Rooms = ({ accommodationId }: RoomsProps) => {
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
          <Link href={`/room/${room.id}`} key={room.id}>
            <RoomCard
              key={room.id}
              roomNumber={room.roomNumber}
              status={room.status}
              capacity={room.capacity}
              roomPrice={room.roomPrice}
              elevation={3}
              background="#fff"
              imageUri={room.roomImage}
              style={styles.card}
            />
          </Link>
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
    paddingTop: 0,
    gap: 16,
    padding: 16
  },
  card: {
    width: 195,
    marginBottom: 16,
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
