import { useContext, useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LangContext } from '../utils/langContext';

const VERSION_MODAL = 'v2';

export default function UpdatesModal() {
    const [visible, setVisible] = useState(false);
    const { language } = useContext(LangContext);

    useEffect(() => {
        const checkIfSeen = async () => {
            const visto = await AsyncStorage.getItem('modalUpdatesVersion');
            if (visto !== VERSION_MODAL) {
                setVisible(true);
            }
        };
        checkIfSeen();
    }, []);

    const closeModal = async () => {
        setVisible(false);
        await AsyncStorage.setItem('modalUpdatesVersion', VERSION_MODAL);
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={closeModal} statusBarTranslucent={true}>
            <View style={styles.overlay}>
                <Pressable style={styles.outside} onPress={closeModal} />
                <View style={styles.modal}>
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={closeModal}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>

                    <Text style={styles.title}>{language.t("_updateTitle")}</Text>

                    <View style={styles.listContainer}>
                        <Text style={styles.listItem}>{language.t("_updateList1")}</Text>
                        <Text style={styles.listItem}>{language.t("_updateList2")}</Text>
                        <Text style={styles.listItem}>{language.t("_updateList3")}</Text>
                        <Text style={styles.listItem}>{language.t("_updateList4")}</Text>
                        <Text style={styles.listItem}>{language.t("_updateList5")}</Text>
                        <Text style={styles.listItem}>{language.t("_updateList6")}</Text>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={closeModal} activeOpacity={0.8}>
                        <Text style={styles.buttonText}>{language.t("_updateButton")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    outside: {
        ...StyleSheet.absoluteFillObject,
    },
    modal: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 32,
        paddingTop: 48,
        width: "100%",
        maxWidth: 400,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        position: "relative"
    },
    closeBtn: {
        position: "absolute",
        top: 16,
        right: 16,
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
        borderRadius: 16
    },
    closeText: {
        color: "#6B7280",
        fontSize: 18,
        fontWeight: "bold",
    },
    title: {
        fontSize: 26,
        fontWeight: "900",
        color: "#8B5CF6", // Primary Purple
        letterSpacing: 0.5,
        textAlign: 'center',
        marginBottom: 8
    },
    listContainer: {
        gap: 16,
        marginVertical: 24,
        width: '100%'
    },
    listItem: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 22,
        fontWeight: '500'
    },
    button: {
        backgroundColor: "#8B5CF6", // Primary Purple
        width: "100%",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 0.5
    }
});
