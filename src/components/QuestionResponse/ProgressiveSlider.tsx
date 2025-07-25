import type { Mark, SliderProps } from "@/types/response";
import { useMemo, type ReactNode } from "react";

const STATIC_CONFIG = {
  tick: { minSize: 8, increment: 2 },
  segment: { minThickness: 4, increment: 2 },
  gap: 8,
};

const generateMarks = (minValue: number, maxValue: number): Mark[] => {
  const marks: Mark[] = [];
  for (let i = minValue; i <= maxValue; i++) {
    marks.push({ value: i, label: `${i}` });
  }
  return marks;
};

const valueToPercent = (value: number, min: number, max: number): number => {
  return ((value - min) * 100) / (max - min);
};

const getTickSize = (index: number): number =>
  STATIC_CONFIG.tick.minSize + index * STATIC_CONFIG.tick.increment;

const getSegmentThickness = (index: number): number =>
  STATIC_CONFIG.segment.minThickness + index * STATIC_CONFIG.segment.increment;

const getSegmentBackground = (
  index: number,
  currentValue: number,
  totalSegments: number,
  marks: Mark[]
): string => {
  const progress = index / totalSegments;
  const isActive = marks[index].value < currentValue;

  if (!isActive) return "#F0F4F8";
  if (progress <= 0.25) return "linear-gradient(to right, #D2DEFF, #6596FE)";
  if (progress <= 0.5) return "#6596FE";
  if (progress <= 0.75) return "linear-gradient(to right, #6596FE, #3777FE)";
  return "linear-gradient(to right, #3777FE, #1E3A8A)";
};

const ProgressiveSlider = ({ question, value, setValue }: SliderProps) => {
  const { questionPreferences } = question || {};
  const { minValue, maxValue } = questionPreferences?.uiConfig || {};

  const min = minValue ?? 1;
  const max = maxValue ?? 5;
  const marks = useMemo(() => generateMarks(min, max), [min, max]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  const sliderElements = useMemo(() => {
    const segments: ReactNode[] = [];
    const visibleTicks: ReactNode[] = [];
    const labels: ReactNode[] = [];

    marks.forEach((mark, i) => {
      const percent = valueToPercent(mark.value, min, max);
      const tickSize = getTickSize(i);

      visibleTicks.push(
        <div
          key={`tick-${mark.value}`}
          style={{
            left: `${percent}%`,
            width: tickSize,
            height: tickSize,
            backgroundColor: mark.value <= value ? "#3777FE" : "#F0F4F8",
            boxShadow: value === mark.value ? "0 0 0 4px #D2DEFF" : "none",
          }}
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200"
        />
      );

      labels.push(
        <div
          key={`label-${mark.value}`}
          style={{ left: `${percent}%` }}
          className={`absolute -translate-x-1/2 text-center text-xl whitespace-nowrap transition-all duration-200 ${
            value === mark.value ? "font-bold text-blue-600" : "text-gray-500"
          }`}
        >
          {mark.label}
        </div>
      );

      if (i < marks.length - 1) {
        const nextTickSize = getTickSize(i + 1);
        const segmentThickness = getSegmentThickness(i);
        const startPercent = valueToPercent(mark.value, min, max);
        const endPercent = valueToPercent(marks[i + 1].value, min, max);
        const segmentWidth = `calc(${endPercent - startPercent}% - ${tickSize / 2}px - ${nextTickSize / 2}px - ${
          STATIC_CONFIG.gap * 2
        }px)`;
        const leftOffset = `calc(${startPercent}% + ${tickSize / 2}px + ${STATIC_CONFIG.gap}px)`;

        segments.push(
          <div
            key={`segment-${i}`}
            style={{
              height: segmentThickness,
              left: leftOffset,
              width: segmentWidth,
              background: getSegmentBackground(i, value, marks.length - 1, marks),
              borderRadius: `${segmentThickness / 2}px`,
            }}
            className="absolute top-1/2 -translate-y-1/2"
          />
        );
      }
    });

    return { segments, visibleTicks, labels };
  }, [value, min, max, marks]);

  return (
    <div className="w-full px-2 py-4">
      <div className="relative mb-3 h-10">
        {/* Track container with segments and ticks */}
        <div className="pointer-events-none absolute top-1/2 left-0 w-full -translate-y-1/2">
          {sliderElements.segments}
          {sliderElements.visibleTicks}
        </div>

        {/* Native input slider (hidden thumb) */}
        <input
          type="range"
          value={value}
          min={min}
          max={max}
          step={1}
          onChange={handleSliderChange}
          className="relative z-10 w-full appearance-none bg-transparent focus:outline-none"
          style={{
            height: "40px",
            pointerEvents: "auto",
          }}
        />

        {/* Hide thumb via global CSS or Tailwind plugin if needed */}
        <style>
          {`
            input[type=range]::-webkit-slider-thumb {
              height: 0;
              width: 0;
              appearance: none;
            }
            input[type=range]::-moz-range-thumb {
              height: 0;
              width: 0;
              appearance: none;
            }
          `}
        </style>
      </div>

      {/* Labels */}
      <div className="relative h-5">{sliderElements.labels}</div>
    </div>
  );
};

export default ProgressiveSlider;
