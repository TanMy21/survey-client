import type { SliderProps } from "@/types/responseTypes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const ScaleCounter = ({ question, value, setValue }: SliderProps) => {
  const { questionPreferences } = question || {};
  const minValue = questionPreferences?.uiConfig?.minValue ?? {};
  const maxValue = questionPreferences?.uiConfig?.maxValue ?? {};

  const [direction, setDirection] = useState(1);

  const increment = () => {
    if (value < maxValue) {
      setDirection(1);
      setValue(value + 1);
    }
  };

  const decrement = () => {
    if (value > minValue) {
      setDirection(-1);
      setValue(value - 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 15 : -15,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      y: direction < 0 ? 15 : -15,
      opacity: 0,
    }),
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 font-sans">
      <div className="flex items-center justify-center gap-6">
        {/* Decrement button */}
        <button
          onClick={decrement}
          disabled={value === minValue}
          aria-label="Decrement"
          className="text-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Animated number */}
        <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={value}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                y: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute text-4xl font-bold"
            >
              {value}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Increment button */}
        <button
          onClick={increment}
          disabled={value === maxValue}
          aria-label="Increment"
          className="text-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default ScaleCounter;
