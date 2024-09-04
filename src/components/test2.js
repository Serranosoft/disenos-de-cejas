import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedGestureHandler,
    withSpring,
} from 'react-native-reanimated';
import {
    PanGestureHandler,
    PinchGestureHandler,
} from 'react-native-gesture-handler';

export default function Test2() {
    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
  
    const pinchGestureHandler = useAnimatedGestureHandler({
      onActive: (event) => {
        scale.value = event.scale;
      },
      onEnd: () => {
        scale.value = withSpring(scale.value, { damping: 10, stiffness: 100 });
      },
    });
  
    const panGestureHandler = useAnimatedGestureHandler({
      onStart: (_, context) => {
        context.translateX = translateX.value;
        context.translateY = translateY.value;
      },
      onActive: (event, context) => {
        translateX.value = context.translateX + event.translationX;
        translateY.value = context.translateY + event.translationY;
      },
      onEnd: () => {
        translateX.value = withSpring(translateX.value, { damping: 10, stiffness: 100 });
        translateY.value = withSpring(translateY.value, { damping: 10, stiffness: 100 });
      },
    });
  
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { scale: scale.value },
          { translateX: translateX.value },
          { translateY: translateY.value },
        ],
      };
    });

    return (
        <View style={{ zIndex: 1, backgroundColor: "green", width: 200, height: 200, }}>
            <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
                <Animated.View style={{ flex: 1, backgroundColor: "red", zIndex: 1, }}>
                    <PanGestureHandler onGestureEvent={panGestureHandler}>
                        <Animated.Image
                            source={{ uri: 'https://placekitten.com/300/300' }}
                            style={[styles.image, animatedStyle]}
                            resizeMode="contain"
                        />
                    </PanGestureHandler>
                </Animated.View>
            </PinchGestureHandler>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    image: {
        width: 300,
        height: 300,
        backgroundColor: "yellow"
    },
});