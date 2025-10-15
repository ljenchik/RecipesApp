import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import logo from "../assets/images/logo.png";

export default function Index() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>RecipesApp</Text>
            <Image source={logo} style={{ width: 100, height: 100 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        color: "red",
    },
    text: {
        color: "green",
        fontSize: 40,
    },
});
