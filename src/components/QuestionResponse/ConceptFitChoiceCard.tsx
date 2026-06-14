import React from "react";

export const ConceptFitChoiceCard = React.forwardRef<
  HTMLDivElement,
  {
    label: string;
    side: "left" | "right";
    keyLabel: "E" | "I";
    selected: boolean;
    isMobile: boolean;
    onSelect: () => void;
  }
>(({ label, side, keyLabel, selected, isMobile, onSelect }, ref) => {
  const isLeft = side === "left";

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        const key = event.key.toLowerCase();

        if (event.key === "Enter" || event.key === " " || key === keyLabel.toLowerCase()) {
          event.preventDefault();
          onSelect();
        }
      }}
      className={[
        "flex cursor-pointer flex-col items-center justify-center rounded-[22px] border px-4 text-center transition",
        isMobile ? "min-h-[64px] gap-1 py-3" : "min-h-[92px] gap-2 py-5",
        isLeft
          ? "border-rose-100 bg-rose-50 text-rose-700 shadow-[0_6px_14px_rgba(190,18,60,0.08)]"
          : "border-emerald-100 bg-emerald-50 text-emerald-700 shadow-[0_6px_14px_rgba(4,120,87,0.08)]",
        selected ? "scale-[1.02] ring-2 ring-[#005BC4]/20" : "hover:scale-[1.01]",
      ].join(" ")}
    >
      {!isMobile && (
        <div className="flex items-baseline gap-[4px] leading-none">
          <span className="text-[11px] leading-none font-extrabold tracking-[0.08em] uppercase opacity-70">
            Press
          </span>

          <span className="inline-flex -translate-y-[0.25px] items-center justify-center text-[20px] leading-none font-black">
            {keyLabel}
          </span>
        </div>
      )}

      <span className={[
    "font-black tracking-[0.04em] uppercase",
    isMobile ? "text-[24px] leading-none" : "text-sm",
  ].join(" ")}>{label}</span>
    </div>
  );
});

ConceptFitChoiceCard.displayName = "ConceptFitChoiceCard";
