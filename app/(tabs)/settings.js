import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from "react-native";
import { Stack } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useContext, useState } from "react";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LangContext } from "../../src/utils/langContext";
import { userPreferences } from "../../src/utils/userPreferences";

export default function Settings() {
    const { language, setLanguage } = useContext(LangContext);
    const t = (key, params) => language.t(key, params);

    // We assume language is an i18n object due to LangContext behavior
    const currentLocale = language.locale.substring(0, 2);
    const [selected, setSelected] = useState(currentLocale);

    const languages = [
        { title: language.t("_langListSpanish"), acronym: "es" },
        { title: language.t("_langListEnglish"), acronym: "en" }
    ];

    async function updateLanguage(acronym) {
        setLanguage(acronym);
        await AsyncStorage.setItem(userPreferences.LANGUAGE, acronym);
    }

    function handlePress(acronym) {
        updateLanguage(acronym);
        setSelected(acronym);
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Flat Modern Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t("settings_header_title")}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t("settings_section_language")}</Text>

                    <View style={styles.card}>
                        {languages.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handlePress(item.acronym)}
                                style={[
                                    styles.languageItem,
                                    selected === item.acronym && styles.selectedItem,
                                    index !== languages.length - 1 && styles.borderBottom
                                ]}
                            >
                                <Text style={[
                                    styles.languageText,
                                    selected === item.acronym && styles.selectedText
                                ]}>
                                    {item.title}
                                </Text>
                                {selected === item.acronym && (
                                    <MaterialIcons name="check" size={20} color="#8B5CF6" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    header: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        alignItems: "flex-start",
        justifyContent: "center",
        height: 52,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
    },
    scrollContent: {
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6B7280",
        marginBottom: 10,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    languageItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: "#FFFFFF",
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    selectedItem: {
        backgroundColor: "#F5F3FF",
    },
    languageText: {
        fontSize: 16,
        color: "#1F2937",
        fontWeight: "500",
    },
    selectedText: {
        color: "#8B5CF6",
        fontWeight: "bold",
    }
});
