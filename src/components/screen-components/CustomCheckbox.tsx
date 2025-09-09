import type { CustomCheckboxProps } from "@/types/responseTypes";

// ✅ Blue background + white tick (Tailwind v4, no config needed)
const CustomCheckbox = ({ id, checked, onChange }: CustomCheckboxProps) => {
  return (
    <label
      htmlFor={id}
      className="group inline-flex cursor-pointer select-none items-center gap-3 text-slate-600 hover:text-slate-900"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />

      {/* Visual box */}
      <span
        className="
          relative grid h-5 w-5 place-items-center rounded-[4px] border-2 border-[#9E9E9E] bg-white transition-all
          peer-checked:border-[#005BC4] peer-checked:bg-[#005BC4] peer-focus:ring-2 peer-focus:ring-[#005BC4]/40
          /* ✨ key fix: when the peer is checked, affect the nested SVG */
          peer-checked:[&_svg]:block peer-checked:[&_svg]:scale-100
        "
        aria-hidden="true"
      >
        {/* Tick */}
        <svg
          className="pointer-events-none absolute hidden scale-90 transition"
          width="12"
          height="10"
          viewBox="0 0 12 10"
          fill="none"
        >
          <path
            d="M2 6 L5 9 L10 4"
            stroke="#FFFFFF"          /* ✅ white tick */
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </label>
  );
};


export default CustomCheckbox;
