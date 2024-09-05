import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS, withSpring } from 'react-native-reanimated';

export default function ImageSimulator({ imageSelected, onPress, uri, id }) {

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const startX = useSharedValue(); // Valor de X al iniciar el gesto
    const startY = useSharedValue(); // Valor de Y al iniciar el gesto
    const offsetX = useSharedValue(0);
    const offsetY = useSharedValue(0);
    const imageSize = useSharedValue(100); // Tamaño inicial de la imagen
    const startSize = useSharedValue(100); // Tamaño inicial de la imagen al comenzar el pinch

    // Definir la función clamp como worklet
    const clamp = (value, min, max) => {
        'worklet';
        return Math.max(min, Math.min(value, max));
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value }
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
                const newSize = clamp(startSize.value * event.scale, 25, 200);
                imageSize.value = withSpring(newSize);
            }
        });

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
        });

    return (
        <GestureDetector gesture={Gesture.Simultaneous(pinch, drag)}>
            <Animated.View
                onTouchStart={onPress}
                style={[ animatedStyle, styles.container, { borderWidth: imageSelected === id ? 3 : 0 }]}
            >
                <Animated.Image source={{ uri }} style={widthStyle} />
            </Animated.View>
        </GestureDetector>

    );
}

const styles = StyleSheet.create({
    container: {
        borderColor: "red",
        borderRadius: 8,
        padding: 32,
        position: "absolute",
        top: 50,
        left: 50,
        zIndex: 2
    }
})