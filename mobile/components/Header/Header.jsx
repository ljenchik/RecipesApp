import { View, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LogoAndName from "./LogoAndName";
import AddRecipeByUrl from "./AddRecipeByUrl";
import SearchBar from "./SearchBar";

export default function Header({ onRecipeAdded, onSearch }) {
    return (
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
            <View style={styles.header}>
                {/* Logo and Name */}
                <LogoAndName />
                {/* Add Recipe by URL */}
                <AddRecipeByUrl onRecipeAdded={onRecipeAdded} />
                {/* Search Bar */}
                <SearchBar onSearch={onSearch} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: "#fbf5f5e0",
    },
    header: {
        backgroundColor: "#fbf5f5e0",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 5,
            },
        }),
    },
});
