"use client";
import { useEffect, useState } from "react";
import { TCustomOverlayEvent } from "./types";
import { cn } from "../../utils";
import { createPortal } from "react-dom";

interface OverlayProps {
  initLoad?: boolean;
}
const DEFAULT_DURATION = 3000;
const Overlay: React.FC<OverlayProps> = ({ initLoad = false }) => {
  const [visible, setVisible] = useState(initLoad);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const toggle = (duration: number) => {
      setVisible(true);
      setTimeout(() => {
        setClosing(true);
      }, duration - 1000);
      setTimeout(() => {
        setVisible(false);
        setClosing(false);
      }, duration);
    };

    const handleOverlay = (e: TCustomOverlayEvent) => {
      if (e.detail?.close) {
        setVisible(false);
        return;
      }
      const duration = e.detail?.duration || DEFAULT_DURATION;
      toggle(duration);
    };

    document.addEventListener("overlay", handleOverlay);

    if (initLoad) {
      toggle(DEFAULT_DURATION);
    }

    return () => {
      document.removeEventListener("overlay", handleOverlay);
    };
  }, []);

  const overlay = () => {
    return (
      <>
        {visible && (
          <div
            className={cn(
              "fixed inset-0 z-[1000] flex items-center justify-center bg-background opacity-[1] transition-opacity duration-1000 dark:bg-black",
              closing && "opacity-0"
            )}
          >
            APP ICON
          </div>
        )}
      </>
    );
  };

  return createPortal(overlay(), document.body);
};

export default Overlay;
