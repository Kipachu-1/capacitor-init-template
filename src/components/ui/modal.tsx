import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Variants } from "motion/react";

export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 10,
  },
};

type TModalProps = {
  open?: boolean;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
};

const Modal: React.FC<TModalProps> = ({
  open,
  children,
  onClose,
  className,
}) => {
  const [mounted, setMounted] = useState(false);

  // Handle mounting after component mounts (for SSR compatibility)
  useEffect(() => {
    setMounted(true);

    // Optional: Prevent scrolling on body when modal is open
    if (open) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Only render if component is mounted (to avoid SSR issues)
  if (!mounted) return null;

  // FIXME: close does not work
  // Create portal content
  const modalContent = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <div className="fixed overscroll-contain overflow-hidden inset-0 z-50 flex p-2 items-center justify-center">
            <motion.div
              transition={{
                type: "spring",
                stiffness: 600,
                damping: 30,
              }}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "bg-background overflow-hidden rounded-lg relative overscroll-contain w-full max-h-full max-w-2xl flex flex-col",
                className
              )}
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  // Render the modal in a portal attached to the document body
  return createPortal(modalContent, document.body);
};

export default Modal;
