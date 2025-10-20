import { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    ActivityIndicator,
    Pressable,
    TouchableOpacity,
    Linking,
    Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { recipeAPI } from "../../services/api";
import { parseTime } from "../../utils/helpers";
import LogoAndName from "../../components/Header/LogoAndName";
import IngredientsSection from "../../components/RecipePage/IngredientsSection";

export default function RecipePage() {
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
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Logo + Name */}
                <LogoAndName />

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

                {/* Recipe Title */}
                <Text style={styles.title}>{recipe.title}</Text>

                {/* Recipe Image */}
                {recipe.image_url && (
                    <Image
                        source={{ uri: recipe.image_url }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                )}

                {/* Meta Info */}
                <View style={styles.recipeMeta}>
                    {/* Ingredients */}
                    {recipe?.ingredients?.length > 0 && (
                        <View style={styles.metaItem}>
                            <Image
                                source={require("../../assets/images/ingredients-logo.png")}
                                style={styles.metaIcon}
                            />
                            <Text style={styles.metaText}>
                                {recipe.ingredients.length} ingredients
                            </Text>
                        </View>
                    )}

                    {/* Prep Time */}
                    {recipe?.prep_time && (
                        <View style={styles.metaItem}>
                            <Image
                                source={require("../../assets/images/clock.png")}
                                style={styles.metaIcon}
                            />
                            <Text style={styles.metaText}>
                                {parseTime(recipe.prep_time)}
                            </Text>
                        </View>
                    )}

                    {/* Servings */}
                    {recipe?.servings !== undefined &&
                        recipe?.servings !== null && (
                            <View style={styles.metaItem}>
                                <Image
                                    source={require("../../assets/images/clock.png")}
                                    style={styles.metaIcon}
                                />
                                <Text style={styles.metaText}>
                                    {recipe.servings}
                                </Text>
                            </View>
                        )}

                    {/* Original Recipe Link */}
                    {recipe?.source_url && (
                        <View style={styles.metaItem}>
                            <TouchableOpacity
                                onPress={() =>
                                    Linking.openURL(recipe.source_url)
                                }
                            >
                                <Text
                                    style={[styles.metaText, styles.linkText]}
                                >
                                    🫕 Original recipe
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Ingredients Section */}
                {recipe.ingredients?.length > 0 && (
                    <IngredientsSection ingredients={recipe.ingredients} />
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
        backgroundColor: "#fbf5f5e8",
    },
    scrollView: {
        flex: 1,
        padding: 20,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#555",
    },
    errorText: {
        fontSize: 18,
        color: "#ff6b6b",
        textAlign: "center",
        marginBottom: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fbf5f5e8",
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 5,
    },
    backIcon: {
        fontSize: 24,
        color: "#610864",
    },
    backText: {
        fontSize: 16,
        color: "#610864",
        fontWeight: "600",
    },
    image: {
        width: "100%",
        height: 300,
        backgroundColor: "white",
        margin: "auto",
        borderRadius: 10,
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#610864",
        paddingTop: 10,
        paddingBottom: 10,
    },
    recipeMeta: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingBottom: 5,
        marginTop: "auto",
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
    },
    metaText: {
        fontSize: 12,
        color: "#610864",
    },
    metaIcon: {
        width: 20,
        height: 20,
        resizeMode: "contain",
    },
    linkText: {
        color: "#610864",
        fontSize: 12,
        textDecorationLine: "none",
    },
    section: {
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#610864",
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
