export const IATCategoryTargetCard = ({
  side,
  toneSide,
  keyLabel,
  brand,
  association,
  selected,
  onSelect,
  compact = false,
}: {
  side: "left" | "right";
  toneSide?: "left" | "right";
  keyLabel: string;
  brand: string;
  association: string;
  selected: boolean;
  onSelect: () => void;
  compact?: boolean;
}) => {
  const visualSide = toneSide || side;
  const isLeftTone = visualSide === "left";

  return (
    <div
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
        "relative cursor-pointer overflow-hidden border text-center transition outline-none",
        compact
          ? "min-h-[132px] rounded-[24px] px-2.5 py-4"
          : "min-h-[150px] rounded-[22px] px-4 py-5",
        isLeftTone
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[0_8px_18px_rgba(15,23,42,0.06)]"
          : "border-blue-200 bg-blue-50 text-blue-700 shadow-[0_8px_18px_rgba(15,23,42,0.06)]",
        selected ? "scale-[1.02] ring-2 ring-[#005BC4]/20" : "hover:scale-[1.01]",
      ].join(" ")}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* Hidden on mobile/compact cards, visible on desktop */}
      <div className="hidden items-baseline justify-center gap-[2px] leading-none md:flex">
        <span className="text-[11px] font-extrabold tracking-[0.08em] uppercase opacity-50">
          Press
        </span>

        <span className="inline-flex -translate-y-[0.5px] items-center justify-center text-[20px] leading-none font-black">
          {keyLabel}
        </span>
      </div>

      <div
        className={[
          "flex flex-col items-center justify-center",
          compact ? "mt-1 h-full" : "mt-5",
        ].join(" ")}
      >
        <p
          className={[
            "leading-tight font-black break-words",
            compact ? "text-[24px]" : "text-2xl",
            isLeftTone ? "text-emerald-800" : "text-blue-800",
          ].join(" ")}
        >
          {brand}
        </p>

        <p
          className={[
            "my-1 leading-none font-black",
            compact ? "text-lg" : "text-base",
            isLeftTone ? "text-emerald-400" : "text-blue-400",
          ].join(" ")}
        >
          +
        </p>

        <p
          className={[
            "leading-tight font-black break-words",
            compact ? "text-2xl" : "text-xl",
            isLeftTone ? "text-emerald-700" : "text-blue-700",
          ].join(" ")}
        >
          {association}
        </p>
      </div>
    </div>
  );
};
