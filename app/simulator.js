import React, { useEffect, useState } from 'react';
import { View, Button, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImageSimulator from '../src/components/image-simulator';

export default function Simulator() {

    const [images, setImages] = useState([]);
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
        </GestureHandlerRootView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    overlay: {
        position: "absolute", 
        width: "100%", 
        height: "100%", 
        backgroundColor: "rgba(10,10,10,0.3)", 
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