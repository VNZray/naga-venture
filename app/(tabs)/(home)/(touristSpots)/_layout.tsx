<<<<<<< HEAD
import { useColorScheme } from "@/hooks/useColorScheme";
import { Stack } from "expo-router";
import React from "react";
import { FC } from "react";
import { StatusBar } from "react-native";

const TouristSpotsLayout: FC = () => {
  const colorScheme = useColorScheme();
  return (
    <>
      <StatusBar
        backgroundColor={colorScheme === "dark" ? "#000" : "#fff"}
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
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
    </>
=======
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
>>>>>>> 4e22da0f4bf5c9a54a7e8583987c6efa55e5095a
  );
};

export default TouristSpotsLayout; 