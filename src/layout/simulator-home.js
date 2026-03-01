import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { ui } from "../utils/styles";
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from "expo-router";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { bannerId } from "../utils/constants";
import { useContext } from "react";
import { Context } from "../utils/context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LangContext } from "../utils/langContext";

export default function SimulatorHome({ setBackground }) {
    const { adsLoaded, setShowOpenAd } = useContext(Context);
    const { language } = useContext(LangContext);
    const t = (key, params) => language.t(key, params);
    const router = useRouter();

    async function setGallery() {
        setShowOpenAd(false);
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });
        if (!result.canceled) setBackground(result.assets[0].uri);
    }

    async function setCamera() {
        setShowOpenAd(false);
        const result = await ImagePicker.launchCameraAsync({
            quality: 1,
        });
        if (!result.canceled) {
            setBackground(result.assets[0].uri);
        } else {
            setShowOpenAd(false);
        }
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>{t("simulator_header_title")}</Text>
                </View>
                <View style={styles.headerIconRight} />
            </View>

            {adsLoaded && (
                <View style={styles.adContainer}>
                    <BannerAd unitId={bannerId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} requestOptions={{}} />
                </View>
            )}

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>{t("simulator_hero_title")}</Text>
                <Text style={styles.subtitle}>{t("simulator_hero_subtitle")}</Text>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.actionCard} onPress={setCamera}>
                        <View style={[styles.iconWrap, { backgroundColor: '#F5F3FF' }]}>
                            <MaterialIcons name="photo-camera" size={32} color="#8B5CF6" />
                        </View>
                        <Text style={styles.actionTitle}>{t("simulator_action_camera")}</Text>
                        <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard} onPress={setGallery}>
                        <View style={[styles.iconWrap, { backgroundColor: '#FFE4E9' }]}>
                            <MaterialIcons name="photo-library" size={32} color="#FF3366" />
                        </View>
                        <Text style={styles.actionTitle}>{t("simulator_action_gallery")}</Text>
                        <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
                    </TouchableOpacity>
                </View>

                {/* Instructions Box */}
                <View style={styles.instructionsBox}>
                    <Text style={styles.instructionsTitle}>{t("simulator_instructions_title")}</Text>

                    <View style={styles.stepRow}>
                        <View style={styles.stepDot}><Text style={styles.stepNum}>1</Text></View>
                        <Text style={styles.stepText}>{t("simulator_step_1")}</Text>
                    </View>
                    <View style={styles.stepRow}>
                        <View style={styles.stepDot}><Text style={styles.stepNum}>2</Text></View>
                        <Text style={styles.stepText}>{t("simulator_step_2")}</Text>
                    </View>
                    <View style={styles.stepRow}>
                        <View style={styles.stepDot}><Text style={styles.stepNum}>3</Text></View>
                        <Text style={styles.stepText}>{t("simulator_step_3")}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FE"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 12,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    headerTitleContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
    },
    headerIconRight: {
        width: 44,
        height: 44,
    },
    adContainer: {
        alignItems: "center",
        marginTop: 16,
    },
    content: {
        padding: 24,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 8,
        textAlign: "center"
    },
    subtitle: {
        fontSize: 14,
        color: "#6B7280",
        textAlign: "center",
        marginBottom: 32,
        lineHeight: 20,
        paddingHorizontal: 16,
    },
    actionsContainer: {
        gap: 16,
        marginBottom: 32,
    },
    actionCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    iconWrap: {
        width: 56,
        height: 56,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    actionTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
    },
    instructionsBox: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    instructionsTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 16,
    },
    stepRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 12,
        gap: 12,
    },
    stepDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#F5F3FF",
        justifyContent: "center",
        alignItems: "center",
    },
    stepNum: {
        color: "#8B5CF6",
        fontSize: 12,
        fontWeight: "bold",
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        color: "#4B5563",
        lineHeight: 20,
        marginTop: 2,
    }
});