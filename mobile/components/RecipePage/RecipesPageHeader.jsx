// components/RecipeHeader.jsx
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Linking,
} from "react-native";
import { parseTime, parseServings } from "../../utils/helpers";

export default function RecipePageHeader({ recipe }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{recipe.title}</Text>

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
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#610864",
        paddingTop: 10,
        paddingBottom: 10,
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
