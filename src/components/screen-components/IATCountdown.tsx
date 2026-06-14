import { useEffect, useState } from "react";

export const IATCountdown = ({
  timeLimitMs,
  resetKey,
}: {
  timeLimitMs: number;
  resetKey: string;
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

      setSecondsLeft(remainingMs <= 0 ? 0 : Math.max(1, Math.ceil(remainingMs / 1000)));

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
    <div className="relative flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#FFF7ED] shadow-[0_8px_20px_rgba(234,88,12,0.14)]">
      <svg width="54" height="54" viewBox="0 0 54 54" className="absolute top-0 left-0 -rotate-90">
        <circle cx="27" cy="27" r="22" fill="none" stroke="#FFEDD5" strokeWidth="5" />

        <circle
          cx="27"
          cy="27"
          r="22"
          fill="none"
          stroke="#EA580C"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 22}
          strokeDashoffset={2 * Math.PI * 22 * (1 - Math.max(0, progress) / 100)}
          style={{ transition: "stroke-dashoffset 80ms linear" }}
        />
      </svg>

      <div className="z-[1] flex h-[39px] w-[39px] items-center justify-center rounded-full bg-white shadow-[inset_0_0_0_1px_#FED7AA]">
        <span
          className="leading-none font-black text-[#EA580C]"
          style={{
            fontSize: secondsLeft >= 10 ? 12.5 : 15,
            letterSpacing: "-0.05em",
          }}
        >
          {secondsLeft}s
        </span>
      </div>
    </div>
  );
};
