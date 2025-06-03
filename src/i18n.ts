import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { AppSettings } from "./services/settings";
import { Device } from "@capacitor/device";

// Define supported languages explicitly
const supportedLanguages = ["en", "ru", "es", "fr", "de", "ja", "zh"];
const defaultLang = "en";

// Adapter function for resourcesToBackend to dynamically import JSON files
const loadResources = (language: string, namespace: string) => {
  // Assuming 'translation' is the only namespace
  if (namespace === "translation") {
    return import(`../locales/${language}.json`);
  }
  // Handle other namespaces if needed, or return a rejected promise
  return Promise.reject(`Namespace "${namespace}" not handled`);
};

i18n
  // Use the backend adapter for dynamic loading
  .use(resourcesToBackend(loadResources))
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // lng: defaultLang, // Let the detection logic handle the initial language
    fallbackLng: defaultLang, // Use 'en' if detected language is not available
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    // Default namespace
    ns: ["translation"],
    defaultNS: "translation",
    // Resources are loaded dynamically by the backend adapter
    debug: import.meta.env.DEV, // Enable debug logs in development
  });

// Function to determine and set the initial language
const initializeLanguage = async () => {
  let initialLang = defaultLang;
  try {
    const savedLang = await AppSettings.getSetting("language");
    if (savedLang && supportedLanguages.includes(savedLang)) {
      initialLang = savedLang;
    } else {
      const deviceLangInfo = await Device.getLanguageCode();
      // Use language code part (e.g., "en" from "en-US")
      const deviceLang = deviceLangInfo?.value?.split("-")[0];
      if (deviceLang && supportedLanguages.includes(deviceLang)) {
        initialLang = deviceLang;
      }
    }
  } catch (error) {
    console.error("Error determining initial language, using default:", error);
    // Stick with default 'en'
  }

  // Change the language. i18next will automatically load the resources
  // using the backend adapter if they are not already loaded.
  if (i18n.language !== initialLang) {
    try {
      await i18n.changeLanguage(initialLang);
      console.log(`Initial language set to ${initialLang}`);
    } catch (error) {
      console.error(`Failed to set initial language to ${initialLang}:`, error);
      // Attempt to set default language as a fallback on error
      if (initialLang !== defaultLang) {
        console.warn(`Falling back to '${defaultLang}' due to error.`);
        await i18n
          .changeLanguage(defaultLang)
          .catch((err) =>
            console.error(
              `Failed to set fallback language ${defaultLang}:`,
              err
            )
          );
      }
    }
  } else {
    // Ensure resources for the current language are loaded if needed (e.g., on first load)
    await i18n.loadLanguages(initialLang);
    console.log(
      `Initial language ${initialLang} already set, ensured resources are loaded.`
    );
  }
};

// Initialize the language when the module loads
// We need to wait for init to complete before changing language
i18n.init().then(() => {
  initializeLanguage();
});

export default i18n;
