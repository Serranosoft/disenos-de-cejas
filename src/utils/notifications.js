import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { userPreferences } from "./userPreferences";

export async function scheduleWeeklyNotification() {
    try {

        const granted = await AsyncStorage.getItem(userPreferences.NOTIFICATION_PERMISSION);
        if (granted !== "true") {
            return;
        }
        // Obtener la lista de notificaciones programadas
        const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

        const exists = scheduledNotifications.some((notificacion) => {
            return notificacion.identifier === 'notificacion-semanal-miercoles';
        });

        // Si ya hay una notificación programada, no hagas nada
        if (exists) {
            console.log('Ya hay una notificación programada para la próxima semana.');
            return;
        }

        const notification = {
            identifier: "notificacion-semanal-miercoles",
            content: {
                title: "✨ Nuevo diseño de cejas para ti",
                body: "Descubre un estilo de cejas creado según tus rasgos. ¡Pruébalo ahora y redefine tu mirada!",
            },
            trigger: {
                type: "weekly",
                weekday: 4,
                hour: 12,
                minute: 0,
            },
        };

        // Programa la notificación
        await Notifications.scheduleNotificationAsync(notification);
    } catch (error) {
        console.error('Error al programar la notificación:', error);
    }
};