import { useNavigate } from "react-router";
import { useEffect } from "react";
import Overlay from "./components/overlay";
import { AppSettings } from "./services/settings";
import Toaster from "./components/toaster";
import { Purchases } from "@revenuecat/purchases-capacitor";
import config from "./config";
import { useAuth } from "./hooks";
import Routes from "./routes";

function App() {
  useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    AppSettings.getSetting("onboardingCompleted").then((completed) => {
      if (!completed) navigate("/boarding/welcome");
    });
    Purchases.configure({
      apiKey: config.revenueCatApiKey,
    });
  }, []);

  return (
    <>
      <Overlay initLoad={true} />
      <Routes />
      <Toaster />
    </>
  );
}

export default App;
