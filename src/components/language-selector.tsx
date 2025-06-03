import { useState } from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "@/constants";
import { AppSettings } from "@/services/settings";

export default function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || "en");

  const handleLanguageChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    await AppSettings.setSetting("language", newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex gap-3 items-start mb-4">
        <Globe size={18} />
        <div>
          <h3 className="font-medium">{t("settings.language.title")}</h3>
          <p className="text-xs text-muted-foreground">
            {t("settings.language.description")}
          </p>
        </div>
      </div>

      <div className="pl-7">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-primary focus:outline-none"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {t(`settings.language.options.${lang.code}`)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
