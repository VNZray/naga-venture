import { ThemedText } from "@/components/ThemedText";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function SpotMoreImages({ images, onSeeAll }) {
  if (!images || images.length === 0) return null;
  return (
    <View style={styles.section}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>More Images</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((image, index) => (
          <View key={index} style={styles.additionalImageContainer}>
            <Image source={{ uri: image }} style={styles.additionalImage} />
          </View>
        ))}
        {images.length > 3 && onSeeAll && (
          <TouchableOpacity style={styles.seeAllButton} onPress={onSeeAll}>
            <ThemedText type="link" style={styles.seeAllText}>See All</ThemedText>
          </TouchableOpacity>
        )}
      </ScrollView>
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
  additionalImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 10,
  },
  additionalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  seeAllButton: {
    marginTop: 10,
  },
  seeAllText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
}); 