import { FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { ui } from "../../../src/utils/styles";
import LottieView from 'lottie-react-native';
import { useMemo, useState } from "react";
import { categories_raw } from "../../../src/utils/data";
import { Image } from "expo-image";
import Animated from "react-native-reanimated";

export default function Resources() {

    const [categories, setCategories] = useState([])
    useMemo(() => setCategories(categories_raw), [categories]);

    return (
        <View style={{ flex: 1 }}>
            <Text style={ui.h2}>Recursos</Text>
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
                                            <TouchableOpacity>
                                                <View style={styles.item}>
                                                    <Image transition={1000} style={styles.image} source={item.image} placeholder={"LZLruhayXot8W?fQs*jt~8fQ=?js"} />
                                                    <Text style={ui.h3}>{item.name}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </Link>
                                    </Animated.View>
                                )
                            }}
                        />
                    </View>
                    :
                    <LottieView source={require("../../../assets/lottie/loading-animation.json")} loop={true} autoPlay={true} />
            }
        </View>
    )
}

const styles = StyleSheet.create({

    list: {
        flex: 1,
        width: "100%",
        paddingTop: 16
    },

    itemWrapper: {
        width: "100%",
        flex: 1,
        marginVertical: 16,
        borderRadius: 16,
        backgroundColor: "#CEC2FF",
        borderWidth: 5,
        borderColor: "#B3B3F1",
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
})