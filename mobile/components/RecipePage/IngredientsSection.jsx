import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    TextInput,
    ScrollView,
} from "react-native";
import { convertIngredient } from "../../utils/convertIngredient";

export default function IngredientsSection({ recipe, onUpdate, id }) {
    const [editing, setEditing] = useState(false);
    const [ingredients, setIngredients] = useState("");
    const [checkedItems, setCheckedItems] = useState({});
    const [useMetric, setUseMetric] = useState(false);

    useEffect(() => {
        if (recipe && Array.isArray(recipe.ingredients)) {
            setIngredients(recipe.ingredients.join("\n"));

            const initialChecks = {};
            recipe.ingredients.forEach((ing) => {
                initialChecks[ing] = false;
            });
            setCheckedItems(initialChecks);
        }
    }, [recipe]);

    const handleUpdate = () => {
        console.log("📝 Ingredients before update:", ingredients);
        onUpdate("ingredients", ingredients);
        setEditing(false);
    };

    const handleCancel = () => {
        setIngredients(recipe.ingredients.join("\n"));
        setEditing(false);
    };

    const toggleChecked = (ing) => {
        setCheckedItems((prev) => ({ ...prev, [ing]: !prev[ing] }));
    };

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ingredients</Text>
                <Pressable
                    style={styles.editButton}
                    onPress={() => setEditing(true)}
                >
                    <Text style={styles.editButtonText}>✏️</Text>
                </Pressable>
            </View>

            {editing ? (
                <View style={styles.editContainer}>
                    <TextInput
                        style={styles.textArea}
                        value={ingredients}
                        onChangeText={setIngredients}
                        multiline
                        placeholder="Enter ingredients, one per line..."
                        autoFocus
                    />
                    <View style={styles.editButtons}>
                        <Pressable
                            style={styles.tickCross}
                            onPress={handleUpdate}
                        >
                            <Text style={styles.tickCrossText}>✅</Text>
                        </Pressable>
                        <Pressable
                            style={styles.tickCross}
                            onPress={handleCancel}
                        >
                            <Text style={styles.tickCrossText}>❌</Text>
                        </Pressable>
                    </View>
                </View>
            ) : (
                <ScrollView style={styles.list}>
                    {recipe.ingredients &&
                        recipe.ingredients.map((ing, idx) =>
                            ing.trim() ? (
                                <Pressable
                                    key={idx}
                                    style={styles.itemRow}
                                    onPress={() => toggleChecked(ing)}
                                >
                                    <Text style={styles.checkbox}>
                                        {checkedItems[ing] ? "✓" : "⬜"}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.itemText,
                                            checkedItems[ing] &&
                                                styles.checkedText,
                                        ]}
                                    >
                                        {convertIngredient(ing, useMetric)}
                                    </Text>
                                </Pressable>
                            ) : null
                        )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 15,
        paddingBottom: 15,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: 10,
        gap: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#610864",
        marginTop: 10,
        marginBottom: 10,
    },
    ingredientRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 6,
    },
    bullet: {
        width: 24,
        marginRight: 8,
        textAlign: "center",
        lineHeight: 20,
    },
    ingredient: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    checkedIngredient: {
        textDecorationLine: "line-through",
        color: "#999",
    },
    textArea: {
        height: 200,
        backgroundColor: "white",
    },
    editButtons: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 10,
        padding: 10,
    },
});
