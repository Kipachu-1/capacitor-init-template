import {
  LocalNotifications,
  LocalNotificationSchema,
} from "@capacitor/local-notifications";
import { AppSettings } from "./settings";

export class Notification {
  static requestPermission = async () => {
    try {
      const permissionState = await LocalNotifications.requestPermissions();
      return permissionState.display === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  };

  static send = (options: LocalNotificationSchema) => {
    const notificationOptions: LocalNotificationSchema = {
      id: options.id || Math.floor(Math.random() * 100000),
      title: options.title,
      body: options.body,
      sound: options.sound ?? "beep.wav",
      attachments: options.attachments || [],
      actionTypeId: options.actionTypeId,
      extra: options.extra || {},
    };

    LocalNotifications.schedule({
      notifications: [notificationOptions],
    });
  };

  static hasPermission = async () => {
    try {
      const permissionState = await LocalNotifications.checkPermissions();
      return permissionState.display === "granted";
    } catch (error) {
      console.error("Error checking notification permission:", error);
      return false;
    }
  };

  /**
   * Check if notifications are enabled
   * @returns true if notifications are enabled and permission is granted
   */
  static isEnabled = async () => {
    const setting = await AppSettings.getSetting("notifications");
    const hasPermission = await this.hasPermission();
    return setting && hasPermission;
  };

  /**
   * Enable notifications
   * @returns true if notifications were enabled successfully
   */
  static enable = async () => {
    if (await this.hasPermission()) {
      await AppSettings.setSetting("notifications", true);
      return true;
    }
    const permission = await this.requestPermission();
    if (permission) {
      await AppSettings.setSetting("notifications", true);
      return true;
    }
    return false;
  };

  static disable = async () => {
    await AppSettings.setSetting("notifications", false);
  };
}
