import { useEffect } from "react";

import { motion, useAnimation } from "motion/react";

export const LogoLoader = () => {
  const topControls = useAnimation();
  const middleControls = useAnimation();
  const bottomControls = useAnimation();
  const loop = true;

  useEffect(() => {
    const sequence = async () => {
      while (loop) {
        await topControls.start({
          clipPath: ["inset(0 75% 0 0)", "inset(0 50% 0 0)", "inset(0 25% 0 0)", "inset(0 0% 0 0)"],
          transition: {
            duration: 1.1,
            ease: "easeInOut",
            times: [0, 0.33, 0.66, 1],
          },
        });

        await middleControls.start({
          clipPath: ["inset(0 75% 0 0)", "inset(0 50% 0 0)", "inset(0 25% 0 0)", "inset(0 0% 0 0)"],
          transition: {
            duration: 1.1,
            ease: "easeInOut",
            times: [0, 0.33, 0.66, 1],
          },
        });

        await bottomControls.start({
          clipPath: ["inset(0 75% 0 0)", "inset(0 50% 0 0)", "inset(0 25% 0 0)", "inset(0 0% 0 0)"],
          transition: {
            duration: 1.1,
            ease: "easeInOut",
            times: [0, 0.33, 0.66, 1],
          },
        });

        await new Promise((res) => setTimeout(res, 1000));

        await Promise.all([
          topControls.start({
            clipPath: "inset(0 100% 0 0)",
            transition: { duration: 0.5 },
          }),
          middleControls.start({
            clipPath: "inset(0 100% 0 0)",
            transition: { duration: 0.5 },
          }),
          bottomControls.start({
            clipPath: "inset(0 100% 0 0)",
            transition: { duration: 0.5 },
          }),
        ]);

        await new Promise((res) => setTimeout(res, 800));
      }
    };

    sequence();
  }, [topControls, middleControls, bottomControls]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <svg viewBox="0 0 400 348" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
        <defs>
          <linearGradient
            id="segmentGradient"
            x1="167.69"
            y1="0"
            x2="184.31"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.552885" stopColor="#007FC8" />
            <stop offset="0.918269" stopColor="#00A7C1" />
          </linearGradient>
        </defs>

        {/* top segment */}
        <g transform="translate(40, 0)">
          <motion.path
            d="M16.647 12.3321C18.3488 5.10625 24.7973 0 32.2209 0H335.794C346.113 0 353.733 9.62371 351.368 19.6679L335.353 87.6679C333.651 94.8937 327.203 100 319.779 100H16.206C5.88703 100 -1.73348 90.3763 0.632061 80.3321L16.647 12.3321Z"
            fill="url(#segmentGradient)"
            stroke="#0082C6"
            strokeWidth="2"
            animate={topControls}
            initial={{ clipPath: "inset(0 100% 0 0)" }}
          />
        </g>
        {/* middle segment */}
        <g transform="translate(20, 116)">
          <motion.path
            d="M16.5094 12.5174C18.1407 5.20241 24.6311 0 32.1258 0H257.039C267.28 0 274.884 9.48724 272.655 19.4826L257.491 87.4826C255.859 94.7976 249.369 100 241.874 100H16.9612C6.72029 100 -0.884261 90.5128 1.34479 80.5174L16.5094 12.5174Z"
            fill="url(#segmentGradient)"
            stroke="#0082C6"
            strokeWidth="2"
            animate={middleControls}
            initial={{ clipPath: "inset(0 100% 0 0)" }}
          />
        </g>
        {/* bottom segment */}
        <g transform="translate(0, 232)">
          <motion.path
            d="M16.8162 12.3048C18.5283 5.09211 24.9706 0 32.3837 0H115.757C126.088 0 133.711 9.644 131.325 19.6952L115.184 87.6952C113.472 94.9079 107.029 100 99.6163 100H16.2425C5.91198 100 -1.7108 90.356 0.675065 80.3048L16.8162 12.3048Z"
            fill="url(#segmentGradient)"
            stroke="#0082C6"
            strokeWidth="2"
            animate={bottomControls}
            initial={{ clipPath: "inset(0 100% 0 0)" }}
          />
        </g>
      </svg>
    </div>
  );
};
