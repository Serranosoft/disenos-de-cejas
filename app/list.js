import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { Stack, router } from "expo-router";
import { ui } from "../src/utils/styles";
import LottieView from 'lottie-react-native';
import { useEffect, useState } from "react";
import { fetchCategories } from "../src/utils/supabase";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { bannerId } from "../src/utils/constants";

export default function List() {

    const [categories, setCategories] = useState([])

    useEffect(() => {
        if (categories.length < 1) {
            fetchCategories(setCategories)
        }
    }, [categories])


    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Text style={ui.h2}>Comienza a dar forma tus propias cejas</Text>
            <BannerAd unitId={bannerId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} requestOptions={{}} />
            {
                categories.length > 0 ?
                    <View style={styles.list}>
                        <FlatList
                            data={categories}
                            numColumns={1}
                            renderItem={({ item, i }) => {
                                return (
                                    <TouchableOpacity key={i} style={styles.itemWrapper} onPress={() => router.push({ pathname: "/category", params: { id: item.id, bucket: item.bucket, name: item.name } })}>
                                        <View style={styles.item}>
                                            <Image
                                                style={styles.image}
                                                source={{ uri: item.image }}
                                                resizeMode="contain"
                                            />
                                            <View style={styles.info}>
                                                <Text style={ui.h3}>{item.name}</Text>
                                                <Text style={ui.text}>{item.steps} recursos</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
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
        gap: 32,
        width: "90%",
        alignSelf: "center",
        alignItems: "center",
        paddingTop: 48,
        paddingBottom: 16,
        backgroundColor: "white",
    },

    list: {
        width: "100%",
    },

    itemWrapper: { 
        padding: 8,
        marginVertical: 16,
        borderWidth: 2,
        borderColor: "#ff85b8",
        borderRadius: 16,
    },

    item: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },

    image: {
        aspectRatio: 1,
        width: 150,
        borderWidth: 3,
    },

    info: {
        width: "100%",
        flex: 1,
        gap: 8,
    }
})