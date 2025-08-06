import type { InputErrorProps } from "@/types/question";
import { AnimatePresence, motion } from "motion/react";

export const InputError = ({ error, className = "" }: InputErrorProps) => {
  return (
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.2 }}
          className={`mx-auto mt-1 px-4 text-left text-xl text-red-500 md:w-[56%] ${className}`}
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
};