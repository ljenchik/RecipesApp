import { useState, useRef } from "react";
import {
    View,
    TextInput,
    Pressable,
    Text,
    StyleSheet,
    Platform,
} from "react-native";

export default function SearchBar({ onSearch }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const inputRef = useRef(null);

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        if (onSearch) {
            onSearch(query);
        }
    };

    const handleClear = () => {
        setSearchQuery("");
        if (onSearch) {
            onSearch("");
        }
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleContainerPress = () => {
        inputRef.current?.focus();
    };

    return (
        <View style={styles.container}>
            <Pressable
                style={[styles.searchBar, isFocused && styles.searchBarFocused]}
                onPress={handleContainerPress}
            >
                {/* Search Icon */}
                <View style={styles.iconContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                </View>

                {/* Input Field */}
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    placeholder="Search recipes..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="search"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />

                {/* Clear Button */}
                {searchQuery.length > 0 && (
                    <Pressable
                        style={({ pressed }) => [
                            styles.clearButton,
                            pressed && styles.clearButtonPressed,
                        ]}
                        onPress={handleClear}
                    >
                        {({ pressed }) => (
                            <Text
                                style={[
                                    styles.clearIcon,
                                    pressed && styles.clearIconPressed,
                                ]}
                            >
                                ✕
                            </Text>
                        )}
                    </Pressable>
                )}
            </Pressable>

            {/* Search hint when focused */}
            {isFocused && searchQuery.length === 0 && (
                <Text style={styles.hint}>
                    Try searching by recipe name or ingredients
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "#fff",
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    searchBarFocused: {
        borderColor: "#610864",
        borderWidth: 2,
        backgroundColor: "#fff",
        ...Platform.select({
            ios: {
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    iconContainer: {
        marginRight: 10,
    },
    searchIcon: {
        fontSize: 20,
        color: "#666",
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#610864",
        paddingVertical: 5,
    },
    clearButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#e0e0e0",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 5,
    },
    clearButtonPressed: {
        backgroundColor: "#610864",
        transform: [{ scale: 0.9 }],
    },
    clearIcon: {
        fontSize: 16,
        color: "#666",
        fontWeight: "bold",
        lineHeight: 20,
    },
    clearIconPressed: {
        color: "#fff",
    },
    hint: {
        marginTop: 8,
        paddingHorizontal: 15,
        fontSize: 12,
        color: "#999",
        fontStyle: "italic",
    },
});
