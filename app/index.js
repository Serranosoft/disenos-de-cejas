import Video from 'react-native-video';
import { Link, Stack } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ui } from '../src/utils/styles';

export default function App() {

    return (
        <View style={styles.container} sharedTransitionTag="first">
            <Stack.Screen options={{ headerShown: false }} />
            <Video resizeMode='cover' repeat source={{ uri: "https://mollydigital.manu-scholz.com/wp-content/uploads/2023/10/como-hacer-mis-cejas-background.mp4" }} style={styles.lottie} />


            <View style={styles.shadow}>
                <View style={styles.wrapper}>
                    <Text style={[ui.h1, { color: "white" }]}>
                        Estiliza hoy mismo tu cejas
                    </Text>


                    <Link href="/list" style={ui.button} asChild>
                        <Pressable>
                            <Text style={[ui.h3, { fontFamily: "Changa", color: "white" }]}>Ver como hacerlo</Text>
                        </Pressable>
                    </Link>

                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-end",
        alignItems: "center",
        flex: 1,
    },

    shadow: {
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.55)",
        paddingVertical: 28,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },

    wrapper: {
        width: "90%",
        alignItems: "flex-start",
        alignSelf: "center",
        gap: 40,
    },

    lottie: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
    }
});