import { useEffect } from "react";
import { Text, View } from "react-native";
import { useAnimatedStyle } from "react-native-reanimated";
import Animated from 'react-native-reanimated';
import { ui } from "../utils/styles";
import { Link } from "expo-router";

export default function Progress({ current, qty }) {

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${((current + 1) * 100) / qty}%`
    }));

    return (
        <View style={{ marginBottom: 8, gap: 3 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={[ui.text, { fontWeight: "bold" }]}>{current + 1} / {qty} </Text>
                {
                    (current + 1) === (qty) ?
                        <Link href="/list"><Text style={[ui.text, { fontSize: 16, fontWeight: "bold" }]}>¡Listo! Toca aquí para ver otra guía</Text></Link>
                        :
                        <Text style={[ui.text, { fontSize: 16 }]}>Desliza para ver el siguiente recurso</Text>
                }
            </View>
            <View style={{ backgroundColor: "rgba(0,0,0,0.5)", height: 16, borderRadius: 16, width: "100%" }}>
                <Animated.View style={[animatedStyle, { backgroundColor: "#92C742", height: 16, borderRadius: 16 }]}></Animated.View>
            </View>
        </View>
    )
}