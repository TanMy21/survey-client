export const ConceptFitStimulusCard = ({
  attributeText,
  showImageMode,
  imageUrl,
  imageAlt,
  isMobile,
  compactMobileImageLayout = false,
}: {
  attributeText: string;
  showImageMode: boolean;
  imageUrl?: string;
  imageAlt?: string | null;
  isMobile: boolean;
  compactMobileImageLayout?: boolean;
}) => {
  return (
    <div
      className={[
        "flex w-full flex-col items-center",
        compactMobileImageLayout ? "gap-2" : "gap-3",
      ].join(" ")}
    >
      {showImageMode && imageUrl && (
        <div
          className={[
            "flex w-[86%] items-center justify-center overflow-hidden rounded-[22px] border border-slate-200 bg-slate-50 shadow-[0_10px_24px_rgba(15,23,42,0.08)]",
            compactMobileImageLayout
              ? "max-h-[125px]"
              : isMobile
                ? "max-h-[200px]"
                : "max-h-[180px]",
          ].join(" ")}
        >
          <img
            src={imageUrl}
            alt={imageAlt || "Concept preview image"}
            className={[
              "block max-w-full object-contain",
              compactMobileImageLayout
                ? "max-h-[125px]"
                : isMobile
                  ? "max-h-[200px]"
                  : "max-h-[180px]",
            ].join(" ")}
          />
        </div>
      )}

      {showImageMode && !imageUrl && (
        <div
          className={[
            "flex w-[86%] items-center justify-center rounded-[22px] border border-dashed border-slate-300 bg-slate-50 px-4 text-center",
            isMobile ? "min-h-[140px]" : "min-h-[120px]",
          ].join(" ")}
        >
          <p className="text-sm font-bold text-slate-400">Concept image unavailable.</p>
        </div>
      )}

      <div
        className={[
          "flex w-[86%] flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-purple-200 bg-white px-5 text-center shadow-[0_12px_30px_rgba(88,28,135,0.12)]",
          compactMobileImageLayout
            ? "min-h-[68px] py-3"
            : isMobile
              ? "min-h-[92px] py-4"
              : "min-h-[74px] py-4",
        ].join(" ")}
      >
        <p className="text-xl leading-tight font-black break-words text-purple-800">
          {attributeText}
        </p>
      </div>
    </div>
  );
};
