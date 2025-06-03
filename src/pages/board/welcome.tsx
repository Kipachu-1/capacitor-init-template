import { useNavigate } from "react-router";
import { useRef } from "react";
import { ChevronRight } from "lucide-react";
import { AppSettings } from "@/services";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import MetaBalls from "./metaballs";
import * as motion from "motion/react-client";
import { hapticsImpactLight } from "@/utils";

export default function WelcomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  let isThrottled = false;
  const throttleDuration = 150;

  const handleStart = async () => {
    hapticsImpactLight();
    try {
      await AppSettings.setSetting("onboardingCompleted", true);
    } catch (error) {
      console.error("Failed to save onboarding status:", error);
    }
    navigate("/");
  };

  const handleScroll = () => {
    if (!isThrottled) {
      hapticsImpactLight();
      isThrottled = true;
      setTimeout(() => {
        isThrottled = false;
      }, throttleDuration);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-0">
        <div className="absolute bg-dots-without-gradient inset-0 z-10 pointer-events-none"></div>
        <MetaBalls
          onPointerMove={handleScroll}
          color="#000"
          cursorBallColor="#000"
          cursorBallSize={2}
          ballCount={20}
          animationSize={30}
          enableMouseInteraction={true}
          enableTransparency={true}
          hoverSmoothness={0.05}
          clumpFactor={1}
          speed={0.3}
        />
      </div>
      <div className="fixed inset-0 pointer-events-none flex flex-col">
        <div
          ref={scrollContainerRef} // Attach the ref
          className="flex-grow no-scrollbar justify-center relative p-4 md:p-8 flex flex-col items-center gap-8"
          onScroll={handleScroll}
        >
          <div className="w-full flex justify-center items-center">
            <h1 className="text-5xl wrap-normal font-bold text-center">
              {t("welcome.title")}
            </h1>
          </div>
          <motion.div
            className="w-full absolute bottom-[calc(1rem+var(--safe-bottom))] max-w-lg p-4 mt-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="max-w-lg mx-auto">
              <Button
                variant="default"
                size="lg"
                onClick={handleStart}
                className="w-full h-[50px] text-xl flex items-center justify-center pointer-events-auto"
                aria-label="Start Using App"
              >
                {t("common.start", "Start")}
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
