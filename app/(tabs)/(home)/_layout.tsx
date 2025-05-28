import { Stack } from "expo-router";

const HomeLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerShown: true,
        headerTitle: "Naga Venture",
      }}
    >
      <Stack.Screen
        name="(accommodations)"
        options={{
          headerShown: false,
          animation: "slide_from_right",
          headerTitleAlign: "center",
          headerTitle: "Accommodation Directory",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="(events)"
        options={{
          headerShown: false,
          animation: "slide_from_right",
          headerTitleAlign: "center",
          headerTitle: "Event Directory",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="(shops)"
        options={{
          headerShown: false,
          animation: "slide_from_right",
          headerTitleAlign: "center",
          headerTitle: "Shop Directory",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="(touristSpots)"
        options={{
          headerShown: false,
          animation: "slide_from_right",
          headerTitleAlign: "center",
          headerTitle: "Tourist Spots",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="(touristSpots)/(categories)/[category]"
        options={{
          headerTitle: "Category",
          animation: "slide_from_right",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="(touristSpots)/(spots)/[spotId]"
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
};

export default HomeLayout;
