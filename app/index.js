import { FlatList, StyleSheet, Text, View, StatusBar } from "react-native";
import { Link, Stack } from "expo-router";
import { ui } from "../src/utils/styles";
import LottieView from 'lottie-react-native';
import { useMemo, useState } from "react";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { bannerId } from "../src/utils/constants";
import { categories_raw } from "../src/utils/data";
import { Pressable } from "react-native";
import { Image } from "expo-image";
import Animated from "react-native-reanimated";
import Hero from "../src/layout/home/hero";
import Resources from "../src/layout/home/resources";
import Header from "../src/layout/header/header";

export default function List() {



    return (
        <>
            <Stack.Screen options={{ header: () => <Header /> }} />
            <View style={styles.container} sharedTransitionTag="first">
                <BannerAd unitId={bannerId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} requestOptions={{}} />
                <Hero />
                <Resources />
            </View>
        </>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 24,
        alignItems: "center",
        backgroundColor: "white",
        // paddingTop: StatusBar.currentHeight + 8,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
    },

    title: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    lottie: {
        width: "100%",
        aspectRatio: 1
    },

    list: {
        flex: 1,
        width: "100%",
    },

    itemWrapper: {
        width: "100%",
        flex: 1,
        marginVertical: 16,
        elevation: 10,
        shadowColor: "#5193F1",
        borderWidth: 2,
        borderColor: "#ff85b8",
        borderRadius: 16,
        backgroundColor: "white",
    },

    item: {
        width: "100%",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    image: {
        aspectRatio: 1,
        width: 120,
        borderTopLeftRadius: 14,
        borderBottomLeftRadius: 14
    },

    info: {
        gap: 5,
    }
})