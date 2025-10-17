import { useState, useRef } from "react";
import {
    View,
    TextInput,
    Text,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Keyboard,
} from "react-native";
import { recipeAPI } from "../../services/api";

export default function AddRecipeByUrl({ onRecipeAdded }) {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const inputRef = useRef(null);

    const handleSubmit = async () => {
        Keyboard.dismiss(); // ← Close keyboard
        setError("");

        if (!url.trim()) {
            setError("Please enter a URL");
            setTimeout(() => inputRef.current?.focus(), 100);
            return;
        }

        try {
            setLoading(true);
            const newRecipe = await recipeAPI.addRecipeByUrl(url);

            setUrl("");
            Alert.alert("Success", "Recipe added successfully!");

            if (onRecipeAdded) {
                onRecipeAdded(newRecipe);
            }

            // Focus again for next recipe
            setTimeout(() => inputRef.current?.focus(), 500);
        } catch (err) {
            console.error("Error adding recipe:", err);
            const errorMessage = err.message || "Failed to add recipe";
            setError(errorMessage);
            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    ref={inputRef}
                    style={[
                        styles.input,
                        isFocused && styles.inputFocused,
                        error && styles.inputError,
                    ]}
                    placeholder="Paste recipe link here..."
                    placeholderTextColor="#999"
                    value={url}
                    onChangeText={(text) => {
                        setUrl(text);
                        if (error) setError("");
                    }}
                    keyboardType="url"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                />

                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        loading && styles.buttonDisabled,
                        pressed && styles.buttonPressed,
                    ]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {({ pressed }) =>
                        loading ? (
                            <ActivityIndicator color="#610864" />
                        ) : (
                            <Text
                                style={[
                                    styles.buttonText,
                                    pressed && { color: "#fff" },
                                ]}
                            >
                                Add recipe
                            </Text>
                        )
                    }
                </Pressable>
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>⚠️ {error}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        marginHorizontal: 10,
        marginVertical: 10,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    input: {
        flex: 1,
        height: 48,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        color: "#610864",
        backgroundColor: "#f8f9fa",
    },
    inputFocused: {
        borderColor: "#610864",
        borderWidth: 2,
        backgroundColor: "#fff",
    },
    inputError: {
        borderColor: "#c62828",
        borderWidth: 2,
    },
    button: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#610864",
        paddingHorizontal: 20,
        height: 48,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        minWidth: 80,
    },
    buttonPressed: {
        backgroundColor: "#610864",
        transform: [{ scale: 0.95 }],
    },
    buttonDisabled: {
        backgroundColor: "#f0f0f0",
        borderColor: "#ccc",
    },
    buttonText: {
        color: "#610864",
        fontSize: 16,
        fontWeight: "600",
    },
    errorContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#ffebee",
        borderRadius: 6,
    },
    errorText: {
        color: "#c62828",
        fontSize: 14,
    },
});
