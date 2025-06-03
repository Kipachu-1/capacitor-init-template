import { useState } from "react";
import { toast } from "sonner";
import { useAuth, useDevice } from "@/hooks";
import { useTranslation } from "react-i18next";
import { MESSAGES } from "@/constants/messages";
import Modal from "../ui/modal";
import { ArrowLeft, Mail, X } from "lucide-react";
import { Button } from "../ui/button";
import TermsOfUse from "../common/terms-of-use";
import PrivacyPolicy from "../common/privacy-policy";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import SignInForm from "./login";
import SignUpForm from "./register";
import { cn } from "@/utils";
import AppleIcon from "@/assets/apple-icon";
import Google from "../icons/google";

export default function AuthModal() {
  const { deviceInfo, loading } = useDevice();
  const {
    modalOpen,
    setModalOpen,
    appleSignIn,
    login,
    register,
    googleSignIn,
  } = useAuth();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<"apple" | "email" | null>(null);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await login(email, password);

      toast.success(MESSAGES.SUCCESS.LOGGED_IN);
      close();
    } catch (err) {
      setError(t("auth.signin.error"));
    } finally {
      setIsLoading(false);
      setProvider(null);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await register(email, password);
      close();
    } catch (err) {
      setError(t("auth.signup.error"));
    } finally {
      setIsLoading(false);
      setProvider(null);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await appleSignIn();
      toast.success(MESSAGES.SUCCESS.LOGGED_IN);
      close();
    } catch (err) {
      setError(t("auth.apple_signin.error"));
    } finally {
      setIsLoading(false);
      setProvider(null);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await googleSignIn();
      toast.success(MESSAGES.SUCCESS.LOGGED_IN);
      close();
    } catch (err) {
      setError(t("auth.google_signin.error"));
    } finally {
      setIsLoading(false);
      setProvider(null);
    }
  };

  const goToEmailSignIn = () => {
    setError(null);
    setProvider("email");
  };

  const goToAppleSignIn = () => {
    setError(null);
    setProvider(null);
  };

  const close = () => {
    setModalOpen(false);
  };

  return (
    <Modal open={modalOpen} className="p-4 border  max-w-sm">
      <div className="space-y-4 relative">
        <Button
          variant="outline"
          size="icon"
          className={cn("absolute -top-2 -left-2", !provider && "hidden")}
          onClick={goToAppleSignIn}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="text-center ">
          <h2 className="text-lg font-semibold">
            {t("auth.common.welcome_back")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("auth.common.sign_in_to_continue")}
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute -top-2 -right-2"
          onClick={close}
        >
          <X className="w-6 h-6" />
        </Button>
        {error && (
          <div className="text-red-500 text-xs text-center mb-4">{error}</div>
        )}

        {!provider && (
          <div className="flex flex-col w-full gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={goToEmailSignIn}
              disabled={isLoading}
            >
              <Mail />
              {t("auth.common.sign_in_with_email")}
            </Button>
            {deviceInfo?.platform === "ios" && !loading && (
              <Button
                className="w-full"
                onClick={handleAppleSignIn}
                disabled={isLoading}
              >
                <AppleIcon
                  className="dark:fill-black fill-white"
                  width={"100px"}
                  height={"100px"}
                />
                {t("auth.common.sign_in_with_apple")}
              </Button>
            )}
            {deviceInfo?.platform === "android" && !loading && (
              <Button
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <Google width={"100px"} height={"100px"} />
                {t("auth.common.sign_in_with_google")}
              </Button>
            )}
          </div>
        )}

        {!provider && (
          <div className="px-4 text-center">
            <label htmlFor="terms" className="text-xs text-muted-foreground">
              <span className="text-primary">
                <TermsOfUse />
              </span>
              {t("auth.signup.and")}{" "}
              <span className="text-primary">
                <PrivacyPolicy />
              </span>
            </label>
          </div>
        )}

        {provider === "email" && (
          <div>
            <Tabs defaultValue="in" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="in">Sign In</TabsTrigger>
                <TabsTrigger value="up">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="in">
                <SignInForm onSubmit={handleSignIn} isLoading={isLoading} />
              </TabsContent>
              <TabsContent value="up">
                <SignUpForm onSubmit={handleSignUp} isLoading={isLoading} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </Modal>
  );
}
