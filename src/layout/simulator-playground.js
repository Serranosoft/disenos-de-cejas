import React, { useEffect, useRef, useState } from 'react';
import { View, Button, TouchableOpacity, Text, StyleSheet, ImageBackground, ScrollView, Image, ToastAndroid } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImageSimulator from '../components/image-simulator';
import ViewShot from 'react-native-view-shot';
import HeaderSimulator from './header/header-simulator';
import { Stack } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';

const ALBUM_NAME = "Diseño de cejas";
const PERMISSION_DENIED = "No tengo permisos para acceder a la galería del dispositivo";
const SAVED_IMAGE = "Imagen guardada en tu galería en el albúm «Diseños de cejas»";

export default function SimulatorPlayground({ background }) {
    /** Conjunto de imagenes que se encuentra sobre el background */
    const [images, setImages] = useState([]);
    /** Imagen del conjunto seleccionada */
    const [imageSelected, setImageSelected] = useState(null);
    /** Referencia del contenedor al que se le va a realizar una captura */
    const shotRef = useRef();
    /** Imagen creada al realizar la captura */
    const [result, setResult] = useState(null);

    /** Cuando tenga mi resultado terminado, pido permiso y descargo si el estado del permiso es garantizado */
    useEffect(() => {
        if (result) requestPermissions();
    }, [result])

    /** Encargado de añadir una nueva imagen en la colección */
    function addImage() {
        const newImage = {
            id: images.length,
            uri: 'https://debocado.net/wp-content/uploads/2023/06/receta-tortilla-patatas-airfryer.jpg',
        };
        setImages([...images, newImage]);
    };

    /** Encargado de solicitar los permisos necesarios para almacenar el resultado en la galería del dispositivo */
    async function requestPermissions() {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync(false, ["photo"]);
            if (status === "granted") {
                downloadImage();
            } else {
                ToastAndroid.showWithGravityAndOffset(PERMISSION_DENIED, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            }
        } catch (error) {
            console.log(error);
            ToastAndroid.showWithGravityAndOffset(PERMISSION_DENIED, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    }

    /** Encargado de crear el asset y almacenarlo en un albúm en concreto de la galería del dispositivo */
    async function downloadImage() {
        try {

            const asset = await MediaLibrary.createAssetAsync(result.download);

            let album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
            if (!album) {
                album = await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset, false);
            } else {
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            }

            ToastAndroid.showWithGravityAndOffset(SAVED_IMAGE, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        } catch (error) {
            console.log(error);
            ToastAndroid.showWithGravityAndOffset(PERMISSION_DENIED, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    }

    function save() {
        setImageSelected(null);
        shotRef.current.capture().then(uri => {
            const index = uri.lastIndexOf("/") + 1;
            const name = uri.substring(index, uri.length);
            let result = {};
            result.download = uri;
            result.name = name;
            setResult(result);
        });
    }

    return (
        <>
            <Stack.Screen options={{ header: () => <HeaderSimulator {...{ save }} /> }} />

            <GestureHandlerRootView style={{ flex: 1 }}>
                <ViewShot ref={shotRef} options={{ fileName: "cejas", format: "jpg", quality: 1 }} style={{ flex: 1 }}>
                    <ImageBackground source={{ uri: background }} style={{ flex: 1 }} resizeMode="stretch">
                        <View style={{ flex: 1 }}>
                            {images.map((img) => (
                                <ImageSimulator
                                    key={img.id}
                                    id={img.id}
                                    uri={img.uri}
                                    imageSelected={imageSelected}
                                    onPress={() => setImageSelected(img.id)}
                                />
                            ))}
                            <View onTouchStart={() => setImageSelected(null)} style={styles.overlay}></View>
                        </View>
                    </ImageBackground>
                </ViewShot>
                <View style={styles.eyebrows}>
                    <ScrollView
                        style={styles.scroll}
                        horizontal={true}
                        contentContainerStyle={{ gap: 16 }}
                    >
                        <TouchableOpacity onPress={addImage}>
                            <Image
                                source={{ uri: "https://debocado.net/wp-content/uploads/2023/06/receta-tortilla-patatas-airfryer.jpg" }}
                                style={styles.option}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={addImage}>
                            <Image
                                source={{ uri: "https://debocado.net/wp-content/uploads/2023/06/receta-tortilla-patatas-airfryer.jpg" }}
                                style={styles.option}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={addImage}>
                            <Image
                                source={{ uri: "https://debocado.net/wp-content/uploads/2023/06/receta-tortilla-patatas-airfryer.jpg" }}
                                style={styles.option}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={addImage}>
                            <Image
                                source={{ uri: "https://debocado.net/wp-content/uploads/2023/06/receta-tortilla-patatas-airfryer.jpg" }}
                                style={styles.option}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={addImage}>
                            <Image
                                source={{ uri: "https://debocado.net/wp-content/uploads/2023/06/receta-tortilla-patatas-airfryer.jpg" }}
                                style={styles.option}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={addImage}>
                            <Image
                                source={{ uri: "https://debocado.net/wp-content/uploads/2023/06/receta-tortilla-patatas-airfryer.jpg" }}
                                style={styles.option}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={addImage}>
                            <Image
                                source={{ uri: "https://debocado.net/wp-content/uploads/2023/06/receta-tortilla-patatas-airfryer.jpg" }}
                                style={styles.option}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={addImage}>
                            <Image
                                source={{ uri: "https://debocado.net/wp-content/uploads/2023/06/receta-tortilla-patatas-airfryer.jpg" }}
                                style={styles.option}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={addImage}>
                            <Image
                                source={{ uri: "https://debocado.net/wp-content/uploads/2023/06/receta-tortilla-patatas-airfryer.jpg" }}
                                style={styles.option}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={addImage}>
                            <Image
                                source={{ uri: "https://debocado.net/wp-content/uploads/2023/06/receta-tortilla-patatas-airfryer.jpg" }}
                                style={styles.option}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={addImage}>
                            <Image
                                source={{ uri: "https://debocado.net/wp-content/uploads/2023/06/receta-tortilla-patatas-airfryer.jpg" }}
                                style={styles.option}
                            />
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </GestureHandlerRootView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    overlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0)",
        zIndex: 1
    },

    eyebrows: {
        position: "absolute",
        bottom: 16,
        left: 0,
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 8,
    },

    scroll: {
        flex: 1,
    },

    option: {
        width: 75,
        height: 75,
    },

    button: {
        width: 125,
        height: 125,
        padding: 8,
        backgroundColor: "#CEC2FF",
        borderWidth: 5,
        borderColor: "#B3B3F1",
        borderRadius: 100,
        zIndex: 11
    }
})