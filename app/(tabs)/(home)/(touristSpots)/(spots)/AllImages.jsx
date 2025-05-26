import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet } from "react-native";

export default function AllImagesScreen() {
  const { images } = useLocalSearchParams();
  const imageList = typeof images === "string" ? images.split(",") : [];

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.grid}>
        {imageList.map((img, idx) => (
          <Image key={img + idx} source={{ uri: img }} style={styles.image} />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "column",
    alignItems: "center",
    gap: 1,
  },
  image: {
    width: "100%",
    height: 360, 
    borderRadius: 10,
    marginBottom: 10,
  },
});