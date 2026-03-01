import { StyleSheet, View, TouchableOpacity, Text, Dimensions, Image } from "react-native";
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Stack, useRouter } from "expo-router";
import { useState, useRef, useEffect, useContext } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useIsFocused } from '@react-navigation/native';
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { bannerId } from "../../src/utils/constants";
import { Context } from "../../src/utils/context";
import { LangContext } from "../../src/utils/langContext";

const { width, height } = Dimensions.get('window');

export default function Symmetry() {
    const router = useRouter();
    const [permission, requestPermission] = useCameraPermissions();
    const [showGrid, setShowGrid] = useState(true);
    const [isFrozen, setIsFrozen] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraKey, setCameraKey] = useState(Date.now());
    const cameraRef = useRef(null);
    const isFocused = useIsFocused();
    const { adsLoaded } = useContext(Context);
    const { language } = useContext(LangContext);
    const t = (key, params) => language.t(key, params);

    useEffect(() => {
        if (isFocused) {
            setCameraKey(Date.now());
            const timer = setTimeout(() => setCameraActive(true), 250);
            return () => clearTimeout(timer);
        } else {
            setCameraActive(false);
        }
    }, [isFocused]);

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>{t("symmetry_permission_message")}</Text>
                <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
                    <Text style={styles.permissionBtnText}>{t("symmetry_permission_button")}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const toggleFreeze = async () => {
        if (!cameraRef.current) return;

        try {
            if (isFrozen) {
                await cameraRef.current.resumePreview();
                setIsFrozen(false);
            } else {
                await cameraRef.current.pausePreview();
                setIsFrozen(true);
            }
        } catch (error) {
            console.log("Error toggling freeze state:", error);
        }
    };

    return (
        <>
            <View style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />

                {cameraActive && (
                    <CameraView
                        key={cameraKey}
                        ref={cameraRef}
                        style={StyleSheet.absoluteFillObject}
                        facing="front"
                    />
                )}

                {/* Top Toolbar */}
                <View style={styles.toolbar}>
                    <View style={{ width: 44, height: 44 }} />
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <TouchableOpacity style={[styles.iconBtn, !isFrozen && styles.iconBtnDisabled]} onPress={toggleFreeze}>
                            <MaterialIcons name="ac-unit" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.iconBtn, !showGrid && styles.iconBtnDisabled]} onPress={() => setShowGrid(!showGrid)}>
                            <MaterialIcons name={showGrid ? "grid-on" : "grid-off"} size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Symmetry Grid Overlay */}
                {showGrid && (
                    <View style={styles.gridOverlayContainer} pointerEvents="none">
                        <Image source={require("../../assets/malla.png")} style={{ width: "100%", height: "100%", opacity: 0.8 }} resizeMode="contain" />
                    </View>
                )}

                {/* Bottom Controls */}
                <View style={styles.bottomControls}>
                    <Text style={styles.helperText}>{t("symmetry_helper_text")}</Text>
                </View>
            </View>
            {adsLoaded && (
                <View style={styles.adContainer}>
                    <BannerAd unitId={bannerId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} requestOptions={{}} />
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FE',
        padding: 24,
    },
    permissionText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#111827',
    },
    permissionBtn: {
        backgroundColor: '#8B5CF6',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 16,
    },
    permissionBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    toolbar: {
        position: 'absolute',
        top: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBtnDisabled: {
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    title: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    gridOverlayContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomControls: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 32,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
    },
    helperText: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
    },
    adContainer: {
        alignItems: "center",
    },
});
