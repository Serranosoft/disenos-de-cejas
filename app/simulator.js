import { useState } from "react";
import SimulatorPlayground from "../src/layout/simulator-playground";
import SimulatorHome from "../src/layout/simulator-home";
import { Stack } from "expo-router";
import { View } from "react-native";
import Header from "../src/layout/header/header";

export default function Simulator() {

    /** Foto elegida por el usuario para manipular */
    const [background, setBackground] = useState(null);

    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen options={{ header: () => <Header /> }} />
            {
                background ?
                    <SimulatorPlayground {...{ background }} />
                    :
                    <SimulatorHome {...{ setBackground }} />
            }
        </View>

    );

}