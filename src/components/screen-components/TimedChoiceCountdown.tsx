import { useEffect, useState } from "react";

export const TimedChoiceCountdown = ({ timeLimitMs }: { timeLimitMs: number }) => {
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

      const nextSecondsLeft = remainingMs <= 0 ? 0 : Math.max(1, Math.ceil(remainingMs / 1000));

      const nextProgress = Math.max(0, (remainingMs / safeTimeLimitMs) * 100);

      setSecondsLeft(nextSecondsLeft);
      setProgress(nextProgress);

      if (remainingMs <= 0) {
        window.clearInterval(intervalID);
      }
    }, 80);

    return () => {
      window.clearInterval(intervalID);
    };
  }, [safeTimeLimitMs, timeLimitSeconds]);

  return (
    <div className="relative flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#FFF7ED] shadow-[0_6px_16px_rgba(234,88,12,0.12)]">
      <svg width="38" height="38" viewBox="0 0 38 38" className="absolute top-0 left-0 -rotate-90">
        <circle cx="19" cy="19" r="15.5" fill="none" stroke="#FFEDD5" strokeWidth="4" />

        <circle
          cx="19"
          cy="19"
          r="15.5"
          fill="none"
          stroke="#EA580C"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 15.5}
          strokeDashoffset={2 * Math.PI * 15.5 * (1 - Math.max(0, progress) / 100)}
          style={{
            transition: "stroke-dashoffset 80ms linear",
          }}
        />
      </svg>

      <div className="z-[1] flex h-[27px] w-[27px] items-center justify-center rounded-full bg-white shadow-[inset_0_0_0_1px_#FED7AA]">
        <span
          className="leading-none font-black text-[#EA580C]"
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
