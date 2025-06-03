import { Bell } from "lucide-react";
import { Switch } from "./ui/switch";
import { useCallback, useEffect, useState } from "react";
import { Notification } from "@/services/notification";
import { useTranslation } from "react-i18next";

interface NotificationSettingsProps {}

const NotificationSettings: React.FC<NotificationSettingsProps> = () => {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      const enabled = await Notification.isEnabled();
      setEnabled(enabled);
    })();
  }, []);

  const handleChange = useCallback(async (checked: boolean) => {
    if (checked) {
      const enabled = await Notification.enable();
      setEnabled(enabled);
    } else {
      await Notification.disable();
      setEnabled(false);
    }
  }, []);

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <Bell size={18} />
          <div>
            <h3 className="font-medium">{t("settings.notifications.title")}</h3>
            <p className="text-xs text-muted-foreground">
              {t("settings.notifications.description")}
            </p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={handleChange} />
      </div>
    </div>
  );
};

export default NotificationSettings;
