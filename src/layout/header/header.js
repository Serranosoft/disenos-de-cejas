import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link, usePathname } from "expo-router";
import { ui } from "../../utils/styles";

export default function Header() {

    const pathname = usePathname();

    return (
        <View style={styles.header}>
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
                            <Text style={ui.muted}>Simulador</Text>
                        </TouchableOpacity>
                    </Link>
                
            }
            <Link href="/" asChild>
                <TouchableOpacity>
                    <Text style={ui.h3}>Diseños de cejas</Text>
                </TouchableOpacity>
            </Link>
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