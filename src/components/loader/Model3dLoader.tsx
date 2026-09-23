import { Box } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const Model3dLoader = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center px-6 text-center text-gray-800"
    >
      <motion.div
        aria-hidden="true"
        className="mb-6"
        animate={reduceMotion ? { rotate: 0 } : { rotate: [0, 12, 0, -12, 0] }}
        transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
      >
        <Box size={56} strokeWidth={1.25} />
      </motion.div>
      <p className="text-base font-medium">Loading 3D model…</p>
      <p className="mt-2 max-w-72 text-sm text-gray-500">
        Getting your interactive view ready
      </p>
    </div>
  );
};

export default Model3dLoader;
