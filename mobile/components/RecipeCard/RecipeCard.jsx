import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { parseTime } from "../../utils/helpers";

export default function RecipeCard({ recipe, onDelete }) {
    const router = useRouter();

    const handleCardPress = () => {
        router.push(`/recipe/${recipe.id}`);
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
            ]}
            onPress={handleCardPress}
        >
            {/* Delete Button */}
            <Pressable
                style={({ pressed }) => [
                    styles.deleteButton,
                    pressed && styles.deleteButtonPressed,
                ]}
                onPress={() => onDelete(recipe.id)}
                onPressIn={(e) => e.stopPropagation()}
            >
                <Text style={styles.deleteIcon}>✕</Text>
            </Pressable>
            {/* Recipe Image */}
            {recipe.image_url && (
                <Image
                    source={{ uri: recipe.image_url }}
                    style={styles.image}
                    resizeMode="cover"
                />
            )}

            {/* Recipe Title */}
            <Text style={styles.title} numberOfLines={2}>
                {recipe.title}
            </Text>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.footerItem}>
                    <Image
                        source={require("../../assets/images/ingredients-logo.png")}
                        style={styles.ingredientsLogo}
                    />
                    <Text style={styles.footerText}>
                        {recipe.ingredients?.length || 0} ingredients
                    </Text>
                </View>
                <View style={styles.footerItem}>
                    <Image
                        source={require("../../assets/images/clock.png")}
                        style={styles.ingredientsLogo}
                    />
                    <Text style={styles.footerText}>
                        {parseTime(recipe.prep_time)}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginHorizontal: 20,
        marginBottom: 15,
        padding: 10,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        minHeight: 300,
    },
    cardPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    deleteButton: {
        position: "absolute",
        top: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: "#fbf5f5e8",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    deleteButtonPressed: {
        color: "#610864",
        transform: [{ scale: 0.9 }],
    },
    deleteIcon: {
        fontSize: 18,
        color: "#610864",
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        backgroundColor: "#f0f0f0",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#610864",
        padding: 15,
        flex: 1,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 10,
        paddingBottom: 5,
        marginTop: "auto",
    },
    footerItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
    },
    footerText: {
        fontSize: 12,
        color: "#610864",
    },
    ingredientsLogo: {
        width: 20,
        height: 20,
        resizeMode: "contain",
    },
});
