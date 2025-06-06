import { useFonts } from "expo-font";
import React from "react";
import 'react-native-url-polyfill/auto';
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


  return (
    <div>
        <h1 style={{color: 'white'}}>Hello World HAHAHHAHA</h1>
    </div>
  );
};

export default index;
