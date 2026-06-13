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
  const isLeft = side === "left";

  return (
    <div
      className={[
        "flex h-full min-h-[120px] w-full flex-col overflow-hidden rounded-2xl border bg-white transition",
        selected
          ? "border-[#005BC4] shadow-[0_12px_28px_rgba(0,91,196,0.18)] ring-2 ring-[#005BC4]/15"
          : "border-slate-200 shadow-[0_8px_18px_rgba(15,23,42,0.06)] hover:border-slate-300",
      ].join(" ")}
    >
      {imageUrl && (
        <div className="flex h-[150px] w-full items-center justify-center bg-slate-50 p-2">
          <img
            src={imageUrl}
            alt={altText || text}
            className="block max-h-full max-w-full object-contain"
          />
        </div>
      )}

      <div
        className={[
          "flex flex-1 items-center justify-center px-4 py-5 text-center",
          imageUrl ? "min-h-[64px]" : "min-h-[120px]",
          isLeft ? "bg-[#F8FBFF]" : "bg-white",
        ].join(" ")}
      >
        <p
          className={[
            "text-lg leading-tight font-black break-words",
            selected ? "text-[#005BC4]" : "text-slate-900",
          ].join(" ")}
        >
          {text}
        </p>
      </div>
    </div>
  );
};
