import { Dimensions, Image, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { useAnimatedStyle, withDelay, Easing, withTiming, useSharedValue } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { View } from "react-native";
import Loading from "./loading";
import { useState } from "react";

export default function Card({ setTriggerAd, images, setCurrent, current, stepsLength }) {

    const position = useSharedValue(0);

    const tap = Gesture.Pan().runOnJS(true)
        .activeOffsetX([60, 60])
        .onUpdate((e) => {
            position.value = e.translationX;
        })
        .onEnd((e) => {
            if (e.translationX < -60) {
                if ((current + 1) < stepsLength) {
                    position.value = withTiming(position.value * 10, { duration: 400, easing: Easing.ease });
                    if (e.translationX < 60 && e.translationX > -60) {
                        position.value = withTiming(0, { duration: 400, easing: Easing.ease });
                    }
                    setTimeout(() => {
                        setCurrent((current) => current + 1);
                        position.value = Dimensions.get("window").width;
                        position.value = withDelay(25, withTiming(0, { duration: 300, easing: Easing.ease }))
                        setTriggerAd((triggerAd) => triggerAd + 1);
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
                        setCurrent((current) => current - 1);
                        position.value = -Dimensions.get("window").width;
                        position.value = withDelay(25, withTiming(0, { duration: 300, easing: Easing.ease }))
                        setTriggerAd((triggerAd) => triggerAd + 1);
                    }, 250)

                } else {
                    position.value = withDelay(25, withTiming(0, { duration: 300, easing: Easing.ease }))
                }
            }

        })

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: position.value }],
    }));

    const [imageLoaded, setImageLoaded] = useState(false);


    return (
        <GestureDetector gesture={tap}>
            {images ?

                <Animated.View style={[animatedStyle, styles.wrapper]}>
                    <View style={styles.card}>
                        {images[current] &&
                            <Image
                                style={styles.image}
                                source={{ uri: images[current] }}
                                resizeMode="contain"
                                onError={() => setImageLoaded(false)}
                                onLoadEnd={() => setImageLoaded(true)}
                            />
                        }
                        { !imageLoaded && <Loading /> }
                    </View>
                </Animated.View>
                :
                <Loading />
            }
        </GestureDetector>
    )

}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center",
        marginHorizontal: 20,
    },
    card: {
        width: "100%",
        paddingHorizontal: 18,
        paddingVertical: 8,
        gap: 24,
    },
    image: {
        width: "100%",
        height: "100%",
    }
})