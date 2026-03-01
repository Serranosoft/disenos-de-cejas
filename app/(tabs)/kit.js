import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Linking, KeyboardAvoidingView, Platform } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { bannerId } from "../../src/utils/constants";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { Context } from "../../src/utils/context";
import { LangContext } from "../../src/utils/langContext";

const GET_DEFAULT_ITEMS = (t) => [
    { id: "1", name: t("kit_item_1_name"), model: "ICONSIGN", price: "22.99€", link: "https://amzn.to/4r8054r" },
    { id: "2", name: t("kit_item_2_name"), model: "Maybelline New York", price: "10.99€", link: "https://amzn.to/3OJ5lhd" },
    { id: "3", name: t("kit_item_3_name"), model: "Maybelline New York", price: "14.19€", link: "https://amzn.to/3OJ7QAb" },
    { id: "4", name: t("kit_item_4_name"), model: "Catrice", price: "2.99€", link: "https://amzn.to/3MXnZ4j" },
    { id: "5", name: t("kit_item_5_name"), model: "L'Oréal Paris", price: "12.99€", link: "https://amzn.to/4r32VHA" },
    { id: "6", name: t("kit_item_6_name"), model: "NYX", price: "16.54€", link: "https://amzn.to/4l32qMj" },
];

export default function Kit() {
    const router = useRouter();
    const { adsLoaded } = useContext(Context);
    const { language } = useContext(LangContext);
    const t = (key, params) => language.t(key, params);

    const DEFAULT_ITEMS = GET_DEFAULT_ITEMS(t);
    const [items, setItems] = useState(DEFAULT_ITEMS);
    const [checkedItems, setCheckedItems] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Form states
    const [formName, setFormName] = useState("");
    const [formModel, setFormModel] = useState("");
    const [formPrice, setFormPrice] = useState("");
    const [formLink, setFormLink] = useState("");

    // Load state on mount
    useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        try {
            const savedChecked = await AsyncStorage.getItem('@kit_progress');
            if (savedChecked !== null) {
                try {
                    const parsed = JSON.parse(savedChecked);
                    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                        setCheckedItems(parsed);
                    } else {
                        setCheckedItems({});
                    }
                } catch (e) {
                    setCheckedItems({});
                }
            }

            const savedCustomItems = await AsyncStorage.getItem('@kit_custom_items');
            if (savedCustomItems !== null) {
                try {
                    const parsedCustom = JSON.parse(savedCustomItems);
                    if (Array.isArray(parsedCustom)) {
                        setItems([...DEFAULT_ITEMS, ...parsedCustom]);
                    }
                } catch (e) {
                    console.log("Error parsing custom items", e);
                }
            }
        } catch (e) {
            console.log("Error loading progress", e);
        }
    };

    const toggleItem = async (id) => {
        const newChecked = { ...checkedItems, [id]: !checkedItems[id] };
        setCheckedItems(newChecked);
        try {
            await AsyncStorage.setItem('@kit_progress', JSON.stringify(newChecked));
        } catch (e) {
            console.log(e);
        }
    };

    const saveCustomItems = async (newItems) => {
        const customItems = newItems.filter(item => !DEFAULT_ITEMS.some(def => def.id === item.id));
        try {
            await AsyncStorage.setItem('@kit_custom_items', JSON.stringify(customItems));
        } catch (e) {
            console.log("Error saving custom items", e);
        }
    };

    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormName(item.name);
            setFormModel(item.model || "");
            setFormPrice(item.price);
            setFormLink(item.link || "");
        } else {
            setEditingItem(null);
            setFormName("");
            setFormModel("");
            setFormPrice("");
            setFormLink("");
        }
        setModalVisible(true);
    };

    const saveItem = () => {
        if (!formName.trim()) {
            Alert.alert(t("kit_alert_required_fields"), t("kit_alert_product_name_required"));
            return;
        }

        let finalPrice = "-,--€";

        if (formPrice.trim()) {
            // Remove any existing € symbol that the user might have accidentally typed
            const cleanPrice = formPrice.trim().replace(/€/g, '').trim();
            finalPrice = `${cleanPrice}€`;
        }

        let newItems;
        if (editingItem) {
            // Update existing
            newItems = items.map(item =>
                item.id === editingItem.id
                    ? { ...item, name: formName, model: formModel, price: finalPrice, link: formLink }
                    : item
            );
        } else {
            // Add new
            const newItem = {
                id: Date.now().toString(),
                name: formName,
                model: formModel,
                price: finalPrice,
                link: formLink
            };
            newItems = [...items, newItem];
        }

        setItems(newItems);
        saveCustomItems(newItems);
        setModalVisible(false);
    };

    const confirmDelete = (id) => {
        setItemToDelete(id);
        setDeleteModalVisible(true);
    };

    const handleDeleteConfirm = () => {
        if (!itemToDelete) return;
        const newItems = items.filter(item => item.id !== itemToDelete);
        setItems(newItems);
        saveCustomItems(newItems);

        // Also cleanup checked state
        if (checkedItems[itemToDelete]) {
            const newCheckedItems = { ...checkedItems };
            delete newCheckedItems[itemToDelete];
            setCheckedItems(newCheckedItems);
            AsyncStorage.setItem('@kit_progress', JSON.stringify(newCheckedItems));
        }

        setDeleteModalVisible(false);
        setItemToDelete(null);
    };

    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    const totalCount = items.length;
    const progressWidth = totalCount === 0 ? 0 : (checkedCount / totalCount) * 100;

    return (
        <View style={styles.mainScroll}>
            <View style={styles.header}>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>{t("kit_header_title")}</Text>
                </View>
                <View style={styles.headerIconRight} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Progress Card */}
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressTitle}>{t("kit_progress_title")}</Text>
                        <View style={styles.progressBadge}>
                            <Text style={styles.progressBadgeText}>{checkedCount} / {totalCount}</Text>
                        </View>
                    </View>

                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${progressWidth}%` }]} />
                    </View>

                    <View style={styles.progressFooter}>
                        <MaterialIcons name="auto-awesome" size={14} color="#8B5CF6" />
                        <Text style={styles.progressFooterText}>
                            {checkedCount === totalCount ? t("kit_progress_completed") : t("kit_progress_almost_done")}
                        </Text>
                    </View>
                </View>
                {adsLoaded && (
                    <View style={styles.adContainer}>
                        <BannerAd unitId={bannerId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} requestOptions={{}} />
                    </View>
                )}

                {/* Checklist */}
                <View style={styles.checklist}>
                    {items.map((item) => {
                        // Dynamically translate default items by checking ID
                        const defaultItemRef = DEFAULT_ITEMS.find(d => d.id === item.id);
                        const displayName = defaultItemRef ? defaultItemRef.name : item.name;

                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.checkItem}
                                onPress={() => toggleItem(item.id)}
                                onLongPress={() => openModal(item)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.checkbox, checkedItems[item.id] && styles.checkboxActive]}>
                                    {checkedItems[item.id] && <MaterialIcons name="check" size={16} color="#FFFFFF" />}
                                </View>

                                <View style={styles.checkInfo}>
                                    <Text style={styles.checkTitle}>{displayName}</Text>
                                    {item.model ? (
                                        <Text style={styles.checkSubtitle}>{item.model}</Text>
                                    ) : null}

                                    {item.link ? (
                                        <TouchableOpacity
                                            style={{ flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' }}
                                            onPress={() => Linking.openURL(item.link)}
                                        >
                                            <Text style={styles.checkLink}>{t("kit_buy_on_amazon")}</Text>
                                            <MaterialIcons name="open-in-new" size={12} color="#8B5CF6" />
                                        </TouchableOpacity>
                                    ) : null}
                                </View>

                                <View style={styles.priceContainer}>
                                    <View style={styles.priceBadge}>
                                        <Text style={styles.priceText}>{item.price}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item.id)}>
                                        <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Add Custom Item */}
                <TouchableOpacity style={styles.addCustomCard} onPress={() => openModal()}>
                    <Text style={styles.addCustomTitle}>{t("kit_missing_something")}</Text>
                    <View style={styles.addCustomBtn}>
                        <MaterialIcons name="add" size={16} color="#8B5CF6" />
                        <Text style={styles.addCustomBtnText}>{t("kit_add_custom_item")}</Text>
                    </View>
                </TouchableOpacity>

            </ScrollView>

            {/* Edit / Add Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{editingItem ? t("kit_modal_edit_title") : t("kit_modal_add_title")}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialIcons name="close" size={24} color="#111827" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputLabel}>{t("kit_input_title_label")}</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder={t("kit_input_title_placeholder")}
                            placeholderTextColor="#9CA3AF"
                            value={formName}
                            onChangeText={setFormName}
                        />

                        <Text style={styles.inputLabel}>{t("kit_input_model_label")}</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder={t("kit_input_model_placeholder")}
                            placeholderTextColor="#9CA3AF"
                            value={formModel}
                            onChangeText={setFormModel}
                        />

                        <Text style={styles.inputLabel}>{t("kit_input_price_label")}</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder={t("kit_input_price_placeholder")}
                            placeholderTextColor="#9CA3AF"
                            value={formPrice}
                            onChangeText={setFormPrice}
                            keyboardType="numeric"
                        />

                        <Text style={styles.inputLabel}>{t("kit_input_link_label")}</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder={t("kit_input_link_placeholder")}
                            placeholderTextColor="#9CA3AF"
                            value={formLink}
                            onChangeText={setFormLink}
                        />

                        <TouchableOpacity style={styles.saveBtn} onPress={saveItem}>
                            <Text style={styles.saveBtnText}>{t("kit_modal_save_btn")}</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => setDeleteModalVisible(false)}
            >
                <View style={styles.deleteModalOverlay}>
                    <View style={styles.deleteModalContent}>
                        <View style={styles.deleteIconWrap}>
                            <MaterialIcons name="delete-outline" size={32} color="#EF4444" />
                        </View>
                        <Text style={styles.deleteModalTitle}>{t("kit_delete_modal_title")}</Text>
                        <Text style={styles.deleteModalText}>{t("kit_delete_modal_message")}</Text>

                        <View style={styles.deleteModalActions}>
                            <TouchableOpacity style={styles.cancelDeleteBtn} onPress={() => setDeleteModalVisible(false)}>
                                <Text style={styles.cancelDeleteBtnText}>{t("kit_cancel")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmDeleteBtn} onPress={handleDeleteConfirm}>
                                <Text style={styles.confirmDeleteBtnText}>{t("kit_delete")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    mainScroll: {
        flex: 1,
        backgroundColor: "#F8F9FE",
    },
    scrollContent: {
        paddingTop: 16,
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 12,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    headerTitleContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
    },
    headerIconRight: {
        width: 44,
        height: 44,
    },
    progressCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    progressTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
    },
    progressBadge: {
        backgroundColor: "#F5F3FF",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    progressBadgeText: {
        color: "#8B5CF6",
        fontWeight: "bold",
        fontSize: 12,
    },
    progressBarBg: {
        height: 10,
        backgroundColor: "#E5E7EB",
        borderRadius: 5,
        marginBottom: 12,
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: "#8B5CF6",
        borderRadius: 5,
    },
    progressFooter: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    progressFooterText: {
        fontSize: 12,
        color: "#8B5CF6",
    },
    checklist: {
        marginBottom: 24,
    },
    checkItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#E5E7EB",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    checkboxActive: {
        backgroundColor: "#8B5CF6",
        borderColor: "#8B5CF6",
    },
    checkInfo: {
        flex: 1,
    },
    checkTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 4,
    },
    checkLink: {
        fontSize: 12,
        color: "#8B5CF6",
    },
    priceBadge: {
        backgroundColor: "#F3F4F6",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    priceText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#4B5563",
    },
    addCustomCard: {
        backgroundColor: "#F5F3FF",
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: "#D8B4FE",
        borderStyle: "dashed",
        alignItems: "center",
    },
    addCustomTitle: {
        fontSize: 14,
        color: "#4B5563",
        marginBottom: 8,
    },
    addCustomBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    addCustomBtnText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#8B5CF6",
    },
    checkSubtitle: {
        fontSize: 12,
        color: "#6B7280", // Gray
        marginBottom: 8,
    },
    priceContainer: {
        alignItems: "flex-end",
        gap: 8,
    },
    deleteBtn: {
        padding: 4,
        marginRight: -4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 24, // Reduced from 40 to bring it closer to the bottom
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#4B5563",
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: "#111827",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    saveBtn: {
        backgroundColor: "#8B5CF6",
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: "center",
        marginTop: 8,
    },
    saveBtnText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    deleteModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    deleteModalContent: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 32,
        width: "100%",
        maxWidth: 400,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    deleteIconWrap: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    deleteModalTitle: {
        fontSize: 22,
        fontWeight: "900",
        color: "#111827",
        marginBottom: 8,
        textAlign: 'center',
    },
    deleteModalText: {
        fontSize: 15,
        color: '#4B5563',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
        fontWeight: '500'
    },
    deleteModalActions: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    cancelDeleteBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    cancelDeleteBtnText: {
        color: '#4B5563',
        fontWeight: 'bold',
        fontSize: 15,
    },
    confirmDeleteBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 16,
        backgroundColor: '#EF4444',
        alignItems: 'center',
    },
    confirmDeleteBtnText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 15,
    },
    adContainer: {
        alignItems: "center",
        marginBottom: 20
    },
});
