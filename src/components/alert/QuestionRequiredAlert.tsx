import { useRequiredAlert } from "@/context/RequiredAlertContext";

const QuestionRequiredAlert = () => {
  const { open, hideAlert } = useRequiredAlert();
  if (!open) return null;
  return (
    <div className="fixed top-4 left-1/2 z-100 w-full max-w-md -translate-x-1/2 transform">
      <div
        className="flex items-center justify-between gap-2 rounded-md border border-red-600 bg-red-100 px-4 py-3 text-sm text-red-700 shadow-lg transition-all duration-300"
        role="alert"
      >
        <span className="font-medium">
          This question is required. Please answer before submitting.
        </span>
        <button
          onClick={hideAlert}
          className="text-xl leading-none text-red-600 hover:text-red-800"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default QuestionRequiredAlert;
