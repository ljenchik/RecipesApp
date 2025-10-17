// app/_layout.jsx
import { Stack } from "expo-router";
import { useFonts } from "expo-font";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        "Cookie-Regular": require("../assets/fonts/Cookie-Regular.ttf"),
    });

    if (!fontsLoaded) return null;

    return <Stack screenOptions={{ headerShown: false }} />;
}
