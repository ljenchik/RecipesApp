import { View, StyleSheet, Platform, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LogoAndName from "./LogoAndName";
import AddRecipeByUrl from "./AddRecipeByUrl";
import SearchBar from "./SearchBar";

export default function Header({ onRecipeAdded, onSearch }) {
    const { width } = useWindowDimensions();
    const isWeb = Platform.OS === "web";
    const isLargeScreen = width > 1024; // Desktop
    const isTablet = width > 768 && width <= 1024;
    const isMobile = width <= 768;

    return (
        <SafeAreaView
            edges={["top"]}
            style={[styles.safeArea, isWeb && styles.safeAreaWeb]}
        >
            <View
                style={[
                    styles.header,
                    isWeb && styles.headerWeb,
                    isLargeScreen && styles.headerLarge,
                ]}
            >
                {/* Logo Section */}
                <View style={styles.logoSection}>
                    <LogoAndName />
                </View>

                {/* Controls Section */}
                <View
                    style={[
                        styles.controlsSection,
                        isLargeScreen && styles.controlsSectionHorizontal,
                    ]}
                >
                    {/* Add Recipe */}
                    <View
                        style={[
                            styles.addRecipeContainer,
                            isLargeScreen && styles.addRecipeContainerLarge,
                        ]}
                    >
                        <AddRecipeByUrl onRecipeAdded={onRecipeAdded} />
                    </View>

                    {/* Search */}
                    <View
                        style={[
                            styles.searchContainer,
                            isLargeScreen && styles.searchContainerLarge,
                        ]}
                    >
                        <SearchBar onSearch={onSearch} />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: "#fbf5f5e0",
    },
    safeAreaWeb: {
        ...Platform.select({
            web: {
                position: "sticky",
                top: 0,
                zIndex: 1000,
            },
        }),
    },
    header: {
        backgroundColor: "#fbf5f5e0",
        paddingBottom: 10,
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
            web: {
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            },
        }),
    },
    headerWeb: {
        ...Platform.select({
            web: {
                maxWidth: 1400,
                width: "100%",
                alignSelf: "center",
                paddingHorizontal: 20,
            },
        }),
    },
    headerLarge: {
        paddingVertical: 15,
    },
    logoSection: {
        // Logo always on top
    },
    controlsSection: {
        // Stacked vertically by default (mobile)
        gap: 0,
    },
    controlsSectionHorizontal: {
        // Horizontal on desktop
        flexDirection: "row",
        gap: 20,
        alignItems: "flex-start",
        marginTop: 15,
    },
    addRecipeContainer: {
        // Full width on mobile
    },
    addRecipeContainerLarge: {
        flex: 1,
        maxWidth: 600,
    },
    searchContainer: {
        // Full width on mobile
    },
    searchContainerLarge: {
        flex: 1,
        maxWidth: 400,
    },
});
