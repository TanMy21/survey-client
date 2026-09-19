export const TimedChoiceOptionCard = ({
  text,
  imageUrl,
  altText,
  selected,
}: {
  text: string;
  imageUrl?: string;
  altText?: string | null;
  selected: boolean;
}) => {
  return (
    <div
      className={[
        imageUrl
          ? "group flex w-full flex-col"
          : "relative flex min-h-[64px] w-full flex-col overflow-hidden rounded-4xl border bg-white px-2 py-2 transition-all duration-200",
        !imageUrl &&
          (selected
            ? "border-orange-300 shadow-[0_10px_28px_rgba(234,88,12,0.12)] ring-2 ring-[#005BC4]/15"
            : "border-slate-200 shadow-[0_8px_22px_rgba(15,23,42,0.06)] hover:border-orange-300 hover:shadow-[0_10px_28px_rgba(234,88,12,0.12)]"),
      ].join(" ")}
    >
      {imageUrl && (
        <div
          className={[
            "relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border bg-[#F9F9F9] transition duration-200 group-hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
            selected ? "border-[#005BC4] ring-4 ring-[#D2DEFF]" : "border-[#F1F1F1]",
          ].join(" ")}
        >
          <img
            src={imageUrl}
            alt={altText || text}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <p
        className={[
          imageUrl
            ? "mt-3 px-1 text-[16px] leading-[1.4] font-semibold break-words whitespace-pre-wrap text-black"
            : "flex min-h-[64px] flex-1 items-center justify-center rounded-xl px-4 py-1.5 text-center text-lg leading-tight font-black break-words",
          !imageUrl && (selected ? "text-[#17293f]" : "text-slate-900"),
        ].join(" ")}
      >
        {text}
      </p>
    </div>
  );
};
