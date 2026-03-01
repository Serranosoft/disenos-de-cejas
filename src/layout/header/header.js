import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link, usePathname } from "expo-router";
import { ui } from "../../utils/styles";
import { useContext } from "react";
import { LangContext } from "../../utils/langContext";

export default function Header() {
    const { language } = useContext(LangContext);
    const t = (key, params) => language.t(key, params);

    const pathname = usePathname();

    return (
        <View style={styles.header}>
            <Link href="/" asChild style={{ flex: 1 }}>
                <TouchableOpacity>
                    <Text style={ui.h3}>{t("header_app_title")}</Text>
                </TouchableOpacity>
            </Link>
            {
                pathname && pathname === "/simulator" ?
                    <Link href="/" asChild>
                        <TouchableOpacity style={styles.simulator}>
                            <Image source={require("../../../assets/back.png")} style={styles.image} />
                        </TouchableOpacity>
                    </Link>
                    :
                    <Link href="/simulator" asChild>
                        <TouchableOpacity style={styles.simulator}>
                            <Image source={require("../../../assets/eyebrows.png")} style={styles.image} />
                            <Text style={ui.muted}>{t("header_simulator")}</Text>
                        </TouchableOpacity>
                    </Link>

            }
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: "#CEC2FF"
    },

    simulator: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderWidth: 4,
        borderColor: "#B3B3F1",
        borderRadius: 100,
        paddingHorizontal: 8
    },
    image: {
        width: 30,
        height: 30,
        borderRadius: 100
    }
})