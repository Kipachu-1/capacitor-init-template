import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import config from "@/config";
import { useTranslation } from "react-i18next";

type TPrivacyPolicyProps = {};

const URL = `${config.apiUrl}/legal/privacy.html`;

const PrivacyPolicy: React.FC<TPrivacyPolicyProps> = () => {
  const { t } = useTranslation();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <a href="#" className="underline mb-2 mr-2">
          {t("paywall.privacyPolicy")}
        </a>
      </DrawerTrigger>
      <DrawerContent className="h-full">
        <iframe
          className="w-full h-full"
          src={URL}
          sandbox=""
          referrerPolicy="no-referrer"
        ></iframe>
      </DrawerContent>
    </Drawer>
  );
};

export default PrivacyPolicy;
