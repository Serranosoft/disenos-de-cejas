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

export default function List() {

    const [categories, setCategories] = useState([])
    useMemo(() => setCategories(categories_raw), [categories]);

    return (
        <View style={styles.container} sharedTransitionTag="first">
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.title}>
                <Text style={ui.h2}>Comienza a dar forma tus propias cejas</Text>
                <Link href="/simulator">
                    <Text>qwe</Text>
                </Link>
            </View>
            <BannerAd unitId={bannerId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} requestOptions={{}} />
            {
                categories.length > 0 ?
                    <View style={styles.list}>
                        <FlatList
                            data={categories}
                            numColumns={1}
                            initialNumToRender={4}
                            renderItem={({ item, i }) => {
                                return (
                                    <Animated.View key={i} style={styles.itemWrapper} sharedTransitionTag="second">
                                        <Link asChild href={{ pathname: "/category", params: { name: item.name, stepsLength: item.steps } }}>
                                            <Pressable>
                                                <View style={styles.item}>
                                                    <Image transition={1000} style={styles.image} source={item.image} placeholder={"LZLruhayXot8W?fQs*jt~8fQ=?js"} />
                                                    <View style={styles.info}>
                                                        <Text style={ui.h3}>{item.name}</Text>
                                                        <Text style={ui.text}>{item.steps} recursos</Text>
                                                    </View>
                                                </View>
                                            </Pressable>
                                        </Link>
                                    </Animated.View>
                                )
                            }}
                        />
                    </View>
                    :
                    <LottieView source={require("../assets/lottie/loading-animation.json")} loop={true} autoPlay={true} />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 24,
        alignItems: "center",
        backgroundColor: "white",
        paddingTop: StatusBar.currentHeight + 24,
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