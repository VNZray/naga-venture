import PressableButton from "@/components/PressableButton";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { ImageBackground, Text, View } from "react-native";
import { PaperProvider } from "react-native-paper";

const index = () => {
  const [fontsLoaded] = useFonts({
    "Poppins-Black": require("@/assets/fonts/Poppins/Poppins-Black.ttf"),
    "Poppins-Regular": require("@/assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("@/assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

  const colorScheme = useColorScheme(); // ✅ move above the return
  const color = colorScheme === "dark" ? "#0077B6" : "#0077B6";

  if (!fontsLoaded) {
    return null;
  }

  const imageBackground =
    "https://i0.wp.com/nagayon.com/wp-content/uploads/2024/08/oragon-monument-by-colline.jpg";

  return (
    <PaperProvider>
      <ImageBackground
        source={{ uri: imageBackground }}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={[
            "rgba(255, 255, 255, 0.0)", // Top (transparent)
            "rgba(10, 27, 71, 0.8)", // Middle
            "#0A1B47", // Bottom (solid)
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ flex: 1, justifyContent: "center", padding: "5%" }}
        >
          <Text
            style={{
              fontSize: 38,
              textAlign: "left",
              fontFamily: "Poppins-Bold",
              color: "white",
              marginTop: 250,
            }}
          >
            Begin Your Journey in the Heart of Naga
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Poppins-Regular",
              textAlign: "left",
              color: "white",
              marginTop: 20,
            }}
          >
            - Where Faith Meets Adventure.
          </Text>
          <View
            style={{
              flexDirection: "column",
              gap: 16,
              marginTop: 80,
              width: "100%",
              alignItems: "center",
            }}
          >
            <PressableButton
              TextSize={16}
              width={"100%"}
              height={55}
              type="primary"
              color={"#DEE3F2"}
              direction="column"
              Title="Login"
              onPress={() => router.navigate("/(screens)/LoginPage")}
            ></PressableButton>
            <PressableButton
              TextSize={16}
              width={"100%"}
              height={55}
              type="secondary"
              color={"#000"}
              direction="column"
              Title="Register"
              onPress={() => router.navigate("/(screens)/RegistrationPage")}
            ></PressableButton>
          </View>
        </LinearGradient>
      </ImageBackground>
    </PaperProvider>
  );
};

export default index;
