import { useState, useEffect } from "react";
import { Device } from "@capacitor/device";

interface DeviceInfo {
  uuid: string;
  model: string;
  platform: string;
  operatingSystem: string;
  osVersion: string;
  manufacturer: string;
  isVirtual: boolean;
}

export function useDevice() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDeviceInfo = async () => {
      try {
        const info = await Device.getInfo();
        const id = await Device.getId();

        setDeviceInfo({
          uuid: id.identifier,
          model: info.model,
          platform: info.platform,
          operatingSystem: info.operatingSystem,
          osVersion: info.osVersion,
          manufacturer: info.manufacturer,
          isVirtual: info.isVirtual,
        });
      } catch (err) {
        console.error("Failed to get device info:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadDeviceInfo();
  }, []);

  return { deviceInfo, loading, error };
}
