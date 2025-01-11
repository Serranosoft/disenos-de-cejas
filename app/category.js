import { StyleSheet, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { createRef, useEffect, useState } from "react";
import Progress from "../src/components/progress";
import AdsHandler from "../src/components/AdsHandler";
import { fetchImages } from "../src/utils/data";
import Card from "../src/components/Card";
import { ui } from "../src/utils/styles";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { bannerId } from "../src/utils/constants";
import Header from "../src/layout/header/header";

export default function Category() {

    const params = useLocalSearchParams();
    const { name, stepsLength } = params;

    const [images, setImages] = useState([]);
    const [current, setCurrent] = useState(0);

    const [triggerAd, setTriggerAd] = useState(0);
    const adsHandlerRef = createRef();

    const [showOpenAd, setShowOpenAd] = useState(true);

    useEffect(() => {
        if (images.length < 1) {
            // Imagenes
            fetchImages(name, stepsLength).then((result) => setImages(result));
        }
    }, [])

    // Gestión de anuncios
    useEffect(() => {
        if (triggerAd === 2) {
            adsHandlerRef.current.showIntersitialAd();
            setTriggerAd(0)
        }
    }, [triggerAd])


    return (
        <View sharedTransitionTag="second" style={styles.container}>
            <Stack.Screen options={{ header: () => <Header /> }} />
            <AdsHandler ref={adsHandlerRef} showOpenAd={showOpenAd} setShowOpenAd={setShowOpenAd} />
            <View style={styles.wrapper}>
                <Text style={[ui.h2, {marginBottom: 8}]}>{name}</Text>
                <BannerAd unitId={bannerId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} requestOptions={{}} />
                <Card name={name} images={images} setTriggerAd={setTriggerAd} setCurrent={setCurrent} current={current} stepsLength={stepsLength} />
                <Progress current={(current+1)} qty={stepsLength} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "#fff",
        paddingTop: 16,
        justifyContent: "center",
    },

    wrapper: {
        flex: 0.97,
        justifyContent: "space-around",
        gap: 12,
    }
})