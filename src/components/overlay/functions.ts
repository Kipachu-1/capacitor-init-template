import { TCustomOverlayEventDetail } from "./types";

export const makeLoadOverlay = (data?: TCustomOverlayEventDetail) => {
  if (typeof window === "undefined") return;
  const customEvent = new CustomEvent("overlay", {
    detail: data,
  });
  document.dispatchEvent(customEvent);
};
