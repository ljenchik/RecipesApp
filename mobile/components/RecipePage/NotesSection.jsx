// components/NotesSection.jsx
import { View, Text, StyleSheet } from "react-native";

export default function NotesSection({ notes }) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.text}>{notes}</Text>
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
