import { Dimensions, StyleSheet, Text, View } from "react-native";
import { ui } from "../src/utils/styles";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../src/supabaseClient";
import LottieView from 'lottie-react-native';
import { useAnimatedStyle, withDelay, Easing, withTiming, useSharedValue } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated from 'react-native-reanimated';
import { Image } from 'expo-image';
import Progress from "../src/components/progress";

export default function Category() {

    const params = useLocalSearchParams();
    const { id, bucket, name } = params;

    const [image, setImage] = useState(null);
    const [routes, setRoutes] = useState([]);

    const [current, setCurrent] = useState(0);
    const position = useSharedValue(0);

    useEffect(() => {
        if (id) {
            fetch();
        }
    }, [id])

    async function fetch() {
        await supabase.storage.from("images").list(bucket, {}).then((res) => {
            const arr = res.data.map(item => item.name && item.name);
            setRoutes(arr);
        })
    }

    useEffect(() => {
        if (routes.length > 0) {
            const { data } = supabase.storage.from("images").getPublicUrl(`${bucket}/${routes[current]}`);
            setImage(data.publicUrl);
        }
    }, [current, routes])

    const tap = Gesture.Pan().runOnJS(true)
        .activeOffsetX([60, 60])
        .onUpdate((e) => {
            position.value = e.translationX;
        })
        .onEnd((e) => {
            if (e.translationX < -60) {
                if ((current + 1) < routes.length) {
                    position.value = withTiming(position.value * 10, { duration: 400, easing: Easing.ease });
                    if (e.translationX < 60 && e.translationX > -60) {
                        position.value = withTiming(0, { duration: 400, easing: Easing.ease });
                    }
                    setTimeout(() => {
                        setCurrent(current + 1);
                        position.value = Dimensions.get("window").width;
                        position.value = withDelay(25, withTiming(0, { duration: 300, easing: Easing.ease }))
                    }, 250)
                } else {
                    // Cargar una vista con el final   
                    position.value = withDelay(25, withTiming(0, { duration: 300, easing: Easing.ease }));
                }
            } else if (e.translationX > 60) {
                if (current > 0) {
                    position.value = withTiming(position.value * 10, { duration: 400, easing: Easing.ease });
                    if (e.translationX < 60 && e.translationX > -60) {
                        position.value = withTiming(0, { duration: 400, easing: Easing.ease });
                    }
                    setTimeout(() => {
                        setCurrent(current - 1);
                        position.value = -Dimensions.get("window").width;
                        position.value = withDelay(25, withTiming(0, { duration: 300, easing: Easing.ease }))
                    }, 250)

                } else {
                    position.value = withDelay(25, withTiming(0, { duration: 300, easing: Easing.ease }))
                }
            }

        })


    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: position.value }],
    }));


    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <GestureDetector gesture={tap}>
                {image ?
                    <Animated.View style={[animatedStyle, styles.wrapper]}>
                        <Text style={ui.h2}>{name}</Text>
                        <Image style={styles.image} source={{ uri: image }} />
                    </Animated.View>
                    :
                    <LottieView source={require("../assets/lottie/loading-animation.json")} loop={true} autoPlay={true} />
                }
            </GestureDetector>
            {image && <Progress current={current} qty={routes.length} />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        width: "90%",
        alignSelf: "center",
        paddingTop: 24,
        paddingBottom: 12,
    },
    wrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    card: {
        width: "100%",
        paddingHorizontal: 24,
        paddingVertical: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#ff85b8",
        borderRadius: 16,
    },
    image: {
        width: "90%",
        aspectRatio: 1,
        contentFit: "contain",
    }
})