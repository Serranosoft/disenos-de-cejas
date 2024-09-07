import React, { useEffect, useState } from 'react';
import { View, Button, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImageSimulator from '../components/image-simulator';
import SimulatorHome from '../layout/simulator-home';

export default function SimulatorPlayground({ background }) {
    /** Conjunto de imagenes que se encuentra sobre el background */
    const [images, setImages] = useState([]);
    /** Imagen del conjunto seleccionada */
    const [imageSelected, setImageSelected] = useState(null);

    /** Encargado de añadir una nueva imagen en la colección */
    const addImage = () => {
        const newImage = {
            id: images.length,
            uri: 'https://debocado.net/wp-content/uploads/2023/06/receta-tortilla-patatas-airfryer.jpg',
        };
        setImages([...images, newImage]);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
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
                    <TouchableOpacity onPress={addImage} style={styles.button}>
                        <Text>Añadir imagen</Text>
                    </TouchableOpacity>
                    <View onTouchStart={() => setImageSelected(1000)} style={styles.overlay}></View>
                </View>
            </ImageBackground>
        </GestureHandlerRootView>
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

    button: {
        width: 125,
        height: 125,
        padding: 8,
        borderRadius: 100,
        backgroundColor: "#fff",
        zIndex: 11
    }
})