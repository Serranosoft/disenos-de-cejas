import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ui } from "../utils/styles";
import * as ImagePicker from 'expo-image-picker';
import { Stack } from "expo-router";
import Header from "./header/header";
export default function SimulatorHome({ setBackground }) {

    async function setGallery() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) setBackground(result.assets[0].uri);
    }

    async function setCamera() {
        const result = await ImagePicker.launchCameraAsync({
            // allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) setBackground(result.assets[0].uri);
    }


    return (
        <>
            <Stack.Screen options={{ header: () => <Header /> }} />
            <View style={styles.container}>
                <Text style={ui.h2}>Hazte una foto o elige una de la galería</Text>

                <View style={styles.wrapper}>
                    <TouchableOpacity style={styles.action} onPress={setCamera}>
                        <Image source={require("../../assets/camera.png")} style={styles.image} />
                        <Text style={[styles.textWrap, ui.h3]}>Hacer una foto con la cámara</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.action} onPress={setGallery}>
                        <Image source={require("../../assets/gallery.png")} style={styles.image} />
                        <Text style={[styles.textWrap, ui.h3]}>Elegir una imagen de la galería</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.wrapper}>
                    <View style={styles.stepRow}>
                        <View style={styles.description}>
                            <Text style={ui.h2}>1.</Text>
                            <Text style={ui.text}>Elige las cejas que quieres probar</Text>
                        </View>
                        <Image source={require("../../assets/tap.png")} style={styles.icon} />
                    </View>
                    <View style={styles.stepRow}>
                        <View style={styles.description}>
                            <Text style={ui.h2}>2.</Text>
                            <Text style={ui.text}>Coloca las cejas en la posición deseada</Text>
                        </View>
                        <Image source={require("../../assets/move.png")} style={styles.icon} />
                    </View>
                    <View style={styles.stepRow}>
                        <View style={styles.description}>
                            <Text style={ui.h2}>3.</Text>
                            <Text style={ui.text}>Haz las cejas mas grandes o pequeñas</Text>
                        </View>
                        <Image source={require("../../assets/pinch.png")} style={styles.icon} />
                    </View>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "#fff",
        padding: 20
    },

    wrapper: {
        marginTop: 48,
        gap: 32,
    },

    textWrap: {
        flex: 1,
        flexWrap: "wrap"
    },

    image: {
        width: 64,
        height: 64,
    },

    action: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 6,
        backgroundColor: "#CEC2FF",
        borderWidth: 5,
        borderColor: "#B3B3F1",
        borderRadius: 100,
        gap: 16
    },

    stepRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 48
    },

    description: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 16
    },

    icon: {
        width: 50,
        height: 50
    }
})