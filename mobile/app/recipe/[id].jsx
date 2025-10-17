import { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    ActivityIndicator,
    Pressable,
    Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { recipeAPI } from "../../services/api";
import { parseTime, parseServings } from "../../utils/helpers";

export default function RecipeDetail() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("🔍 Loading recipe ID:", id);
        fetchRecipe();
    }, [id]);

    const fetchRecipe = async () => {
        try {
            setLoading(true);
            const data = await recipeAPI.getRecipe(id);
            console.log("✅ Recipe loaded:", data.title);
            setRecipe(data);
        } catch (err) {
            console.error("❌ Error fetching recipe:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.centered}>
                <ActivityIndicator size="large" color="#610864" />
                <Text style={styles.loadingText}>Loading recipe...</Text>
            </SafeAreaView>
        );
    }

    if (error || !recipe) {
        return (
            <SafeAreaView style={styles.centered}>
                <Text style={styles.errorText}>❌ Failed to load recipe</Text>
                <Pressable
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>← Go Back</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            {/* Header with Back Button */}
            <View style={styles.header}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backIcon}>←</Text>
                    <Text style={styles.backText}>Back</Text>
                </Pressable>
            </View>

            <ScrollView style={styles.scrollView}>
                {/* Recipe Image */}
                {recipe.image_url && (
                    <Image
                        source={{ uri: recipe.image_url }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                )}

                {/* Recipe Title */}
                <Text style={styles.title}>{recipe.title}</Text>

                {/* Meta Info */}
                <View style={styles.metaContainer}>
                    {recipe.prep_time && (
                        <View style={styles.metaItem}>
                            <Text style={styles.metaIcon}>⏱️</Text>
                            <Text style={styles.metaText}>
                                {parseTime(recipe.prep_time)}
                            </Text>
                        </View>
                    )}
                    {recipe.servings && (
                        <View style={styles.metaItem}>
                            <Text style={styles.metaIcon}>🍽️</Text>
                            <Text style={styles.metaText}>
                                {parseServings(recipe.servings)} servings
                            </Text>
                        </View>
                    )}
                </View>

                {/* Source URL */}
                {recipe.source_url && (
                    <View style={styles.sourceContainer}>
                        <Text style={styles.sourceLabel}>Source:</Text>
                        <Text style={styles.sourceUrl} numberOfLines={1}>
                            {recipe.source_url}
                        </Text>
                    </View>
                )}

                {/* Ingredients Section */}
                {recipe.ingredients && recipe.ingredients.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Ingredients ({recipe.ingredients.length})
                        </Text>
                        {recipe.ingredients.map((ingredient, index) => (
                            <View key={index} style={styles.ingredientRow}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.ingredient}>
                                    {ingredient}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Instructions Section */}
                {recipe.instructions && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Instructions</Text>
                        <Text style={styles.instructions}>
                            {recipe.instructions}
                        </Text>
                    </View>
                )}

                {/* Notes Section */}
                {recipe.notes && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Notes</Text>
                        <Text style={styles.notes}>{recipe.notes}</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
    errorText: {
        fontSize: 18,
        color: "#ff6b6b",
        textAlign: "center",
        marginBottom: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 5,
    },
    backIcon: {
        fontSize: 24,
        color: "#610864",
        marginRight: 5,
    },
    backText: {
        fontSize: 16,
        color: "#610864",
        fontWeight: "600",
    },
    backButtonText: {
        fontSize: 16,
        color: "#610864",
        fontWeight: "600",
    },
    deleteButton: {
        padding: 8,
    },
    deleteIcon: {
        fontSize: 24,
    },
    scrollView: {
        flex: 1,
    },
    image: {
        width: "100%",
        height: 300,
        backgroundColor: "#f0f0f0",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        padding: 20,
        paddingBottom: 10,
    },
    metaContainer: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingBottom: 15,
        gap: 20,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    metaIcon: {
        fontSize: 18,
    },
    metaText: {
        fontSize: 16,
        color: "#666",
    },
    sourceContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    sourceLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#666",
        marginBottom: 5,
    },
    sourceUrl: {
        fontSize: 14,
        color: "#610864",
    },
    section: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
    },
    ingredientRow: {
        flexDirection: "row",
        marginBottom: 10,
        paddingRight: 10,
    },
    bullet: {
        fontSize: 20,
        color: "#610864",
        marginRight: 10,
        width: 20,
    },
    ingredient: {
        fontSize: 16,
        color: "#555",
        lineHeight: 24,
        flex: 1,
    },
    instructions: {
        fontSize: 16,
        color: "#555",
        lineHeight: 26,
    },
    notes: {
        fontSize: 16,
        color: "#666",
        lineHeight: 24,
        fontStyle: "italic",
    },
});
