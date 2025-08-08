import { SplashScreen, Stack } from "expo-router";
import { View, StatusBar, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createRef, useEffect, useState } from "react";
import { useFonts } from "expo-font";
import AdsHandler from "../src/components/AdsHandler";
import * as StoreReview from 'expo-store-review';
import { Context } from "../src/utils/context";

SplashScreen.preventAutoHideAsync();
export default function Layout() {

    // Carga de fuentes.
    const [fontsLoaded] = useFonts({
        "Changa": require("../assets/fonts/Changa/Changa.ttf"),
        "Slabo": require("../assets/fonts/Slabo/Slabo.ttf")
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded])

    // Gestión de anuncios
    const [adsLoaded, setAdsLoaded] = useState(false);
    const [adTrigger, setAdTrigger] = useState(0);
    const [showOpenAd, setShowOpenAd] = useState(true);
    const adsHandlerRef = createRef();

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

    async function askForReview() {
        if (await StoreReview.hasAction()) {
            StoreReview.requestReview()
        }
    }

    if (!fontsLoaded) {
        return null;
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