import { useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";

export default function AnimatedHeight({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const resizeObserver = new ResizeObserver(() => {
      setHeight(node.scrollHeight);
    });

    resizeObserver.observe(node);
    setHeight(node.scrollHeight);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <motion.div
      animate={{ height }}
      initial={{ height: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 18,
        mass: 0.5,
      }}
    >
      <div ref={containerRef}>{children}</div>
    </motion.div>
  );
}
