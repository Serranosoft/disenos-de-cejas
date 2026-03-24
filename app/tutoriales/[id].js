import { StyleSheet, Text, View, TouchableOpacity, Platform, Image } from "react-native";
import Constants from "expo-constants";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { useContext, useEffect, useState, useRef } from "react";
import Progress from "../../src/components/progress";
import { fetchImages } from "../../src/utils/data";
import Card from "../../src/components/Card";
import { ui } from "../../src/utils/styles";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { bannerId, bannerIdIos } from "../../src/utils/constants";
import { Context } from "../../src/utils/context";
import { CameraView, useCameraPermissions } from 'expo-camera';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LangContext } from "../../src/utils/langContext";

export default function TutorialDetail() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { name, stepsLength, fetch_name } = params;
    const { adsLoaded, setAdTrigger } = useContext(Context);
    const { language } = useContext(LangContext);
    const t = (key, params) => language.t(key, params);
    const isFocused = useIsFocused();

    const [images, setImages] = useState([]);
    const [current, setCurrent] = useState(0);
    const [splitMode, setSplitMode] = useState(false);
    const [layoutReady, setLayoutReady] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraKey, setCameraKey] = useState(Date.now());

    useEffect(() => {
        if (isFocused && layoutReady && splitMode) {
            setCameraKey(Date.now());
            const timer = setTimeout(() => setCameraActive(true), 250);
            return () => clearTimeout(timer);
        } else {
            setCameraActive(false);
        }
    }, [isFocused, layoutReady, splitMode]);

    // Tools states
    const [showGrid, setShowGrid] = useState(false);
    const [isFrozen, setIsFrozen] = useState(false);
    const cameraRef = useRef(null);

    // Permission hook
    const [permission, requestPermission] = useCameraPermissions();

    useEffect(() => {
        if (images.length < 1) {
            fetchImages(fetch_name, stepsLength).then((result) => setImages(result));
        }
    }, [])

    const toggleSplitMode = async () => {
        if (!permission?.granted) {
            const result = await requestPermission();
            if (result.granted) {
                setSplitMode(!splitMode);
                if (splitMode) {
                    setLayoutReady(false);
                    setIsFrozen(false);
                }
            }
        } else {
            setSplitMode(!splitMode);
            if (splitMode) {
                setLayoutReady(false);
                setIsFrozen(false);
            }
        }
    };

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
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerIconLeft}>
                    <MaterialIcons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerSub}>{t("tutorial_step_count", { current: current + 1, total: stepsLength })}</Text>
                    <Text style={styles.headerTitle} numberOfLines={1}>{name}</Text>
                </View>
                <TouchableOpacity onPress={toggleSplitMode} style={[styles.headerIconRight, splitMode && styles.mirrorBtnActive]}>
                    <MaterialIcons name="flip-camera-ios" size={24} color={splitMode ? "#fff" : "#8B5CF6"} />
                </TouchableOpacity>
            </View>

            <View style={styles.wrapper}>

                {/* Content Section (Top Half in Split Mode) */}
                <View style={[styles.contentArea, splitMode && styles.halfScreen]}>
                    <View style={styles.tutorialBadge}>
                        <Text style={styles.tutorialBadgeText}>{t("tutorial_expert_view")}</Text>
                    </View>
                    <Card name={name} images={images} setAdTrigger={setAdTrigger} setCurrent={setCurrent} current={current} stepsLength={stepsLength} />
                    <Progress current={(current + 1)} qty={stepsLength} />
                </View>

                {/* Mirror Section (Bottom Half in Split Mode) */}
                {splitMode && (
                    <View
                        style={[styles.mirrorArea, styles.halfScreen]}
                        onLayout={(e) => {
                            if (e.nativeEvent.layout.height > 0) {
                                setLayoutReady(true);
                            }
                        }}
                    >
                        {cameraActive && (
                            <CameraView
                                key={cameraKey}
                                ref={cameraRef}
                                style={StyleSheet.absoluteFillObject}
                                facing="front"
                            />
                        )}

                        {/* Symmetry Grid Overlay */}
                        {showGrid && (
                            <View style={styles.gridOverlayContainer} pointerEvents="none">
                                <Image source={require("../../assets/malla.png")} style={{ width: "100%", height: "100%", opacity: 0.8 }} resizeMode="contain" />
                            </View>
                        )}

                        {/* Overlay Controls */}
                        <View style={styles.mirrorOverlayTop}>
                            <View style={styles.activeStepPill}>
                                <View style={styles.dot} />
                                <Text style={styles.activeStepText}>{isFrozen ? t("tutorial_camera_frozen") : t("tutorial_follow_step")}</Text>
                            </View>
                        </View>

                        <View style={styles.mirrorControlsRight}>
                            <TouchableOpacity
                                style={[styles.mirrorControlBtn, isFrozen && styles.mirrorControlBtnActive]}
                                onPress={toggleFreeze}
                            >
                                <MaterialIcons name="ac-unit" size={24} color={isFrozen ? "#8B5CF6" : "#FFFFFF"} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.mirrorControlBtn, showGrid && styles.mirrorControlBtnActive]}
                                onPress={() => setShowGrid(!showGrid)}
                            >
                                <MaterialIcons name={showGrid ? "grid-off" : "grid-on"} size={24} color={showGrid ? "#8B5CF6" : "#FFFFFF"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <View style={styles.navigationBottom}>
                    <TouchableOpacity
                        style={styles.navBtn}
                        onPress={() => current > 0 && setCurrent(current - 1)}
                        disabled={current === 0}
                    >
                        <MaterialIcons name="chevron-left" size={24} color={current === 0 ? "#D1D5DB" : "#8B5CF6"} />
                        <Text style={[styles.navBtnText, current === 0 && { color: "#D1D5DB" }]}>{t("tutorial_prev")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.navBtn}
                        onPress={() => current < stepsLength - 1 && setCurrent(current + 1)}
                        disabled={current === stepsLength - 1}
                    >
                        <Text style={[styles.navBtnText, current === stepsLength - 1 && { color: "#D1D5DB" }]}>{t("tutorial_next")}</Text>
                        <MaterialIcons name="chevron-right" size={24} color={current === stepsLength - 1 ? "#D1D5DB" : "#8B5CF6"} />
                    </TouchableOpacity>
                </View>

                {/* Ads if not in split mode, to avoid clutter */}
                {!splitMode && adsLoaded && (
                    <View style={{ alignItems: 'center', marginVertical: 10 }}>
                        <BannerAd unitId={Platform.OS === "ios" ? bannerIdIos : bannerId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} requestOptions={{}} />
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "#FFFFFF",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    headerIconLeft: {
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    headerIconRight: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#F5F3FF",
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "center",
        marginLeft: 12,
    },
    headerSub: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#8B5CF6",
        letterSpacing: 1,
        marginBottom: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
    },
    mirrorBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F5F3FF",
        justifyContent: "center",
        alignItems: "center",
    },
    mirrorBtnActive: {
        backgroundColor: "#8B5CF6",
    },
    wrapper: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FFFFFF"
    },
    contentArea: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#FFFFFF", // Standard white background
        position: 'relative'
    },
    halfScreen: {
        flex: 0.5,
    },
    tutorialBadge: {
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        zIndex: 10
    },
    tutorialBadgeText: {
        color: "#FFF",
        fontSize: 10,
        fontWeight: "bold",
        letterSpacing: 0.5
    },
    mirrorArea: {
        backgroundColor: "#000",
        position: "relative",
        borderTopWidth: 2,
        borderColor: "#8B5CF6",
    },
    mirrorOverlayTop: {
        position: "absolute",
        top: 20,
        width: "100%",
        alignItems: "center"
    },
    activeStepPill: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.9)",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#8B5CF6"
    },
    activeStepText: {
        color: "#8B5CF6",
        fontWeight: "bold",
        fontSize: 12,
        letterSpacing: 0.5
    },
    mirrorControlsRight: {
        position: "absolute",
        right: 16,
        top: "30%",
        gap: 16,
    },
    mirrorControlBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)"
    },
    mirrorControlBtnActive: {
        backgroundColor: "rgba(255,255,255,0.9)",
        borderColor: "#8B5CF6",
    },
    gridOverlayContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navigationBottom: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderColor: "#E5E7EB"
    },
    navBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4
    },
    navBtnText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#6B7280"
    }
});
