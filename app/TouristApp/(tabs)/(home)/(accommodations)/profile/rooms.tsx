import RoomCard from "@/components/RoomCard";
import { ThemedText } from "@/components/ThemedText";
import { useAccommodation } from "@/context/AccommodationContext";
import { rooms as allRooms } from "@/Controller/AccommodationData";
import { Link } from "expo-router";
import { Dimensions, StyleSheet, View } from "react-native";

type RoomsProps = {
  accommodationId: number | string;
};

const screenWidth = Dimensions.get("window").width;

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
    <View style={styles.container}>
      <View style={styles.grid}>
        {rooms.map((room) => (
          <Link href={`/TouristApp/(tabs)/(home)/(accommodations)/room/${room.id}`} key={room.id}>
            <RoomCard
              key={room.id}
              roomNumber={room.roomNumber}
              status={room.status}
              capacity={room.capacity}
              roomPrice={room.roomPrice}
              ratings={room.ratings}
              elevation={3}
              background="#fff"
              imageUri={room.roomImage}
            />
          </Link>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "visible",
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 0,
    padding: 16,
    gap: 16,
  },
  card: {
    flex: 1,
  },
  emptyState: {
    padding: 20,
    alignItems: "center",
  },
});

export default Rooms;