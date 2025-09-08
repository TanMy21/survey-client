import type { CustomCheckboxProps } from "@/types/responseTypes";

const CustomCheckbox = ({ id, checked, onChange, label }: CustomCheckboxProps) => {
  return (
    <label
      htmlFor={id}
      className="group inline-flex cursor-pointer items-center gap-3 text-slate-600 select-none hover:text-slate-900"
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
        className="peer-checked:animate-shrink-bounce relative grid h-5 w-5 place-items-center rounded-[4px] border-2 border-[#9E9E9E] bg-white transition-all peer-checked:border-[#005BC4] peer-checked:bg-[#005BC4] peer-focus:ring-2 peer-focus:ring-[#005BC4]/40"
        aria-hidden="true"
      >
        {/* Checkmark */}
        <svg
          className="pointer-events-none absolute scale-90 stroke-white opacity-0 peer-checked:scale-100 peer-checked:opacity-100"
          width="12"
          height="10"
          viewBox="0 0 12 10" // The coordinate system for the path
          fill="none"
        >
          {/* ✅ This path creates the new checkmark shape */}
          <path
            d="M2 6 L5 9 L10 4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="peer-checked:animate-[draw-check_180ms_cubic-bezier(.4,0,.23,1)_120ms_both]"
            style={{ strokeDasharray: 20, strokeDashoffset: 20 }}
          />
        </svg>
      </span>
    </label>
  );
};

export default CustomCheckbox;
