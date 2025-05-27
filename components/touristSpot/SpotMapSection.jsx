import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

export default function SpotMapSection({ mapLocation, address, iconColor }) {
  if (!mapLocation) return null;
  return (
    <View style={styles.section}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>Location</ThemedText>
      <View style={styles.mapContainer}>
        <Ionicons name="map-outline" size={40} color={iconColor} />
        {mapLocation.latitude && mapLocation.longitude && (
          <ThemedText type="default2" style={styles.mapText}>Map here</ThemedText>
        )}
        {address && (
          <ThemedText type="default2" style={styles.mapAddress}>{address}</ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  mapContainer: {
    height: 150,
    backgroundColor: "#eee",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  mapText: {
    marginLeft: 10,
    color: "gray",
  },
  mapAddress: {
    marginTop: 5,
    fontSize: 12,
    color: "gray",
  },
}); 