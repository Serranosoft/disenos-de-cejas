import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link, usePathname } from "expo-router";
import { ui } from "../../utils/styles";

export default function HeaderSimulator({ save }) {

    return (
        <View style={styles.header}>
            <Link href="/" asChild>
                <TouchableOpacity style={styles.simulator}>
                    <Image source={require("../../../assets/back.png")} style={styles.image} />
                </TouchableOpacity>
            </Link>

            <TouchableOpacity style={styles.download} onPress={save}>
                <Text style={ui.h3}>Descargar</Text>
                <Image source={require("../../../assets/save.png")} style={styles.image} />
            </TouchableOpacity>
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
    },

    download: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    }
})