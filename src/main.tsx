import "./assets/globals.css";
import ReactDOM from "react-dom/client";
import App from "./app";
import { Provider } from "jotai";
import RQProviders from "./lib/react-query/RQprovider";
import { AppErrorBoundary } from "./components/error-boundary";
import { AppSettings } from "./services/settings";
import { BrowserRouter } from "react-router";
import { SafeArea } from "capacitor-plugin-safe-area";
import { StatusBar, Style } from "@capacitor/status-bar";

import "./i18n";

const handleError = (error: Error) => {
  console.error("Application error:", error);
};

AppSettings.getSetting("theme").then((theme) => {
  if (theme === "dark" && !document.body.classList.contains("dark")) {
    document.body.classList.add("dark");
    StatusBar.setStyle({
      style: Style.Dark,
    });
  }
});

SafeArea.getSafeAreaInsets().then(({ insets }) => {
  for (const [key, value] of Object.entries(insets)) {
    document.documentElement.style.setProperty(
      `--safe-area-inset-${key}`,
      `${value}px`
    );
  }
});

// when safe-area changed
SafeArea.addListener("safeAreaChanged", (data) => {
  const { insets } = data;
  for (const [key, value] of Object.entries(insets)) {
    document.documentElement.style.setProperty(
      `--safe-area-inset-${key}`,
      `${value}px`
    );
  }
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <AppErrorBoundary onError={handleError}>
      <BrowserRouter>
        <RQProviders>
          <Provider>
            <App />
          </Provider>
        </RQProviders>
      </BrowserRouter>
    </AppErrorBoundary>
  </>
);
