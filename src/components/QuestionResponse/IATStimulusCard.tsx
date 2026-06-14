export const IATStimulusCard = ({ stimulus }: { stimulus: string }) => {
  return (
    <div className="relative flex min-h-[77px] w-full items-center justify-center overflow-hidden rounded-[24px] border border-slate-200 bg-white px-4 py-4 text-center shadow-[0_14px_30px_rgba(15,23,42,0.10)] md:min-h-[128px] md:rounded-[28px] md:px-5 md:py-8 md:shadow-[0_18px_38px_rgba(15,23,42,0.11)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,116,235,0.08),transparent_54%)]" />

      <p className="relative text-[42px] leading-[1] font-black break-words text-slate-900 md:text-[30px] md:leading-[1.1]">
        {stimulus}
      </p>
    </div>
  );
};
