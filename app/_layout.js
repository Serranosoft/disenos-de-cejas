import { Slot, SplashScreen } from "expo-router";
import { View, StatusBar, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect } from "react";
import { useFonts } from "expo-font";

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

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <GestureHandlerRootView style={styles.wrapper}>
                <Slot />
            </GestureHandlerRootView>
            <StatusBar style="light" />
        </View >
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
    },

})