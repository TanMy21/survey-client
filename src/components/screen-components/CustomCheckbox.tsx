import type { CustomCheckboxProps } from "@/types/responseTypes";

const CustomCheckbox = ({ id, checked, onChange, label }: CustomCheckboxProps) => {
  return (
    <label
      htmlFor={id}
      className="group inline-flex cursor-pointer items-center gap-3 text-slate-600 select-none hover:text-slate-900"
    >
      {/* Hide native checkbox; use it as the 'peer' for styling */}
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />

      {/* Visual box */}
      <span
        className="relative grid h-5 w-5 place-items-center rounded-[4px] border-2 border-[#9E9E9E] bg-white transition-all duration-200 ease-[cubic-bezier(.4,0,.23,1)] group-hover:bg-black/5 peer-checked:animate-[shrink-bounce_200ms_cubic-bezier(.4,0,.23,1)] peer-checked:border-[#005BC4] peer-checked:bg-[#005BC4] peer-focus:ring-2 peer-focus:ring-[#005BC4]/40 peer-focus:outline-none"
        aria-hidden="true"
      >
        {/* Checkmark (white) */}
        <svg
          className="pointer-events-none absolute scale-90 opacity-0 peer-checked:scale-100 peer-checked:opacity-100"
          width="12"
          height="10"
          viewBox="0 0 12 10"
          fill="none"
        >
          {/* Stroke-draw animation */}
          <path
            d="M1 5 L4 8 L11 1"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-none peer-checked:animate-[draw-check_180ms_120ms_cubic-bezier(.4,0,.23,1)_both]"
            style={{ strokeDasharray: 20, strokeDashoffset: 20 }}
          />
        </svg>
      </span>

    
    </label>
  );
};

export default CustomCheckbox;
