import { isLikelyInChina } from "@/utils";
import { useEffect, useState } from "react";

export const isChina = () => {
  const [positive, setPositive] = useState(true);

  useEffect(() => {
    isLikelyInChina()
      .then((result) => {
        setPositive(result);
      })
      .catch(() => {
        setPositive(false);
      });
  }, []);

  return positive;
};
