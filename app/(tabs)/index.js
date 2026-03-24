import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, ImageBackground, Modal, Platform } from "react-native";
import { Link, useRouter } from "expo-router";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { bannerId, bannerIdIos } from "../../src/utils/constants";
import { useContext, useState, useEffect } from "react";
import { Context } from "../../src/utils/context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import UpdatesModal from "../../src/components/UpdatesModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';
import { LangContext } from "../../src/utils/langContext";

export default function Home() {
    const { adsLoaded } = useContext(Context);
    const { language } = useContext(LangContext);
    const t = (key, params) => language.t(key, params);
    const router = useRouter();

    const [reminderModalVisible, setReminderModalVisible] = useState(false);
    const [selectedWeeks, setSelectedWeeks] = useState(null);

    useEffect(() => {
        loadReminderSettings();
    }, []);

    const loadReminderSettings = async () => {
        try {
            // Request permissions just in case
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log('Notification permissions not granted');
            }

            const saved = await AsyncStorage.getItem('@retouch_reminder');
            if (saved !== null) {
                setSelectedWeeks(parseInt(saved, 10));
            }
        } catch (e) {
            console.log("Error loading reminders", e);
        }
    };

    const scheduleReminder = async (weeks) => {
        try {
            // Cancel any previously scheduled retouch reminders
            const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
            for (const notif of scheduledNotifications) {
                if (notif.content.data?.type === 'retouch_reminder') {
                    await Notifications.cancelScheduledNotificationAsync(notif.identifier);
                }
            }

            if (weeks === null) {
                // If user selected "Desactivar"
                await AsyncStorage.removeItem('@retouch_reminder');
                setSelectedWeeks(null);
                setReminderModalVisible(false);
                return;
            }

            // Schedule new notification
            // 1 week = 7 * 24 * 60 * 60 seconds
            const secondsInWeek = 604800;
            const triggerSeconds = weeks * secondsInWeek;

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: t("home_reminder_title"),
                    body: t("home_reminder_body"),
                    data: { type: 'retouch_reminder' },
                },
                trigger: {
                    seconds: triggerSeconds,
                    repeats: true,
                },
            });

            await AsyncStorage.setItem('@retouch_reminder', weeks.toString());
            setSelectedWeeks(weeks);
            setReminderModalVisible(false);

        } catch (e) {
            console.log("Error scheduling reminder", e);
        }
    };

    return (
        <View style={styles.mainScroll}>
            <UpdatesModal />
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{t("home_header_title")}</Text>
                </View>
                <TouchableOpacity style={styles.notificationBtn} onPress={() => setReminderModalVisible(true)}>
                    <MaterialIcons name="notifications-none" size={24} color="#8B5CF6" />
                    {selectedWeeks && (
                        <View style={styles.activeNotificationDot} />
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Ads */}
                {adsLoaded && (
                    <View style={styles.adContainer}>
                        <BannerAd unitId={Platform.OS === "ios" ? bannerIdIos : bannerId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} requestOptions={{}} />
                    </View>
                )}

                {/* Main Hero Banner */}
                <View style={styles.heroBanner}>
                    <Image
                        source={require("../../assets/symmetry.jpg")}
                        style={[StyleSheet.absoluteFillObject, { width: '100%', height: '100%' }]}
                        resizeMode="cover"
                    />
                    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(139, 92, 246, 0.35)' }]} />
                    <View style={styles.heroContent}>
                        <Text style={styles.heroBadge}>{t("home_hero_badge")}</Text>
                        <Text style={styles.heroTitle}>{t("home_hero_title")}</Text>
                        <TouchableOpacity style={styles.heroButton} onPress={() => router.push("/symmetry")}>
                            <Text style={styles.heroButtonText}>{t("home_hero_button")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Professional Tools */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t("home_section_tools")}</Text>
                    <View style={styles.grid}>
                        {/* Tool 1 */}
                        <TouchableOpacity style={styles.toolCard} onPress={() => router.push("/tutorials")}>
                            <View style={[styles.toolIconWrap, { backgroundColor: '#F5F3FF' }]}>
                                <MaterialIcons name="play-circle-filled" size={28} color="#8B5CF6" />
                            </View>
                            <Text style={styles.toolTitle}>{t("home_tool_tutorials_title")}</Text>
                            <Text style={styles.toolSubtitle}>{t("home_tool_tutorials_subtitle")}</Text>
                        </TouchableOpacity>

                        {/* Tool 2 */}
                        <TouchableOpacity style={styles.toolCard} onPress={() => router.push("/simulator")}>
                            <View style={[styles.toolIconWrap, { backgroundColor: '#F5F3FF' }]}>
                                <MaterialIcons name="auto-fix-high" size={28} color="#8B5CF6" />
                            </View>
                            <Text style={styles.toolTitle}>{t("home_tool_simulator_title")}</Text>
                            <Text style={styles.toolSubtitle}>{t("home_tool_simulator_subtitle")}</Text>
                        </TouchableOpacity>

                        {/* Tool 3 */}
                        <TouchableOpacity style={styles.toolCard} onPress={() => router.push("/symmetry")}>
                            <View style={[styles.toolIconWrap, { backgroundColor: '#F5F3FF' }]}>
                                <MaterialIcons name="grid-on" size={28} color="#8B5CF6" />
                            </View>
                            <Text style={styles.toolTitle}>{t("home_tool_symmetry_title")}</Text>
                            <Text style={styles.toolSubtitle}>{t("home_tool_symmetry_subtitle")}</Text>
                        </TouchableOpacity>

                        {/* Tool 4 */}
                        <TouchableOpacity style={styles.toolCard} onPress={() => router.push("/kit")}>
                            <View style={[styles.toolIconWrap, { backgroundColor: '#F5F3FF' }]}>
                                <MaterialIcons name="shopping-bag" size={28} color="#8B5CF6" />
                            </View>
                            <Text style={styles.toolTitle}>{t("home_tool_kit_title")}</Text>
                            <Text style={styles.toolSubtitle}>{t("home_tool_kit_subtitle")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Reminder Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={reminderModalVisible}
                onRequestClose={() => setReminderModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t("home_modal_reminder_title")}</Text>
                            <TouchableOpacity onPress={() => setReminderModalVisible(false)}>
                                <MaterialIcons name="close" size={24} color="#111827" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalDescription}>
                            {t("home_modal_reminder_description")}
                        </Text>

                        <View style={styles.optionsContainer}>
                            <TouchableOpacity
                                style={[styles.optionBtn, selectedWeeks === 1 && styles.optionBtnActive]}
                                onPress={() => scheduleReminder(1)}
                            >
                                <MaterialIcons name="event" size={24} color={selectedWeeks === 1 ? "#8B5CF6" : "#6B7280"} />
                                <View style={styles.optionTextWrap}>
                                    <Text style={[styles.optionTitle, selectedWeeks === 1 && styles.optionTitleActive]}>{t("home_modal_reminder_option1")}</Text>
                                    <Text style={styles.optionSubtitle}>{t("home_modal_reminder_option1_subtitle")}</Text>
                                </View>
                                {selectedWeeks === 1 && <MaterialIcons name="check-circle" size={24} color="#8B5CF6" />}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.optionBtn, selectedWeeks === 2 && styles.optionBtnActive]}
                                onPress={() => scheduleReminder(2)}
                            >
                                <MaterialIcons name="event" size={24} color={selectedWeeks === 2 ? "#8B5CF6" : "#6B7280"} />
                                <View style={styles.optionTextWrap}>
                                    <Text style={[styles.optionTitle, selectedWeeks === 2 && styles.optionTitleActive]}>{t("home_modal_reminder_option2")}</Text>
                                    <Text style={styles.optionSubtitle}>{t("home_modal_reminder_option2_subtitle")}</Text>
                                </View>
                                {selectedWeeks === 2 && <MaterialIcons name="check-circle" size={24} color="#8B5CF6" />}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.optionBtn, selectedWeeks === 3 && styles.optionBtnActive]}
                                onPress={() => scheduleReminder(3)}
                            >
                                <MaterialIcons name="event" size={24} color={selectedWeeks === 3 ? "#8B5CF6" : "#6B7280"} />
                                <View style={styles.optionTextWrap}>
                                    <Text style={[styles.optionTitle, selectedWeeks === 3 && styles.optionTitleActive]}>{t("home_modal_reminder_option3")}</Text>
                                    <Text style={styles.optionSubtitle}>{t("home_modal_reminder_option3_subtitle")}</Text>
                                </View>
                                {selectedWeeks === 3 && <MaterialIcons name="check-circle" size={24} color="#8B5CF6" />}
                            </TouchableOpacity>
                        </View>

                        {selectedWeeks !== null && (
                            <TouchableOpacity style={styles.disableBtn} onPress={() => scheduleReminder(null)}>
                                <Text style={styles.disableBtnText}>{t("home_modal_reminder_disable")}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    mainScroll: {
        flex: 1,
        backgroundColor: "#F8F9FE",
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
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
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#E5E7EB",
    },
    welcomeText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#8B5CF6",
        letterSpacing: 0.5,
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
    },
    notificationBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#F5F3FF",
        justifyContent: "center",
        alignItems: "center",
        position: 'relative',
    },
    activeNotificationDot: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        borderWidth: 1,
        borderColor: '#F5F3FF',
    },
    adContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    heroBanner: {
        width: "100%",
        borderRadius: 24,
        backgroundColor: "transparent",
        overflow: "hidden",
        marginBottom: 32,
        shadowColor: "#8B5CF6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    heroContent: {
        justifyContent: "center",
        padding: 24,
    },
    heroBadge: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 10,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 12,
        overflow: "hidden",
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 16,
        lineHeight: 32,
    },
    heroButton: {
        backgroundColor: "#FFFFFF",
        alignSelf: "flex-start",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    heroButtonText: {
        color: "#8B5CF6",
        fontWeight: "bold",
        fontSize: 14,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 16,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 16,
    },
    toolCard: {
        width: "47%",
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    toolIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    toolTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 4,
    },
    toolSubtitle: {
        fontSize: 12,
        color: "#6B7280",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
    },
    modalDescription: {
        fontSize: 14,
        color: "#4B5563",
        marginBottom: 24,
        lineHeight: 20,
    },
    optionsContainer: {
        gap: 12,
    },
    optionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#F9FAFB',
        borderWidth: 2,
        borderColor: '#F3F4F6',
    },
    optionBtnActive: {
        backgroundColor: '#F5F3FF',
        borderColor: '#8B5CF6',
    },
    optionTextWrap: {
        flex: 1,
        marginLeft: 16,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4B5563',
        marginBottom: 2,
    },
    optionTitleActive: {
        color: '#8B5CF6',
    },
    optionSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    disableBtn: {
        marginTop: 24,
        paddingVertical: 14,
        borderRadius: 16,
        backgroundColor: '#FEF2F2',
        alignItems: 'center',
    },
    disableBtnText: {
        color: '#EF4444',
        fontWeight: 'bold',
        fontSize: 15,
    }
});