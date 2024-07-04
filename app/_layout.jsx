import React, { useEffect } from 'react'
import { SplashScreen, Stack } from 'expo-router'
import { useFonts } from 'expo-font'
import GlobalProvider from '../context/GlobalProvider';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    const [ fontsLoaded, error ] = useFonts({
        "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
        "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
        "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),

        "Brighter-Regular": require("../assets/fonts/MTNBrighterSans-Regular.ttf"),
        "Brighter-Bold": require("../assets/fonts/MTNBrighterSans-Bold.ttf"),


        "NotoSans-Black": require("../assets/fonts/more-fonts/NotoSans-Black.ttf"),
        "NotoSans-Bold": require("../assets/fonts/more-fonts/NotoSans-Bold.ttf"),
        "NotoSans-ExtraBold": require("../assets/fonts/more-fonts/NotoSans-ExtraBold.ttf"),
        "NotoSans-Light": require("../assets/fonts/more-fonts/NotoSans-Light.ttf"),
        "NotoSans-Medium": require("../assets/fonts/more-fonts/NotoSans-Medium.ttf"),
        "NotoSans-Regular": require("../assets/fonts/more-fonts/NotoSans-Regular.ttf"),
        "NotoSans-SemiBold": require("../assets/fonts/more-fonts/NotoSans-SemiBold.ttf"),
        "NotoSans-Thin": require("../assets/fonts/more-fonts/NotoSans-Thin.ttf"),

    });

    useEffect(() => {
        if (error) throw error
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded, error])

    if (!fontsLoaded && !error) return null;

  return (
    <GlobalProvider>
      <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />


      </Stack>
    </GlobalProvider>
   
  )
}

export default RootLayout