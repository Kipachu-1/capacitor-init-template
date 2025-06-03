import { entitlementStatusAtom } from "@/state";
import { Purchases } from "@revenuecat/purchases-capacitor";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";

export const useIsPremium = () => {
  const [status, setStatus] = useAtom(entitlementStatusAtom);
  const listenerId = useRef<string | null>(null);

  useEffect(() => {
    Purchases.addCustomerInfoUpdateListener(async (customerInfo) => {
      try {
        if ("Premium" in customerInfo.entitlements?.active) {
          setStatus("active");
        } else {
          setStatus("inactive");
        }
      } catch (error) {
        console.error("Error fetching customer info:", error);
        setStatus("inactive");
      }
    }).then((listener) => {
      listenerId.current = listener;
    });

    return () => {
      if (!listenerId.current) return;
      Purchases.removeCustomerInfoUpdateListener({
        listenerToRemove: listenerId.current,
      });
    };
  }, []);

  const isPremium = status === "active";

  return {
    isPremium,
    status,
  };
};
