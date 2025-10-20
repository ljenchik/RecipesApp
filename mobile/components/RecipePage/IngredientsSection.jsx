import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function IngredientsSection({ ingredients }) {
    // State to track which ingredients are checked
    const [checkedItems, setCheckedItems] = useState(
        Array(ingredients.length).fill(false)
    );

    const toggleChecked = (index) => {
        const newChecked = [...checkedItems];
        newChecked[index] = !newChecked[index];
        setCheckedItems(newChecked);
    };

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {ingredients.map((ingredient, index) => (
                <Pressable
                    key={index}
                    style={styles.ingredientRow}
                    onPress={() => toggleChecked(index)}
                >
                    <Text style={styles.bullet}>
                        {checkedItems[index] ? "✓" : "⬜"}
                    </Text>
                    <Text
                        style={[
                            styles.ingredient,
                            checkedItems[index] && styles.checkedIngredient,
                        ]}
                    >
                        {ingredient}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 15,
        paddingBottom: 15,
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
});
