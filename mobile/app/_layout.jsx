// app/_layout.jsx
import { Stack } from "expo-router";
<<<<<<< HEAD

export default function RootLayout() {
=======
import { useFonts } from "expo-font";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        "Cookie-Regular": require("../assets/fonts/Cookie-Regular.ttf"),
    });

    if (!fontsLoaded) return null;

>>>>>>> d43d6cb (Added Logo and Name)
    return <Stack screenOptions={{ headerShown: false }} />;
}
