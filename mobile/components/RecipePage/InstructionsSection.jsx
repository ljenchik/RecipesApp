// components/InstructionsSection.jsx
import { View, Text, StyleSheet } from "react-native";

export default function InstructionsSection({ instructions }) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <Text style={styles.text}>{instructions}</Text>
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
});
