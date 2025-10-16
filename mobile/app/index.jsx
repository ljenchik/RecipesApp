<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Image,
} from "react-native";
import { recipeAPI } from "../services/api";
=======
import { useState, useEffect } from "react";
import {
    ScrollView,
    View,
    Text,
    ActivityIndicator,
    Image,
    StyleSheet,
} from "react-native";
import { recipeAPI } from "../services/api";
import LogoAndName from "../components/Header/LogoAndName";
>>>>>>> d43d6cb (Added Logo and Name)

export default function Index() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
<<<<<<< HEAD
        console.log("🚀 Home screen mounted");
=======
>>>>>>> d43d6cb (Added Logo and Name)
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
<<<<<<< HEAD
            console.log("📥 Fetching recipes...");
            setLoading(true);

            const data = await recipeAPI.getRecipes();
            console.log("✅ Recipes received:", data);

            if (data && data.length > 0) {
                setRecipes(data);
            } else {
                setError("No recipes found in database");
            }
        } catch (err) {
            console.error("❌ Fetch error:", err);
            setError(`Failed to load recipes: ${err.message}`);
=======
            setLoading(true);
            const data = await recipeAPI.getRecipes();
            if (data && data.length > 0) setRecipes(data);
            else setError("No recipes found");
        } catch (err) {
            setError(err.message);
>>>>>>> d43d6cb (Added Logo and Name)
        } finally {
            setLoading(false);
        }
    };

<<<<<<< HEAD
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#ff6b6b" />
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
        <ScrollView style={styles.container}>
            {recipes.map((recipe, index) => (
                <View key={index} style={styles.recipeCard}>
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
                    {recipe.ingredients && recipe.ingredients.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Ingredients</Text>
                            {recipe.ingredients.map((ingredient, i) => (
                                <Text key={i} style={styles.ingredient}>
                                    • {ingredient}
                                </Text>
                            ))}
                        </View>
                    )}

                    {/* Instructions */}
                    {recipe.instructions && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                Instructions
                            </Text>
                            <Text style={styles.instructions}>
                                {recipe.instructions}
                            </Text>
                        </View>
                    )}
=======
    if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    if (error) return <Text>{error}</Text>;

    return (
        <ScrollView style={styles.container}>
            <LogoAndName />
            {recipes.map((r, i) => (
                <View key={i} style={styles.card}>
                    {r.imageUrl && (
                        <Image
                            source={{ uri: r.imageUrl }}
                            style={styles.image}
                        />
                    )}
                    <Text style={styles.title}>{r.title}</Text>
>>>>>>> d43d6cb (Added Logo and Name)
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f8f9fa",
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
    recipeCard: {
=======
    container: { flex: 1, padding: 16, backgroundColor: "#f8f9fa" },
    card: {
>>>>>>> d43d6cb (Added Logo and Name)
        marginBottom: 20,
        backgroundColor: "#fff",
        borderRadius: 8,
        overflow: "hidden",
<<<<<<< HEAD
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
    instructions: {
        fontSize: 16,
        color: "#555",
        lineHeight: 22,
=======
        padding: 10,
>>>>>>> d43d6cb (Added Logo and Name)
    },
    image: { width: "100%", height: 200, borderRadius: 8 },
    title: { fontSize: 20, fontWeight: "bold", marginTop: 10 },
});
