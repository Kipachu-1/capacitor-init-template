import { AppSettings } from "@/services/settings";
import { darkModeAtom } from "@/state/atoms";
import { StatusBar, Style } from "@capacitor/status-bar";
import { useAtom } from "jotai";
import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);

  const switchTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    AppSettings.setSetting("theme", newMode ? "dark" : "light");
    StatusBar.setStyle({
      style: newMode ? Style.Dark : Style.Light,
    });
    document.body.classList.toggle("dark");
  };

  useEffect(() => {
    AppSettings.getSetting("theme").then((theme) =>
      setDarkMode(theme === "dark")
    );
  }, []);

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          {darkMode ? <Moon size={18} /> : <Sun size={18} />}
          <div>
            <h3 className="font-medium">{t("settings.theme.title")}</h3>
            <p className="text-xs text-muted-foreground">
              {t("settings.theme.description")}
            </p>
          </div>
        </div>
        <button className="p-2 rounded-md border" onClick={switchTheme}>
          {darkMode ? t("settings.theme.light") : t("settings.theme.dark")}
        </button>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
