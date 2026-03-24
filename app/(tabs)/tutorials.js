import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList, Platform } from "react-native";
import { Link, useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { categories_raw } from "../../src/utils/data";
import { useContext, useMemo, useState } from "react";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { bannerId, bannerIdIos } from "../../src/utils/constants";
import { Context } from "../../src/utils/context";
import { LangContext } from "../../src/utils/langContext";

export default function Tutorials() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    useMemo(() => setCategories(categories_raw), []);
    const { adsLoaded } = useContext(Context);
    const { language } = useContext(LangContext);
    const t = (key, params) => language.t(key, params);

    // Only real tutorials
    const featured = categories.filter(c => c.fetch_name.toLowerCase().includes("tutorial"));

    const QUICK_TIPS = [
        { id: '1', title: t("tip_1_title"), text: t("tip_1_text"), color: '#FDBA74' },
        { id: '2', title: t("tip_2_title"), text: t("tip_2_text"), color: '#D4A373' },
        { id: '3', title: t("tip_3_title"), text: t("tip_3_text"), color: '#F472B6' },
        { id: '4', title: t("tip_4_title"), text: t("tip_4_text"), color: '#818CF8' },
        { id: '5', title: t("tip_5_title"), text: t("tip_5_text"), color: '#34D399' },
        { id: '6', title: t("tip_6_title"), text: t("tip_6_text"), color: '#A78BFA' },
        { id: '7', title: t("tip_7_title"), text: t("tip_7_text"), color: '#F87171' },
        { id: '8', title: t("tip_8_title"), text: t("tip_8_text"), color: '#FBBF24' },
        { id: '9', title: t("tip_9_title"), text: t("tip_9_text"), color: '#38BDF8' },
        { id: '10', title: t("tip_10_title"), text: t("tip_10_text"), color: '#FB923C' },
        { id: '11', title: t("tip_11_title"), text: t("tip_11_text"), color: '#E879F9' },
        { id: '12', title: t("tip_12_title"), text: t("tip_12_text"), color: '#2DD4BF' },
    ];

    return (
        <View style={styles.mainScroll}>
            <View style={styles.header}>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>{t("tutorials_header_title")}</Text>
                </View>
                <TouchableOpacity style={styles.headerIconRight}>
                    <MaterialIcons name="notifications-none" size={24} color="#8B5CF6" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Tutorials List */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{t("tutorials_section_title")}</Text>
                    </View>

                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={featured}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={styles.featuredList}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={styles.featuredCard}
                                onPress={() => router.push({ pathname: "/tutoriales/[id]", params: { name: t(item.name_key), fetch_name: item.fetch_name, stepsLength: item.steps } })}
                            >
                                <View style={styles.imageContainer}>
                                    <Image
                                        style={styles.featuredImage}
                                        source={item.image}
                                        placeholder="LZLruhayXot8W?fQs*jt~8fQ=?js"
                                        transition={500}
                                    />
                                    <View style={[styles.badge, styles.badgePop]}>
                                        <Text style={styles.badgeText}>{t("tutorials_badge_popular")}</Text>
                                    </View>
                                </View>
                                <View style={styles.featuredInfo}>
                                    <Text style={styles.featuredTitle} numberOfLines={1}>{t(item.name_key)}</Text>
                                    <Text style={styles.featuredSubtitle} numberOfLines={1}>{t("tutorials_popular_subtitle")}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                    {adsLoaded && (
                        <View style={styles.adContainer}>
                            <BannerAd unitId={Platform.OS === "ios" ? bannerIdIos : bannerId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} requestOptions={{}} />
                        </View>
                    )}
                </View>

                {/* Categories */}
                <View style={styles.section}>
                    <View style={styles.grid}>
                        {/* Category 1 */}
                        <TouchableOpacity style={styles.categoryCard} onPress={() => {
                            const cat = categories.find(c => c.id === "types");
                            router.push({ pathname: "/tutoriales/[id]", params: { name: t(cat.name_key), fetch_name: cat.fetch_name, stepsLength: cat.steps } });
                        }}>
                            <View style={styles.categoryCardHeader}>
                                <View style={styles.categoryIconWrap}>
                                    <MaterialIcons name="face-retouching-natural" size={24} color="#8B5CF6" />
                                </View>
                            </View>
                            <Text style={styles.categoryTitle}>{t("tutorials_category_types")}</Text>
                        </TouchableOpacity>

                        {/* Category 2 */}
                        <TouchableOpacity style={styles.categoryCard} onPress={() => {
                            const cat = categories.find(c => c.id === "designs");
                            router.push({ pathname: "/tutoriales/[id]", params: { name: t(cat.name_key), fetch_name: cat.fetch_name, stepsLength: cat.steps } });
                        }}>
                            <View style={styles.categoryCardHeader}>
                                <View style={styles.categoryIconWrap}>
                                    <MaterialIcons name="brush" size={24} color="#8B5CF6" />
                                </View>
                            </View>
                            <Text style={styles.categoryTitle}>{t("tutorials_category_designs")}</Text>
                        </TouchableOpacity>

                        {/* Category 3 */}
                        <TouchableOpacity style={styles.categoryCard} onPress={() => {
                            const cat = categories.find(c => c.id === "how_to_paint");
                            router.push({ pathname: "/tutoriales/[id]", params: { name: t(cat.name_key), fetch_name: cat.fetch_name, stepsLength: cat.steps } });
                        }}>
                            <View style={styles.categoryCardHeader}>
                                <View style={styles.categoryIconWrap}>
                                    <MaterialIcons name="color-lens" size={24} color="#8B5CF6" />
                                </View>
                            </View>
                            <Text style={styles.categoryTitle}>{t("tutorials_category_paint")}</Text>
                        </TouchableOpacity>

                        {/* Category 4 */}
                        <TouchableOpacity style={styles.categoryCard} onPress={() => {
                            const cat = categories.find(c => c.id === "how_to");
                            router.push({ pathname: "/tutoriales/[id]", params: { name: t(cat.name_key), fetch_name: cat.fetch_name, stepsLength: cat.steps } });
                        }}>
                            <View style={styles.categoryCardHeader}>
                                <View style={styles.categoryIconWrap}>
                                    <MaterialIcons name="auto-fix-high" size={24} color="#8B5CF6" />
                                </View>
                            </View>
                            <Text style={styles.categoryTitle}>{t("tutorials_category_how_to")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Quick Tips */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{t("tutorials_tips_title")}</Text>
                        <MaterialIcons name="lightbulb-outline" size={24} color="#8B5CF6" />
                    </View>

                    {/* Tips List */}
                    {QUICK_TIPS.map((tip) => {
                        // Function to darken a hex color by a percentage (0-100)
                        const darkenColor = (color, percent) => {
                            let R = parseInt(color.substring(1, 3), 16);
                            let G = parseInt(color.substring(3, 5), 16);
                            let B = parseInt(color.substring(5, 7), 16);

                            R = parseInt(R * (100 - percent) / 100);
                            G = parseInt(G * (100 - percent) / 100);
                            B = parseInt(B * (100 - percent) / 100);

                            R = (R < 255) ? R : 255;
                            G = (G < 255) ? G : 255;
                            B = (B < 255) ? B : 255;

                            let RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
                            let GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
                            let BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

                            return "#" + RR + GG + BB;
                        }

                        // We darken the background color by ~40% for the icon
                        const iconColor = darkenColor(tip.color, 40);

                        return (
                            <View key={tip.id} style={styles.tipCard}>
                                <View style={[styles.tipThumb, { backgroundColor: tip.color }]}>
                                    <MaterialIcons name="lightbulb-outline" size={24} color={iconColor} />
                                </View>
                                <View style={styles.tipInfo}>
                                    <Text style={styles.tipTitle}>{tip.title}</Text>
                                    <Text style={styles.tipText}>{tip.text}</Text>
                                </View>
                            </View>
                        );
                    })}

                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainScroll: {
        flex: 1,
        backgroundColor: "#F8F9FE",
    },
    scrollContent: {
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
        borderRadius: 22,
        backgroundColor: "#F5F3FF",
        justifyContent: "center",
        alignItems: "center",
    },
    section: {
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
    },
    featuredList: {
        gap: 16,
        paddingRight: 20, // Final padding
        paddingVertical: 12, // Avoid shadow clipping
    },
    featuredCard: {
        width: 250,
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        overflow: "hidden",
    },
    imageContainer: {
        width: "100%",
        height: 140,
        position: "relative",
    },
    featuredImage: {
        width: "100%",
        height: "100%",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    badge: {
        position: "absolute",
        bottom: 12,
        left: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeNew: {
        backgroundColor: "#8B5CF6",
    },
    badgePop: {
        backgroundColor: "#7C3AED", // Darker purple
    },
    badgeText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "bold",
    },
    featuredInfo: {
        padding: 16,
    },
    featuredTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 4,
    },
    featuredSubtitle: {
        fontSize: 12,
        color: "#6B7280",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 16,
    },
    categoryCard: {
        width: "47%",
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        paddingVertical: 24,
        paddingHorizontal: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    categoryIconWrap: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#F5F3FF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    categoryTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#111827",
        textAlign: "center",
    },
    tipCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    tipThumb: {
        width: 56,
        height: 56,
        borderRadius: 16,
        marginRight: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    tipInfo: {
        flex: 1,
    },
    tipTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 4,
    },
    tipText: {
        fontSize: 12,
        color: "#6B7280",
        lineHeight: 16,
    },
    adContainer: {
        alignItems: "center",
    },
});
