import { Stack } from "expo-router";
import { View, StatusBar, StyleSheet, AppState } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createRef, useEffect, useState, useMemo } from "react";
import AdsHandler from "../src/components/AdsHandler";
import * as StoreReview from 'expo-store-review';
import { Context } from "../src/utils/context";
import * as Notifications from 'expo-notifications';
import { scheduleWeeklyNotification } from "../src/utils/notifications";
import { userPreferences } from "../src/utils/userPreferences";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import { translations } from '../src/i18n';
import { LangContext } from '../src/utils/langContext';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

export default function Layout() {
    // Idioma
    const [language, setLanguage] = useState(() => {
        try {
            const locales = getLocales();
            return locales?.[0]?.languageCode || "es";
        } catch (e) {
            return "es";
        }
    });

    const i18n = useMemo(() => {
        const i = new I18n(translations);
        if (language) i.locale = language;
        i.enableFallback = true;
        i.defaultLocale = "es";
        return i;
    }, [language]);

    const langContextValue = useMemo(() => ({ setLanguage, language: i18n }), [i18n]);

    useEffect(() => {
        getUserPreferences();
    }, []);

    async function getUserPreferences() {
        const lang = await AsyncStorage.getItem(userPreferences.LANGUAGE);
        let fallback = "es";
        try {
            const locales = getLocales();
            fallback = locales?.[0]?.languageCode || "es";
        } catch (e) { /* ignore */ }
        setLanguage(lang || fallback);
    }

    // Gestión de anuncios
    const [adsLoaded, setAdsLoaded] = useState(false);
    const [adTrigger, setAdTrigger] = useState(0);
    const [showOpenAd, setShowOpenAd] = useState(true);
    const adsHandlerRef = createRef();

    useEffect(() => {
        configureNotifications();
        scheduleWeeklyNotification();
        requestTracking();
    }, [])

    async function requestTracking() {
        const { status } = await requestTrackingPermissionsAsync();
        if (status === 'granted') {
            console.log('Rastreo permitido');
        }
    }

    useEffect(() => {
        if (adTrigger > 2) {
            askForReview();
            setShowOpenAd(false);
        }

        if (adsLoaded) {
            if (adTrigger > 3) {
                adsHandlerRef.current.showIntersitialAd();
                setAdTrigger(0);
            }
        }

    }, [adTrigger])

    async function configureNotifications() {
        const { granted } = await Notifications.requestPermissionsAsync();
        if (granted) {
            await AsyncStorage.setItem(userPreferences.NOTIFICATION_PERMISSION, "true");
            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowBanner: true,
                    shouldShowList: true,
                    shouldPlaySound: false,
                    shouldSetBadge: false,
                }),
            });
        } else {
            await AsyncStorage.setItem(userPreferences.NOTIFICATION_PERMISSION, "false");
        }
    }

    async function askForReview() {
        try {
            if (AppState.currentState !== "active") return;
            if (await StoreReview.hasAction()) {
                StoreReview.requestReview()
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.container}>
            <AdsHandler ref={adsHandlerRef} showOpenAd={showOpenAd} adsLoaded={adsLoaded} setAdsLoaded={setAdsLoaded} setShowOpenAd={setShowOpenAd} />
            <LangContext.Provider value={langContextValue}>
                <Context.Provider value={{ adsLoaded: adsLoaded, setAdTrigger: setAdTrigger, setShowOpenAd: setShowOpenAd }}>
                    <GestureHandlerRootView style={styles.wrapper}>
                        <Stack screenOptions={{ headerStyle: { backgroundColor: '#fff', color: "#fff" }, }}>
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        </Stack>
                    </GestureHandlerRootView>
                </Context.Provider>
            </LangContext.Provider>
            <StatusBar style="light" backgroundColor={"#fff"} />
        </View >
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    wrapper: {
        flex: 1,
        width: "100%",
        alignSelf: "center",
        justifyContent: "center",
    },
})