import { Stack } from "expo-router";

const ShopDirectoryLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerShown: true,
        headerTitleAlign: "center",
        headerTitle: "Shop Directory",
      }}
    >
      <Stack.Screen
        name="(categories)/[category]"
        options={{
          headerShown: true,
          animation: "slide_from_right",
          headerTitleAlign: "center",
          headerTitle: "Shop Categories",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="(details)/[shopId]"
        options={{
          headerShown: false,
          animation: "slide_from_right",
          headerTitleAlign: "center",
          headerTitle: "Shop Details",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}   
export default ShopDirectoryLayout;
// This layout file sets up the navigation structure for the shop directory,