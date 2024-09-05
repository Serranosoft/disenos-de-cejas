import React, { useEffect, useState } from 'react';
import { View, Button, TouchableOpacity, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImageSimulator from '../src/components/image-simulator';

export default function Simulator2() {
    const [images, setImages] = useState([]);

    // Función para añadir una nueva imagen al array
    const addImage = () => {
        const newImage = {
            id: images.length, // Id única para cada imagen
            uri: 'https://debocado.net/wp-content/uploads/2023/06/receta-tortilla-patatas-airfryer.jpg', // Reemplaza con la URL de la imagen
        };
        setImages([...images, newImage]);
    };

    // Función para actualizar la posición de la imagen en el array
    const updateImagePosition = (id, x, y) => {
        setImages(prevImages =>
            prevImages.map(img =>
                img.id === id ? { ...img, x, y } : img
            )
        );
    };

    const [imageSelected, setImageSelected] = useState(null);
    useEffect(() => {
        console.log(imageSelected);
    }, [imageSelected])

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                {images.map((img) => (
                    <ImageSimulator
                        key={img.id}
                        id={img.id}
                        uri={img.uri}
                        imageSelected={imageSelected}
                        updateImagePosition={updateImagePosition}
                        onPress={() => setImageSelected(img.id)}
                    />
                ))}
                <TouchableOpacity
                    onPress={addImage}
                    style={{ 
                        width: 125, 
                        height: 125, 
                        borderRadius: 100, 
                        padding: 8, 
                        backgroundColor: "#fff", 
                        zIndex: 11
                    }}>
                    <Text>Añadir imagen</Text>
                </TouchableOpacity>
                <View onTouchStart={() => setImageSelected(1000)} style={{ width: "100%", position: "absolute", height: "100%", backgroundColor: "rgba(10,10,10,0.3)", zIndex: 1 }}></View>
            </View>
        </GestureHandlerRootView>
    );

}