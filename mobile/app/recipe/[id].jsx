import { useState, useEffect } from "react";
import {
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { recipeAPI } from "../../services/api";
import LogoAndName from "../../components/Header/LogoAndName";
import IngredientsSection from "../../components/RecipePage/IngredientsSection";
import RecipePageHeader from "../../components/RecipePage/RecipesPageHeader";
import InstructionsSection from "../../components/RecipePage/InstructionsSection";
import NotesSection from "../../components/RecipePage/NotesSection";

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
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <LogoAndName />
                <Pressable
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backText}>← Back</Text>
                </Pressable>
                <RecipePageHeader recipe={recipe} />
                <IngredientsSection ingredients={recipe.ingredients} />
                <InstructionsSection instructions={recipe.instructions} />
                <NotesSection notes={recipe.notes} />
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
});
