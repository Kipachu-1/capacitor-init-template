import { Preferences } from "@capacitor/preferences";

type TAppSettings = {
  notifications: boolean;
  language: string | null; // null for system default
  autoplay: boolean;
  defaultVolume: number;
  theme: string;
  onboardingCompleted: boolean;
};

type TAppSettingsKeys = keyof TAppSettings;

const DEFAULT_SETTINGS: TAppSettings = {
  notifications: false,
  language: null,
  autoplay: false,
  defaultVolume: 50,
  theme: "light",
  onboardingCompleted: false,
};

export class AppSettings {
  private static instance: AppSettings;

  private constructor() {}

  public static getInstance(): AppSettings {
    if (!AppSettings.instance) {
      AppSettings.instance = new AppSettings();
    }
    return AppSettings.instance;
  }

  private static async execute<T>(operation: () => Promise<T>): Promise<T> {
    return operation();
  }

  public static async getSettings(): Promise<TAppSettings> {
    return this.execute(async () => {
      const settings: Partial<TAppSettings> = {};

      await Promise.all(
        Object.keys(DEFAULT_SETTINGS).map(async (key) => {
          const { value } = await Preferences.get({ key });
          try {
            if (value !== null) {
              settings[key as TAppSettingsKeys] = JSON.parse(value);
            }
          } catch {
            // JSON parsing failed, let the final merge handle the default value
          }
        })
      );

      return {
        ...DEFAULT_SETTINGS,
        ...settings,
      };
    });
  }

  public static async getSetting<K extends TAppSettingsKeys>(
    key: K
  ): Promise<TAppSettings[K]> {
    return this.execute(async () => {
      const { value } = await Preferences.get({ key });

      if (value !== null) {
        try {
          return JSON.parse(value) as TAppSettings[K];
        } catch {
          return DEFAULT_SETTINGS[key];
        }
      }

      return DEFAULT_SETTINGS[key];
    });
  }

  public static async setSetting<K extends TAppSettingsKeys>(
    key: K,
    value: TAppSettings[K]
  ): Promise<void> {
    return this.execute(async () => {
      await Preferences.set({
        key,
        value: JSON.stringify(value),
      });
    });
  }

  public static async resetSettings(): Promise<void> {
    return this.execute(async () => {
      await Preferences.clear();

      await Promise.all(
        Object.entries(DEFAULT_SETTINGS).map(([key, value]) =>
          Preferences.set({ key, value: JSON.stringify(value) })
        )
      );
    });
  }
}
