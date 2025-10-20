// components/NotesSection.jsx
import { View, Text, StyleSheet } from "react-native";

export default function NotesSection({ notes }) {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.text}>{notes}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginVertical: 10 },
    sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
    text: { fontSize: 16, lineHeight: 22 },
});
