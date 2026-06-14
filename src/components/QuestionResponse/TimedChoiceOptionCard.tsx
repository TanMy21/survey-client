export const TimedChoiceOptionCard = ({
  text,
  imageUrl,
  altText,
  selected,
  side,
}: {
  text: string;
  imageUrl?: string;
  altText?: string | null;
  selected: boolean;
  side: "left" | "right";
}) => {
  return (
    <div
      className={[
        "relative flex min-h-[64px] w-full flex-col overflow-hidden rounded-4xl border bg-white px-2 py-2 transition-all duration-200",
        selected
          ? "border-orange-300 shadow-[0_10px_28px_rgba(234,88,12,0.12)] ring-2 ring-[#005BC4]/15"
          : "border-slate-200 shadow-[0_8px_22px_rgba(15,23,42,0.06)] hover:border-orange-300 hover:shadow-[0_10px_28px_rgba(234,88,12,0.12)]",
      ].join(" ")}
    >
      {imageUrl && (
        <div className="mb-2 rounded-4xl border border-slate-200 bg-white">
          <img
            src={imageUrl}
            alt={altText || text}
            className="block max-h-full max-w-full rounded-2xl object-contain"
          />
        </div>
      )}

      <div
        className={[
          "flex flex-1 items-center justify-center rounded-xl px-4 text-center",
          imageUrl ? "min-h-[48px] py-1.5" : "min-h-[64px] py-1.5",
          "bg-white",
        ].join(" ")}
      >
        <p
          className={[
            "text-lg leading-tight font-black break-words",
            selected ? "text-[#17293f]" : "text-slate-900",
          ].join(" ")}
        >
          {text}
        </p>
      </div>
    </div>
  );
};
