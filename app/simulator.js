import { useState } from "react";
import SimulatorPlayground from "../src/layout/simulator-playground";
import SimulatorHome from "../src/layout/simulator-home";
import { View } from "react-native";

export default function Simulator() {
    /** Foto elegida por el usuario para manipular */
    const [background, setBackground] = useState(null);
    
    return (
        <View style={{ flex: 1 }}>
            {
                background ?
                    <SimulatorPlayground {...{ background }} />
                    :
                    <SimulatorHome {...{ setBackground }} />
            }
        </View>

    );

}