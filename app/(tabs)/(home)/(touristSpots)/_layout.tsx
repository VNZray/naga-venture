import { Stack } from "expo-router";
import { FC } from "react";

const TouristSpotsLayout: FC = () => {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerShown: true,
        headerTitle: "Tourist Spots",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          animation: "slide_from_right",
          headerTitleAlign: "center",
          headerTitle: "Tourist Spots",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="(categories)/[category]"
        options={{
          headerTitle: "Category",
          animation: "slide_from_right",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="(spots)/[spotId]"
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
};

export default TouristSpotsLayout; 