import { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Image,
} from "react-native";
import { recipeAPI } from "../services/api";
import Header from "./../components/Header/Header";

export default function Index() {
    const [recipes, setRecipes] = useState([]); // All recipes from API
    const [filteredRecipes, setFilteredRecipes] = useState([]); // Filtered results
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("🚀 Home screen mounted");
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            console.log("📥 Fetching recipes...");
            setLoading(true);

            const data = await recipeAPI.getRecipes();
            console.log("📦 Received recipes:", data?.length || 0);

            if (data && data.length > 0) {
                setRecipes(data);
                setFilteredRecipes(data); // ← IMPORTANT: Initialize filtered with all
            } else {
                setError("No recipes found in database");
            }
        } catch (err) {
            console.error("❌ Fetch error:", err);
            setError(`Failed to load recipes: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query) => {
        console.log("🔍 Search called with:", query);
        console.log("📊 Total recipes available:", recipes.length);

        // No query = show all recipes
        if (!query || query.trim() === "") {
            console.log("✅ No query - showing all recipes");
            setFilteredRecipes(recipes);
            return;
        }

        const lowercaseQuery = query.toLowerCase().trim();
        console.log("🔍 Searching for:", lowercaseQuery);

        const filtered = recipes.filter((recipe) => {
            // Search in title
            const titleMatch = recipe.title
                ?.toLowerCase()
                .includes(lowercaseQuery);

            // Search in ingredients
            const ingredientsMatch = recipe.ingredients?.some((ingredient) =>
                ingredient?.toLowerCase().includes(lowercaseQuery)
            );

            // Search in instructions (optional)
            const instructionsMatch = recipe.instructions
                ?.toLowerCase()
                .includes(lowercaseQuery);

            return titleMatch || ingredientsMatch || instructionsMatch;
        });

        console.log(`✅ Found ${filtered.length} recipes`);
        setFilteredRecipes(filtered);
    };

    const handleRecipeAdded = (newRecipe) => {
        console.log("➕ Recipe added:", newRecipe.title);
        const updatedRecipes = [newRecipe, ...recipes];
        setRecipes(updatedRecipes);
        setFilteredRecipes(updatedRecipes);
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#610864" />
                <Text style={styles.loadingText}>Loading recipes...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>❌ {error}</Text>
                <Text style={styles.hint}>Make sure backend is running</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header with all controls */}
            <Header
                onRecipeAdded={handleRecipeAdded}
                onSearch={handleSearch} // ← Make sure this is passed!
            />

            {/* Scrollable Content */}
            <ScrollView style={styles.scrollView}>
                {/* Results Count */}
                {filteredRecipes.length !== recipes.length && (
                    <Text style={styles.resultsText}>
                        Found {filteredRecipes.length} recipe
                        {filteredRecipes.length !== 1 ? "s" : ""}
                    </Text>
                )}

                {/* Recipe List - USE filteredRecipes, NOT recipes! */}
                {filteredRecipes.length > 0 ? (
                    filteredRecipes.map((recipe, index) => (
                        <View
                            key={recipe.id || index}
                            style={styles.recipeCard}
                        >
                            {/* Recipe Image */}
                            {recipe.imageUrl && (
                                <Image
                                    source={{ uri: recipe.imageUrl }}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                            )}

                            {/* Recipe Title */}
                            <Text style={styles.title}>{recipe.title}</Text>

                            {/* Meta Info */}
                            <View style={styles.metaContainer}>
                                {recipe.prepTime && (
                                    <Text style={styles.meta}>
                                        ⏱️ {recipe.prepTime}
                                    </Text>
                                )}
                                {recipe.servings && (
                                    <Text style={styles.meta}>
                                        🍽️ {recipe.servings}
                                    </Text>
                                )}
                            </View>

                            {/* Ingredients */}
                            {recipe.ingredients &&
                                recipe.ingredients.length > 0 && (
                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>
                                            Ingredients
                                        </Text>
                                        {recipe.ingredients
                                            .slice(0, 5)
                                            .map((ingredient, i) => (
                                                <Text
                                                    key={i}
                                                    style={styles.ingredient}
                                                >
                                                    • {ingredient}
                                                </Text>
                                            ))}
                                        {recipe.ingredients.length > 5 && (
                                            <Text style={styles.moreText}>
                                                +{recipe.ingredients.length - 5}{" "}
                                                more...
                                            </Text>
                                        )}
                                    </View>
                                )}
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyEmoji}>🔍</Text>
                        <Text style={styles.emptyText}>No recipes found</Text>
                        <Text style={styles.emptyHint}>
                            Try searching for something else
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fbf5f5e0",
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
        marginBottom: 10,
    },
    hint: {
        fontSize: 14,
        color: "#999",
        textAlign: "center",
        marginTop: 5,
    },
    scrollView: {
        flex: 1,
    },
    resultsText: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        fontSize: 14,
        color: "#610864",
        fontWeight: "600",
    },
    recipeCard: {
        marginBottom: 20,
        backgroundColor: "#fff",
        borderRadius: 8,
        overflow: "hidden",
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    image: {
        width: "100%",
        height: 200,
        backgroundColor: "#f0f0f0",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        padding: 15,
        paddingBottom: 5,
    },
    metaContainer: {
        flexDirection: "row",
        paddingHorizontal: 15,
        paddingBottom: 10,
    },
    meta: {
        fontSize: 14,
        color: "#666",
        marginRight: 20,
    },
    section: {
        paddingHorizontal: 15,
        paddingBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    ingredient: {
        fontSize: 16,
        color: "#555",
        marginBottom: 6,
        lineHeight: 22,
    },
    moreText: {
        fontSize: 14,
        color: "#999",
        fontStyle: "italic",
        marginTop: 5,
    },
    emptyState: {
        padding: 60,
        alignItems: "center",
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: "600",
        color: "#666",
        marginBottom: 10,
    },
    emptyHint: {
        fontSize: 16,
        color: "#999",
        textAlign: "center",
    },
});
