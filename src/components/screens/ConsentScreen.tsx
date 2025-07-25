import type { QuestionProps } from "@/types/question";
import { useState } from "react";

const ConsentScreen = ({ surveyID, question, setCurrentQuestionIndex }: QuestionProps) => {
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = () => {
    if (!agreed) return;

    console.log("User consented to data collection.");

    setCurrentQuestionIndex?.((i) => i + 1);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg sm:p-8 md:p-10">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
          {/* Illustration */}
          <div className="flex-shrink-0">
            <div className="rounded-full bg-blue-100 p-4 text-blue-600 md:p-5">
              <svg
                className="h-12 w-12 md:h-16 md:w-16"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.602-3.751m-.227-1.02a11.959 11.959 0 00-2.25-2.541m-2.252-2.542a11.959 11.959 0 01-2.25 2.542m0 0a11.959 11.959 0 01-2.25 2.541M12 2.25c-2.415 0-4.682.962-6.343 2.542M12 2.25c2.415 0 4.682.962 6.343 2.542"
                />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="w-full text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
              We Respect Your Privacy
            </h1>

            <p className="mt-3 text-gray-600">
              Before you begin, we’d like your consent to collect certain information during this
              survey to help us improve user experience and ensure accurate results.
            </p>

            {/* Collection List */}
            <div className="mt-6 text-left">
              <p className="mb-3 font-semibold text-gray-700">What we collect:</p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-3 text-blue-500">📝</span>
                  Responses to survey questions
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-blue-500">⏱️</span>
                  Time spent on each question
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-blue-500">🖱️</span>
                  Mouse movements and interactions
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-blue-500">💻</span>
                  Device, OS, and browser information
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-blue-500">🌐</span>
                  Language preferences
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-blue-500">🔒</span>
                  Anonymous session ID
                </li>
              </ul>
            </div>

            {/* Usage Info */}
            <div className="mt-6 rounded-lg bg-gray-100 p-3 text-left">
              <p className="text-sm text-gray-600">
                This data is used only to improve the quality of the survey and will never be used
                to identify you personally. You can learn more in our{" "}
                <a href="/privacy" className="font-medium text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            {/* Consent and Button */}
            <div className="mt-8">
              <label className="flex cursor-pointer items-start text-left">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-700">
                  I agree to the terms and consent to data collection for this session.
                </span>
              </label>

              <button
                onClick={handleSubmit}
                disabled={!agreed}
                className={`mt-6 w-full rounded-lg px-4 py-3 font-bold transition-colors duration-300 ${
                  agreed
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "cursor-not-allowed bg-blue-300 text-white"
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ConsentScreen;
