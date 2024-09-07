import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ui } from "../../utils/styles";
import { useRouter } from "expo-router";

export default function Hero() {

    const router = useRouter();

    function navigate() {
        router.push("/simulator");
    }

    return (
        <View style={styles.container}>
            <Text style={ui.h2}>Comienza a dar forma tus propias cejas</Text>
            <TouchableOpacity onPress={navigate} style={styles.button}>
                <Image source={require("../../../assets/eyebrows.png")} style={styles.image} />
                <Text style={ui.h3}>Simulador de cejas</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 24,
    },

    button: {
        flexDirection: "row",
        paddingHorizontal: 24,
        paddingVertical: 6,
        backgroundColor: "#CEC2FF",
        borderWidth: 5,
        borderColor: "#B3B3F1",
        borderRadius: 100,
        alignItems: "center",
        gap: 16
    },

    image: {
        width: 64,
        height: 64
    }
})