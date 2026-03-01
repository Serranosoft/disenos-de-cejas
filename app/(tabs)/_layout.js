import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View, Platform } from "react-native";
import { useContext } from "react";
import { LangContext } from "../../src/utils/langContext";

export default function TabLayout() {
    const { language } = useContext(LangContext);
    const t = (key, params) => language.t(key, params);
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#8B5CF6", // Primary Purple
                tabBarInactiveTintColor: "#6B7280", // Muted Text
                tabBarStyle: {
                    backgroundColor: "#FFFFFF",
                    borderTopWidth: 1,
                    borderTopColor: "#E5E7EB",
                    height: Platform.OS === "ios" ? 85 : 75,
                    paddingBottom: Platform.OS === "ios" ? 25 : 16,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontFamily: "Inter", // Or whatever system font we have
                    fontWeight: "bold",
                    marginTop: 4,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t("tab_home"),
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialIcons name="home" size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="tutorials"
                options={{
                    title: t("tab_tutorials"),
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialIcons name="play-circle-outline" size={26} color={color} />
                    ), // Alternative: "menu-book" or "school" depending on what fits best
                }}
            />
            <Tabs.Screen
                name="symmetry"
                options={{
                    title: t("tab_symmetry"),
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialIcons name="face-retouching-natural" size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="simulator"
                options={{
                    title: t("tab_simulator"),
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialIcons name="auto-fix-high" size={26} color={color} /> // Sparkles / Magic wand
                    ),
                }}
            />
            <Tabs.Screen
                name="kit"
                options={{
                    title: t("tab_kit"),
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialIcons name="shopping-bag" size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: t("tab_settings"),
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialIcons name="settings" size={26} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
