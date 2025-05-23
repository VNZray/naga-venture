import PressableButton from "@/components/PressableButton";
import { ThemedText } from "@/components/ThemedText";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { ImageBackground, Platform, Text, View } from "react-native";
import { PaperProvider } from "react-native-paper";

const index = () => {
  const [fontsLoaded] = useFonts({
    "Poppins-Black": require("@/assets/fonts/Poppins/Poppins-Black.ttf"),
    "Poppins-Regular": require("@/assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("@/assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const imageBackground =
    "https://i0.wp.com/nagayon.com/wp-content/uploads/2024/08/oragon-monument-by-colline.jpg";

  if (Platform.OS === 'web') {
    return (
      <div
        style={{
          backgroundImage: `url(${imageBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: 'center',
          color: "white",
          fontFamily: "'Poppins', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(10,27,71,0.8) 50%, #0A1B47 100%)",
            zIndex: 1,
          }}
        ></div>

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 600,
            marginTop: 250,
          }}
        >
          <ThemedText
            type="title"
            style={{
              fontSize: 38,
              textAlign: "left",
              color: "#fff",
              fontWeight: 900,
            }}
          >
            Begin Your Journey in the Heart of Naga
          </ThemedText>

          <p
            style={{
              fontSize: 18,
              fontWeight: 400,
              marginTop: 20,
              textAlign: "left",
            }}
          >
            - Where Faith Meets Adventure.
          </p>

          <div
            style={{
              marginTop: 80,
              display: "flex",
              flexDirection: "column",
              gap: 16,
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
              onPress={() => router.push("/(screens)/LoginPage")}
            />

            <PressableButton
              TextSize={16}
              width={"100%"}
              height={55}
              type="secondary"
              color={"#000"}
              direction="column"
              Title="Register"
              onPress={() => router.push("/(screens)/RegistrationPage")}
            />
          </div>
        </div>
      </div>
    );
  }

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
          <ThemedText
            type="title"
            style={{
              fontSize: 38,
              textAlign: "left",
              marginTop: 250,
              color: '#fff'
            }}
          >
            Begin Your Journey in the Heart of Naga
          </ThemedText>
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
