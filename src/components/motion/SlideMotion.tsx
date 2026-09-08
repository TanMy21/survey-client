import type { SlideMotionProps } from "@/types/questionTypes";
import { AnimatePresence, motion } from "motion/react";

const variants = {
  enter: (direction: "left" | "right") => ({
    x: direction === "right" ? 300 : -300,
    opacity: 0,
    position: "absolute" as const,
  }),
  center: {
    x: 0,
    opacity: 1,
    position: "relative" as const,
  },
  exit: (direction: "left" | "right") => ({
    x: direction === "right" ? -300 : 300,
    opacity: 0,
    position: "absolute" as const,
  }),
};

export const SlideMotion = ({
  children,
  direction,
  keyProp,
  className = "flex min-h-0 w-full flex-1 flex-col",
}: SlideMotionProps) => {
  return (
    <AnimatePresence custom={direction} mode="wait">
      <motion.div
        key={keyProp}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.3 }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
