import { Text, Image, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function LogoAndName() {
    const router = useRouter();

    const handlePress = () => {
        router.push("/");
    };

    return (
        <Pressable onPress={handlePress} style={styles.container}>
            <Image
                source={require("../../assets/images/logo.png")}
                style={styles.icon}
            />
            <Text style={styles.text}>RecipesApp</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fbf5f5e8",
        padding: 20,
        width: "100%",
    },
    icon: { width: 40, height: 40, marginRight: 10 },
    text: {
        fontSize: 36,
        fontFamily: "Cookie-Regular",
        color: "#610864",
        fontWeight: 800,
    },
});
