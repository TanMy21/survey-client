import { motion } from "motion/react";

export const SuccessCheckmark = ({ size = 100 }) => {
  const checkmarkPath = "M20 50 L40 70 L80 30";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.1,
        }}
        className="absolute inset-0 rounded-full bg-green-500 shadow-lg"
      />

      {/* SVG Checkmark */}
      <svg
        viewBox="0 0 100 100"
        className="z-10 h-full w-full"
        fill="none"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d={checkmarkPath}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
            delay: 0.4,
          }}
        />
      </svg>

      {/* Decorative Particles for "Burst" Effect */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-green-400"
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            x: Math.cos(i * 45 * (Math.PI / 180)) * (size * 0.7),
            y: Math.sin(i * 45 * (Math.PI / 180)) * (size * 0.7),
          }}
          transition={{
            duration: 0.6,
            delay: 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};
