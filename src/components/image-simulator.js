import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { useContext } from "react";
import { LangContext } from "../utils/langContext";

export default function ImageSimulator({ imageSelected, onPress, uri, id, removeImage }) {
    const { language } = useContext(LangContext);
    const t = (key, params) => language.t(key, params);

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const startX = useSharedValue(); // Valor de X al iniciar el gesto
    const startY = useSharedValue(); // Valor de Y al iniciar el gesto
    const offsetX = useSharedValue(0);
    const offsetY = useSharedValue(0);
    const imageSize = useSharedValue(100); // Tamaño inicial de la imagen
    const startSize = useSharedValue(100); // Tamaño inicial de la imagen al comenzar el pinch
    const rotation = useSharedValue(0);
    const savedRotation = useSharedValue(0);
    const startRotation = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { rotateZ: `${(rotation.value / Math.PI) * 180}deg` }
            ],
        };
    });

    const widthStyle = useAnimatedStyle(() => {
        return {
            width: imageSize.value,
            height: imageSize.value,
        };
    });

    const pinch = Gesture.Pinch()
        .onStart((event) => {
            if (imageSelected === id) {
                startSize.value = imageSize.value;
                startX.value = translateX.value;
                startY.value = translateY.value;
                offsetX.value = event.focalX;
                offsetY.value = event.focalY;
            }
        })
        .onUpdate((event) => {
            if (imageSelected === id) {
                const newSize = startSize.value * event.scale;
                imageSize.value = newSize;
            }
        })


    const drag = Gesture.Pan()
        .onStart((event) => {
            if (imageSelected === id) {
                startX.value = translateX.value;
                startY.value = translateY.value;
            }
        })
        .onUpdate((event) => {
            if (imageSelected === id) {
                translateX.value = startX.value + event.translationX;
                translateY.value = startY.value + event.translationY;
            }
        })

    const rotate = Gesture.Rotation()
        .onStart(() => {
            if (imageSelected === id) {
                startRotation.value = savedRotation.value;
            }
        })
        .onUpdate((e) => {
            if (imageSelected === id) {
                rotation.value = startRotation.value + e.rotation;
            }
        })
        .onEnd(() => {
            if (imageSelected === id) {
                savedRotation.value = rotation.value;
            }
        });

    return (
        <GestureDetector gesture={Gesture.Simultaneous(pinch, rotate, drag)}>
            <Animated.View
                onTouchStart={onPress}
                style={[animatedStyle, styles.container]}
                accessible={true}
                accessibilityRole="image"
                accessibilityLabel={t("simulator_accessibility_eyebrow")}
                accessibilityHint={t("simulator_accessibility_hint")}
            >
                {
                    imageSelected === id &&
                    <View style={styles.borderWrapper}>
                        <TouchableOpacity
                            onPress={removeImage}
                            style={styles.remove}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel={t("simulator_accessibility_remove")}
                        >
                            <Image source={require("../../assets/remove.png")} style={{ width: 25, height: 25 }} />
                        </TouchableOpacity>
                    </View>
                }
                <Animated.Image source={uri} style={widthStyle} resizeMode="contain" />
            </Animated.View>
        </GestureDetector>

    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        padding: 24,
        position: "absolute",
        top: 50,
        left: 50,
        zIndex: 2
    },

    remove: {
        justifyContent: "center",
        alignItems: "center",
        width: 35,
        height: 35,
        position: "absolute",
        top: -24,
        left: -16,
        borderRadius: 100,
        backgroundColor: "#CEC2FF",
    },

    borderWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderColor: "#CEC2FF",
        borderStyle: "solid",
        borderWidth: 4,
        borderRadius: 8,
        zIndex: 1,
    },
})