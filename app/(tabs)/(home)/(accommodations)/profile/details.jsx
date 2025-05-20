import { accommodations } from "@/app/Controller/AccommodationData";
import Amenities from "@/components/Amenities";
import CardContainer from "@/components/CardContainer";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFonts } from "expo-font";
import { Link } from "expo-router";
import { View } from "react-native";
const Details = ({ accommodationId }) => {
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "#fff" : "#000";

  const [fontsLoaded] = useFonts({
    "Poppins-Black": require("@/assets/fonts/Poppins/Poppins-Black.ttf"),
    "Poppins-Regular": require("@/assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("@/assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) return null;

  const accommodation = accommodations.find(
    (acc) => acc.id.toString() === accommodationId.toString()
  );

  if (!accommodation) {
    return (
      <View>
        <ThemedText>Accommodation not found.</ThemedText>
        <Link href={"/(home)/"}>
          <ThemedText type="link">Go Home</ThemedText>
        </Link>
      </View>
    );
  }

  return (
    <View style={{padding: 16, paddingTop: 0}}>
      <CardContainer
        elevation={2}
        style={{
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <ThemedText type="cardTitle">Description</ThemedText>
        <ThemedText type="default2">
          {accommodation.Description.replace(/^"|"$/g, "").trim()}
        </ThemedText>
      </CardContainer>

      <View style={{ marginTop: 16 }}>
        <ThemedText type="cardTitle">Amenities</ThemedText>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 16,
            paddingLeft: 0,
            paddingRight: 0,
          }}
        >
          <Amenities
            title={"Parking"}
            icon={"car"}
            iconSize={32}
            color={color}
            textSize={14}
          />
          <Amenities
            title={"WIFI"}
            icon={"wifi"}
            iconSize={32}
            color={color}
            textSize={14}
          />
          <Amenities
            title={"Laundy"}
            icon={"washing-machine"}
            iconSize={32}
            color={color}
            textSize={14}
          />
          <Amenities
            title={"AC"}
            icon={"air-conditioner"}
            iconSize={32}
            color={color}
            textSize={14}
          />
          <Amenities
            title={"Bar"}
            icon={"glass-wine"}
            iconSize={32}
            color={color}
            textSize={14}
          />
        </View>
      </View>

            <View style={{ marginTop: 16 }}>
        <ThemedText type="cardTitle">Guide Map</ThemedText>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 16,
            paddingLeft: 0,
            paddingRight: 0,
          }}
        >
        <ThemedText type="default">Currently Working On</ThemedText>

        </View>
      </View>
    </View>
  );
};

export default Details;
