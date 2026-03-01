import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, Image, ToastAndroid, Platform, Alert, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImageSimulator from '../components/image-simulator';
import ViewShot from 'react-native-view-shot';
import { Stack, useRouter } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { bannerId } from '../utils/constants';
import { Context } from '../utils/context';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LangContext } from "../utils/langContext";

const ALBUM_NAME = "Diseño de cejas";
const PERMISSION_DENIED = "No tengo permisos para acceder a la galería del dispositivo";
const SAVED_IMAGE = "Imagen guardada en tu galería en el albúm «Diseños de cejas»";

/* Assuming 'eyebrows' imports remain the same */
const eyebrows = [
    require("../../assets/eyebrows/1.png"), require("../../assets/eyebrows/2.png"),
    require("../../assets/eyebrows/3.png"), require("../../assets/eyebrows/4.png"),
    require("../../assets/eyebrows/5.png"), require("../../assets/eyebrows/6.png"),
    require("../../assets/eyebrows/7.png"), require("../../assets/eyebrows/8.png"),
    require("../../assets/eyebrows/9.png"), require("../../assets/eyebrows/10.png"),
    require("../../assets/eyebrows/11.png"), require("../../assets/eyebrows/12.png"),
    require("../../assets/eyebrows/13.png"), require("../../assets/eyebrows/14.png"),
    require("../../assets/eyebrows/15.png"), require("../../assets/eyebrows/16.png"),
    require("../../assets/eyebrows/17.png"), require("../../assets/eyebrows/18.png"),
    require("../../assets/eyebrows/19.png"), require("../../assets/eyebrows/20.png"),
    require("../../assets/eyebrows/21.png"), require("../../assets/eyebrows/22.png"),
    require("../../assets/eyebrows/23.png"), require("../../assets/eyebrows/24.png"),
    require("../../assets/eyebrows/25.png"), require("../../assets/eyebrows/26.png"),
];

export default function SimulatorPlayground({ background, setBackground }) {
    const { adsLoaded } = useContext(Context);
    const { language } = useContext(LangContext);
    const t = (key, params) => language.t(key, params);
    const router = useRouter();

    const PERMISSION_DENIED = t("simulator_permission_denied");
    const SAVED_IMAGE = t("simulator_saved_image");

    const [images, setImages] = useState([]);
    const [imageSelected, setImageSelected] = useState(null);
    const shotRef = useRef();
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (result) requestPermissions();
    }, [result]);

    function addImage(uri) {
        const uniqueId = Date.now() + Math.random().toString(36).substring(2, 9);
        const newImage = { id: uniqueId, uri: uri };
        setImages([...images, newImage]);
        setImageSelected(newImage.id);
    }

    function removeImage() {
        let imagesAux = [...images];
        const removed = imagesAux.filter(image => image.id !== imageSelected);
        setImages(removed);
    }

    async function requestPermissions() {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync(false, ["photo"]);
            if (status === "granted") {
                downloadImage();
            } else {
                showToast(PERMISSION_DENIED);
            }
        } catch (error) {
            showToast(PERMISSION_DENIED);
        }
    }

    async function downloadImage() {
        try {
            const asset = await MediaLibrary.createAssetAsync(result.download);
            let album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
            if (!album) {
                album = await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset, false);
            } else {
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            }
            showToast(SAVED_IMAGE);
        } catch (error) {
            showToast(PERMISSION_DENIED);
        }
    }

    function showToast(msg) {
        Platform.OS === "android"
            ? ToastAndroid.showWithGravityAndOffset(msg, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50)
            : Alert.alert(msg);
    }

    function save() {
        setImageSelected(null);
        setTimeout(() => { // Gives time to remove the overlay wrapper of selected item
            shotRef.current.capture().then(uri => {
                const index = uri.lastIndexOf("/") + 1;
                const name = uri.substring(index, uri.length);
                let resultObj = { download: uri, name };
                setResult(resultObj);
            });
        }, 150);
    }

    // Reset playground
    function handleBack() {
        setBackground(null);
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={handleBack}
                    style={styles.iconBtn}
                    accessibilityRole="button"
                    accessibilityLabel={t("simulator_accessibility_back")}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={save}
                    style={styles.saveBtn}
                    accessibilityRole="button"
                    accessibilityLabel={t("simulator_accessibility_save")}
                >
                    <MaterialIcons name="file-download" size={20} color="#FFFFFF" />
                    <Text style={styles.saveBtnText}>{t("simulator_save_button")}</Text>
                </TouchableOpacity>
            </View>
            {adsLoaded && (
                <View style={styles.adWrap}>
                    <BannerAd unitId={bannerId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} requestOptions={{}} />
                </View>
            )}
            <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <ViewShot ref={shotRef} options={{ fileName: "cejas", format: "jpg", quality: 1 }} style={{ flex: 1 }}>
                    <ImageBackground source={{ uri: background }} style={{ flex: 1 }} resizeMode="contain">
                        <View style={{ flex: 1 }}>
                            {images.map((img) => (
                                <ImageSimulator
                                    key={img.id}
                                    id={img.id}
                                    uri={img.uri}
                                    imageSelected={imageSelected}
                                    removeImage={removeImage}
                                    onPress={() => setImageSelected(img.id)}
                                />
                            ))}
                            <View onTouchStart={() => setImageSelected(null)} style={styles.overlay}></View>
                        </View>
                    </ImageBackground>
                </ViewShot>

                {/* Eyebrows Selection Tool */}
                <View style={styles.bottomBarWrap}>


                    <View style={styles.eyebrowsContainer}>
                        <Text style={styles.eyebrowsTitle}>{t("simulator_gallery_title")}</Text>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            {eyebrows.map((eyebrow, index) => (
                                <TouchableOpacity key={index} onPress={() => addImage(eyebrow)} style={styles.option}>
                                    <View style={styles.optionInner}>
                                        <Image
                                            source={eyebrow}
                                            style={styles.imageThumb}
                                            resizeMode="contain"
                                        />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </GestureHandlerRootView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 12,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    iconBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    saveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8B5CF6',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    saveBtnText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0)",
        zIndex: 1
    },
    bottomBarWrap: {
        position: "absolute",
        bottom: 0,
        width: "100%",
    },
    adWrap: {
        alignItems: "center",
        paddingBottom: 4
    },
    eyebrowsContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 16,
        paddingBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    eyebrowsTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#111827",
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    option: {
        width: 80,
        height: 80,
        borderRadius: 16,
        backgroundColor: "#F8F9FE",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        justifyContent: "center",
        alignItems: "center",
    },
    optionInner: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    imageThumb: {
        width: "100%",
        height: "100%",
    }
});