import { rooms } from "@/app/Controller/AccommodationData";
import Amenities from '@/components/Amenities';
import CardContainer from '@/components/CardContainer';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from "@/hooks/useColorScheme";
import { View } from 'react-native';

const Details = ({ roomId }) => {

    const room = rooms.find(
      (acc) => acc.id.toString() === roomId.toString()
    );
  
    if (!room) {
      return (
        <View>
          <ThemedText>Room not found.</ThemedText>
          <Link href={"/(home)/"}>
            <ThemedText type="link">Go Home</ThemedText>
          </Link>
        </View>
      );
    }

  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "#fff" : "#000";

  return (
    <View>
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
          {room.description.replace(/^"|"$/g, "").trim()}
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
            title={"TV"}
            icon={"television"}
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
            title={"CR"}
            icon={"bathtub"}
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
        </View>
      </View>
    </View>
  )
}

export default Details