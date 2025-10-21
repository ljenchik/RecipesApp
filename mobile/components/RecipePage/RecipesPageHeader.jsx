// components/RecipeHeader.jsx
import { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    TextInput,
    Linking,
} from "react-native";
import { parseTime, parseServings } from "../../utils/helpers";

export default function RecipePageHeader({ recipe, onUpdate }) {
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(recipe.title);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        setTitle(recipe.title);
    }, [recipe.title]);

    const handleUpdate = async () => {
        try {
            if (onUpdate) await onUpdate(recipe.id, "title", title);
            setEditing(false);
        } catch (err) {
            console.error(err);
            alert("Failed to update title");
        }
    };
    const handleCancel = () => {
        setTitle(recipe.title);
        setEditing(false);
    };
    return (
        <View style={styles.container}>
            {editing ? (
                <View style={styles.editContainer}>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                borderColor: isFocused ? "#FF6B6B" : "#610864",
                                borderWidth: isFocused ? 2 : 1,
                            },
                        ]}
                        value={title}
                        onChangeText={setTitle}
                        autoFocus
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        selectionColor="#FF6B6B"
                        underlineColorAndroid="transparent"
                    />

                    <Pressable style={styles.button} onPress={handleUpdate}>
                        <Text style={styles.buttonText}>✅</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={handleCancel}>
                        <Text style={styles.buttonText}>❌</Text>
                    </Pressable>
                </View>
            ) : (
                <View style={styles.displayContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Pressable
                        style={styles.editButton}
                        onPress={() => setEditing(true)}
                    >
                        <Text style={styles.editButtonText}>✏️</Text>
                    </Pressable>
                </View>
            )}

            {recipe.image_url && (
                <Image
                    source={{ uri: recipe.image_url }}
                    style={styles.image}
                    resizeMode="cover"
                />
            )}

            <View style={styles.recipeMeta}>
                {recipe.ingredients?.length > 0 && (
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
                {recipe.prep_time && (
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
                {recipe.servings != null && (
                    <View style={styles.metaItem}>
                        <Image
                            source={require("../../assets/images/servings.png")}
                            style={styles.metaIcon}
                        />
                        <Text style={styles.metaText}>
                            {parseServings(recipe.servings)} servings
                        </Text>
                    </View>
                )}
                {recipe.source_url && (
                    <TouchableOpacity
                        onPress={() => Linking.openURL(recipe.source_url)}
                    >
                        <Text style={[styles.metaText, styles.linkText]}>
                            🫕 Original recipe
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fbf5f5e8",
    },
    displayContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#610864",
        paddingTop: 10,
        paddingBottom: 10,
    },
    editButton: {
        marginLeft: 8,
        padding: 4,
    },
    editButtonText: {
        fontSize: 14,
        color: "#610864",
    },
    editContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
    },
    input: {
        width: "80%",
        borderRadius: 5,
        borderWidth: 1,
        fontSize: 16,
        color: "#610864",
        padding: 10,
        borderColor: "#610864",
    },
    image: {
        width: "100%",
        height: 300,
        backgroundColor: "white",
        margin: "auto",
        borderRadius: 10,
        marginBottom: 10,
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
});
