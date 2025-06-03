import config from "@/config";
import { Device } from "@capacitor/device";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import axios from "axios";

export * from "./tailwind";

/**
 * Formats time in seconds to "MM:SS" string.
 * @param seconds Time in seconds
 * @returns Formatted time string
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export function throwConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "1000";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti: any[] = [];
  const colors = ["#ff0", "#f00", "#0f0", "#00f", "#f0f", "#0ff"];

  // Create confetti pieces
  for (let i = 0; i < 100; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height, // Start above screen
      size: Math.random() * 10 + 5,
      speed: Math.random() * 5 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 5 - 2.5,
    });
  }

  function animate() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach((piece, index) => {
      piece.y += piece.speed;
      piece.rotation += piece.rotSpeed;

      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate((piece.rotation * Math.PI) / 180);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
      ctx.restore();

      // Remove confetti that falls off screen
      if (piece.y > canvas.height + piece.size) {
        confetti.splice(index, 1);
      }
    });

    // Stop animation when all confetti is gone
    if (confetti.length > 0) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  animate();
}

export const hapticsImpactLight = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch (e) {
    console.warn("Haptics not available or failed:", e);
  }
};

export const isDeviceInChina = (): boolean => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timeZone === "Asia/Shanghai";
};

export async function isRegionSetToChina(): Promise<boolean> {
  const locale = await Device.getLanguageTag();

  // Check for China locale - language tags often have format like "zh-CN"
  const isRegionCN = locale?.value.toUpperCase().includes("CN");

  return isRegionCN;
}

const isDeviceInChinaByRequest = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${config.apiUrl}/country`);
    const countryCode = response.data.country;
    console.log("Country code from API:", countryCode);
    return countryCode === "CN";
  } catch {
    return false;
  }
};

export async function isLikelyInChina(): Promise<boolean> {
  const byTimeZone = isDeviceInChina();
  const byLocale = isRegionSetToChina();
  const byRequest = await isDeviceInChinaByRequest();

  return byTimeZone || byLocale || byRequest;
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "_") // replace spaces & non-word chars with dash
    .replace(/^-+|-+$/g, ""); // remove leading/trailing dashes
}

/**
 * Converts a Capacitor internal file URI to a standard file URI.
 * @param uri The internal Capacitor file URI
 * @return The converted file URI
 *  */
export function convertInternalSrcToFileSrc(uri: string): string {
  return uri.replace("capacitor://localhost/_capacitor_file_", "file://");
}
