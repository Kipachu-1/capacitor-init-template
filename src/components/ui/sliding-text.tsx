import { cn } from "@/utils";
import { useEffect, useRef, useState } from "react";

type SlidingTextProps = {
  text: string;
  speed?: number; // in seconds
  pauseOnHover?: boolean;
  className?: string;
  direction?: "left" | "right" | "alternate";
  containerWidth?: number; // Optional fixed container width
  maxWidth?: string | number; // Optional max-width (can be percentage or pixels)
} & React.HTMLAttributes<HTMLDivElement>;

const SlidingText: React.FC<SlidingTextProps> = ({
  text,
  speed = 10,
  pauseOnHover = true,
  className,
  direction = "alternate",
  containerWidth,
  maxWidth = "60%",
  ...props
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [shouldSlide, setShouldSlide] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    // Get the actual width of the text element
    const textWidth = textRef.current.scrollWidth;

    // Get container width (either from prop or from DOM)
    const containerWidthValue =
      containerWidth || containerRef.current.offsetWidth;

    // Only enable sliding if text is wider than container
    setShouldSlide(textWidth > containerWidthValue);
  }, [text, containerWidth]);

  if (!text) return null;

  return (
    <div
      ref={containerRef}
      style={{
        maxWidth: containerWidth ? `${containerWidth}px` : maxWidth,
        display: "inline-block",
      }}
      className={cn(
        "overflow-hidden relative",
        pauseOnHover && "group",
        className
      )}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      {...props}
    >
      <div className="flex items-center">
        <p
          ref={textRef}
          className={cn(
            "text-xs text-muted-foreground whitespace-nowrap",
            shouldSlide && "moving-text",
            shouldSlide && isPaused && "animation-play-state-paused",
            shouldSlide && direction === "left" && "direction-left",
            shouldSlide && direction === "right" && "direction-right"
          )}
          style={{
            animationDuration: `${speed}s`,
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
};

export default SlidingText;
