import React, { useState } from 'react';
import { ImageBackground, Dimensions, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { GestureDetector, GestureHandlerRootView, Gesture, PanGestureHandler, TouchableWithoutFeedback } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const YourComponent = () => {
    const imageSize = useSharedValue(250); // Tamaño inicial de la imagen
    const startSize = useSharedValue(250); // Tamaño inicial de la imagen al comenzar el pinch
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const startX = useSharedValue(0);
    const startY = useSharedValue(0);
    const offsetX = useSharedValue(0);
    const offsetY = useSharedValue(0);


    const [imgSelected, setImgSelected] = useState(null);

    // Definir la función clamp como worklet
    const clamp = (value, min, max) => {
        'worklet';
        return Math.max(min, Math.min(value, max));
    };

    // Configuración de la gestura de pinza (pinch)
    const pinch = Gesture.Pinch()
        .onStart((event) => {
            startSize.value = imageSize.value;
            startX.value = translateX.value;
            startY.value = translateY.value;

            // Calcular el offset inicial del pinch
            offsetX.value = event.focalX;
            offsetY.value = event.focalY;
        })
        .onUpdate((event) => {
            const newSize = clamp(startSize.value * event.scale, 50, 200); // Ajusta el rango según tus necesidades
            imageSize.value = withSpring(newSize);
        });

    // Configuración de la gestura de arrastre (drag)
    const drag = Gesture.Pan()
        .onStart(() => {
            startX.value = translateX.value;
            startY.value = translateY.value;
        })
        .onUpdate((event) => {
            // Ajuste de las traducciones según la escala actual
            translateX.value = startX.value + event.translationX;
            translateY.value = startY.value + event.translationY;
        });

    const animatedStyle = useAnimatedStyle(() => ({
        width: imageSize.value,
        height: imageSize.value,
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
        ],
    }));

    return (
        <GestureHandlerRootView style={styles.fullScreen}>
            <GestureDetector gesture={Gesture.Simultaneous(pinch, drag)}>
                <ImageBackground source={require("../assets/qwe.jpg")} style={styles.background}>
                    <Animated.View>
                        <TouchableWithoutFeedback onPress={() => setImgSelected(1)}>
                            <Animated.Image
                                source={require("../assets/asd.jpg")}
                                style={[styles.image, imgSelected === 1 && animatedStyle]}
                            />
                        </TouchableWithoutFeedback>
                    </Animated.View>
                    <Animated.View>
                        <TouchableWithoutFeedback onPress={() => setImgSelected(2)}>
                            <Animated.Image
                                source={require("../assets/asd.jpg")}
                                style={[styles.image, imgSelected === 2 && animatedStyle]}
                            />
                        </TouchableWithoutFeedback>
                    </Animated.View>
                </ImageBackground>
            </GestureDetector>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    background: {
        width: "100%",
        height: "100%",
        zIndex: 1,
    },
    fullScreen: {
        flex: 1,
    },
    image: {
        borderWidth: 3,
        borderColor: "red",
    },
});

export default YourComponent;
