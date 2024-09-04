import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS, withSpring } from 'react-native-reanimated';

export default function ImageSimulator({ imageSelected, onPress, uri, id, updateImagePosition }) {

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const startX = useSharedValue(0); // Valor de X al iniciar el gesto
    const startY = useSharedValue(0); // Valor de Y al iniciar el gesto
    const offsetX = useSharedValue(0);
    const offsetY = useSharedValue(0);
    const imageSize = useSharedValue(250); // Tamaño inicial de la imagen
    const startSize = useSharedValue(250); // Tamaño inicial de la imagen al comenzar el pinch

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
    
                // Calcular el offset inicial del pinch
                offsetX.value = event.focalX;
                offsetY.value = event.focalY;
            }
        })
        .onUpdate((event) => {
            if (imageSelected === id ) {
                const newSize = clamp(startSize.value * event.scale, 25, 200); // Ajusta el rango según tus necesidades
                imageSize.value = withSpring(newSize);
            }
        });

    const drag = Gesture.Pan()
        .onStart((event) => {
            if (imageSelected === id) {
                // Guardar la posición inicial al comenzar el gesto
                startX.value = translateX.value;
                startY.value = translateY.value;
            }
        })
        .onUpdate((event) => {
            if (imageSelected === id ) {
                translateX.value = startX.value + event.translationX;
                translateY.value = startY.value + event.translationY;
            }
        })
        .onEnd(() => {
            if (imageSelected === id ) {
                runOnJS(updateImagePosition)(id, translateX.value, translateY.value);
            }
        });

    return (
        <GestureDetector gesture={Gesture.Simultaneous(pinch, drag)}>
            <View style={{ zIndex: 2 }}>
                <Animated.View
                    onTouchStart={onPress}
                    style={[
                        animatedStyle,
                        {
                            borderWidth: imageSelected === id ? 3:0,
                            borderColor: "red",
                            borderRadius: 8,
                            padding: 40,
                            position: "absolute",
                            zIndex: 1000000
                        }
                    ]}
                >
                    <Animated.Image
                        source={{ uri }}
                        style={[
                            widthStyle,
                            { width: 100, height: 100 }
                        ]}
                    />
                </Animated.View>
            </View>
        </GestureDetector>
    );
}