import { useEffect, useState } from "react";

const ConceptFitCountdown = ({
  timeLimitMs,
  resetKey,
}: {
  timeLimitMs: number;
  resetKey: number;
}) => {
  const safeTimeLimitMs = Math.max(1000, timeLimitMs);
  const timeLimitSeconds = Math.max(1, Math.ceil(safeTimeLimitMs / 1000));

  const [secondsLeft, setSecondsLeft] = useState(timeLimitSeconds);
  const [progress, setProgress] = useState(100);

useEffect(() => {
  setSecondsLeft(timeLimitSeconds);
  setProgress(100);

  const startedAt = Date.now();

  const intervalID = window.setInterval(() => {
    const elapsedMs = Date.now() - startedAt;
    const remainingMs = Math.max(0, safeTimeLimitMs - elapsedMs);

    setSecondsLeft(
      remainingMs <= 0 ? 0 : Math.max(1, Math.ceil(remainingMs / 1000)),
    );

    setProgress(Math.max(0, (remainingMs / safeTimeLimitMs) * 100));

    if (remainingMs <= 0) {
      window.clearInterval(intervalID);
    }
  }, 80);

  return () => {
    window.clearInterval(intervalID);
  };
}, [safeTimeLimitMs, timeLimitSeconds, resetKey]);

  return (
    <div className="relative flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#FFF7ED] shadow-[0_6px_16px_rgba(234,88,12,0.12)]">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        className="absolute left-0 top-0 -rotate-90"
      >
        <circle
          cx="23"
          cy="23"
          r="15.5"
          fill="none"
          stroke="#FFEDD5"
          strokeWidth="4"
        />

        <circle
          cx="23"
          cy="23"
          r="15.5"
          fill="none"
          stroke="#EA580C"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 15.5}
          strokeDashoffset={
            2 * Math.PI * 15.5 * (1 - Math.max(0, progress) / 100)
          }
          style={{
            transition: "stroke-dashoffset 80ms linear",
          }}
        />
      </svg>

      <div className="z-[1] flex h-[27px] w-[27px] items-center justify-center rounded-full bg-white shadow-[inset_0_0_0_1px_#FED7AA]">
        <span
          className="font-black leading-none text-[#EA580C]"
          style={{
            fontSize: secondsLeft >= 10 ? 10.5 : 12,
            letterSpacing: "-0.04em",
          }}
        >
          {secondsLeft}s
        </span>
      </div>
    </div>
  );
};

export default ConceptFitCountdown;