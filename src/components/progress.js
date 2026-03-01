import { Text, View } from "react-native";
import { FadeInDown, useAnimatedStyle } from "react-native-reanimated";
import Animated from 'react-native-reanimated';
import { ui } from "../utils/styles";
import { Link } from "expo-router";
import { useContext } from "react";
import { LangContext } from "../utils/langContext";

export default function Progress({ current, qty }) {
    const { language } = useContext(LangContext);
    const t = (key, params) => language.t(key, params);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${(current * 100) / qty}%`
    }));

    return (
        <View style={{ gap: 3, marginHorizontal: 16 }} entering={FadeInDown}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={[ui.text, { fontWeight: "bold", marginLeft: 3, fontSize: 12, color: "#6B7280" }]}>{t("progress_count", { current, total: qty })} </Text>
                {
                    current === qty ?
                        <Link href="/list"><Text style={[ui.text, { fontSize: 16, fontWeight: "bold" }]}>{t("progress_done_message")}</Text></Link>
                        : null
                }
            </View>
            <View style={{ backgroundColor: "rgba(0,0,0,0.5)", height: 16, borderRadius: 16, width: "100%" }}>
                <Animated.View style={[animatedStyle, { backgroundColor: "#92C742", height: 16, borderRadius: 16 }]}></Animated.View>
            </View>
        </View>
    )
}