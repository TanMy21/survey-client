import { motion, type Transition } from "motion/react";

const Model3dLoader = () => {
  const size = 64;
  const halfSize = size / 2;

  const faceTransition: Transition = {
    duration: 2,
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "reverse", // morph back to a square
  };

  return (
    <motion.div style={{ perspective: 1000 }}>
      <motion.div
        className="relative"
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateX: -30, rotateY: -45 }}
        transition={{
          duration: 8,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {/* Front Face */}
        <motion.div
          className="absolute h-full w-full border-2 border-gray-800 bg-transparent"
          animate={{
            transform: [`rotateY(0deg) translateZ(0px)`, `rotateY(0deg) translateZ(${halfSize}px)`],
          }}
          transition={faceTransition}
        />
        {/* Back Face */}
        <motion.div
          className="absolute h-full w-full border-2 border-gray-800 bg-transparent"
          animate={{
            transform: [
              `rotateY(0deg) translateZ(0px)`,
              `rotateY(180deg) translateZ(${halfSize}px)`,
            ],
          }}
          transition={faceTransition}
        />
        {/* Left Face */}
        <motion.div
          className="absolute h-full w-full border-2 border-gray-800 bg-transparent"
          animate={{
            transform: [
              `rotateY(0deg) translateZ(0px)`,
              `rotateY(-90deg) translateZ(${halfSize}px)`,
            ],
          }}
          transition={faceTransition}
        />
        {/* Right Face */}
        <motion.div
          className="absolute h-full w-full border-2 border-gray-800 bg-transparent"
          animate={{
            transform: [
              `rotateY(0deg) translateZ(0px)`,
              `rotateY(90deg) translateZ(${halfSize}px)`,
            ],
          }}
          transition={faceTransition}
        />
        {/* Top Face */}
        <motion.div
          className="absolute h-full w-full border-2 border-gray-800 bg-transparent"
          animate={{
            transform: [
              `rotateX(0deg) translateZ(0px)`,
              `rotateX(90deg) translateZ(${halfSize}px)`,
            ],
          }}
          transition={faceTransition}
        />
        {/* Bottom Face */}
        <motion.div
          className="absolute h-full w-full border-2 border-gray-800 bg-transparent"
          animate={{
            transform: [
              `rotateX(0deg) translateZ(0px)`,
              `rotateX(-90deg) translateZ(${halfSize}px)`,
            ],
          }}
          transition={faceTransition}
        />
      </motion.div>
    </motion.div>
  );
};

export default Model3dLoader;
