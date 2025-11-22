import { Stack } from "expo-router";
import { View, StatusBar, StyleSheet, AppState } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createRef, useEffect, useState } from "react";
import AdsHandler from "../src/components/AdsHandler";
import * as StoreReview from 'expo-store-review';
import { Context } from "../src/utils/context";
import * as Notifications from 'expo-notifications';
import { scheduleWeeklyNotification } from "../src/utils/notifications";
import { userPreferences } from "../src/utils/userPreferences";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Layout() {

    // Gestión de anuncios
    const [adsLoaded, setAdsLoaded] = useState(false);
    const [adTrigger, setAdTrigger] = useState(0);
    const [showOpenAd, setShowOpenAd] = useState(true);
    const adsHandlerRef = createRef();

    useEffect(() => {
        configureNotifications();
        scheduleWeeklyNotification();
    }, [])

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
            <Context.Provider value={{ adsLoaded: adsLoaded, setAdTrigger: setAdTrigger, setShowOpenAd: setShowOpenAd }}>
                <GestureHandlerRootView style={styles.wrapper}>
                    <Stack screenOptions={{ headerStyle: { backgroundColor: '#fff', color: "#fff" }, }} />
                </GestureHandlerRootView>
            </Context.Provider>
            <StatusBar style="light" backgroundColor={"#CEC2FF"} />
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