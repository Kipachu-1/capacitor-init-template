import { useEffect, useRef, useState } from "react";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { PluginListenerHandle } from "@capacitor/core";

export function useOrientation() {
  const [orientation, setOrientation] = useState("unknown");
  const listener = useRef<PluginListenerHandle>();

  useEffect(() => {
    (async () => {
      const updateOrientation = async () => {
        const info = await ScreenOrientation.orientation();
        setOrientation(info.type);
      };

      // Initial check
      updateOrientation();

      // Listen to orientation changes
      listener.current = await ScreenOrientation.addListener(
        "screenOrientationChange",
        (event) => {
          setOrientation(event.type);
        }
      );
    })();
    return () => {
      if (listener.current) {
        listener.current.remove();
      }
    };
  }, []);

  return {
    orientation,
    isPortrait: orientation.startsWith("portrait"),
    isLandscape: orientation.startsWith("landscape"),
  };
}
