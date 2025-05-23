import logo from "@/assets/images/logo.png";
import PressableButton from "@/components/PressableButton";
import { ThemedText } from "@/components/ThemedText";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Dimensions, Platform, SafeAreaView, Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

const width = Dimensions.get("screen").width;

const RegistrationPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleConfirm = (date) => {
    setBirthdate(date);
    setDatePickerVisibility(false);
  };

  const [fontsLoaded] = useFonts({
    "Poppins-Black": require("@/assets/fonts/Poppins/Poppins-Black.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-Light": require("@/assets/fonts/Poppins/Poppins-Light.ttf"),
    "Poppins-Medium": require("@/assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-Regular": require("@/assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("@/assets/fonts/Poppins/Poppins-SemiBold.ttf"),
  });

  if (!fontsLoaded) return null;

  if (Platform.OS === "web") {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={webStyles.container}>
          <View style={webStyles.innerContainer}>
            <View style={webStyles.logoContainer}>
              <Image source={logo} style={webStyles.logo} />
              <Text style={webStyles.logoText}>Naga Venture</Text>
            </View>

            <View style={webStyles.header}>
              <ThemedText type="title">Sign Up</ThemedText>
              <ThemedText type="default">
                Navigate with Ease - Your Ultimate City Directory
              </ThemedText>
            </View>

            <View style={webStyles.inputRow}>
              <RNTextInput
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                style={webStyles.input}
              />
              <RNTextInput
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                style={webStyles.input}
              />
            </View>

            <PressableButton
              TextSize={16}
              width="100%"
              height={60}
              type="primary"
              IconSize={24}
              color="#DEE3F2"
              direction="column"
              Title="Sign Up"
              onPress={() => router.replace("/(screens)/")}
            />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View
          style={{
            display: "flex",
            padding: "5%",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.text}>Naga Venture</Text>
          </View>

          <View>
            <ThemedText type="title">Sign Up</ThemedText>
            <ThemedText type="default">
              Navigate with Ease - Your Ultimate City Directory
            </ThemedText>
          </View>

          <View style={{ flexDirection: "row", gap: 16 }}>
            <View style={{ flex: 1 }}>
              <TextInput
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                style={{ borderRadius: 10 }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextInput
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                style={{ borderRadius: 10 }}
              />
            </View>
          </View>

          <PressableButton
            TextSize={16}
            width={"100%"}
            height={60}
            type="primary"
            IconSize={24}
            color={"#DEE3F2"}
            direction="column"
            Title="Sign Up"
            onPress={() => router.replace("/(screens)/")}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default RegistrationPage;

const styles = {
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
  },
  text: {
    fontSize: 18,
    marginLeft: 10,
    fontFamily: "Poppins-Bold",
  },
};
