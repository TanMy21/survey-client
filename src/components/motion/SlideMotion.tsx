import type { SlideMotionProps } from "@/types/question";
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

export const SlideMotion = ({ children, direction, keyProp }: SlideMotionProps) => {
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
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
