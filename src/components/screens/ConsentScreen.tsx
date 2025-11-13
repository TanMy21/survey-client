import { collectionItems } from "@/constants/collectionItems";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useSurveyFlow } from "@/context/useSurveyFlow";
import { useDeviceId } from "@/hooks/useDeviceID";
import { useSubmitOnEnter } from "@/hooks/useSubmitOnEnter";
import { useRecordConsent } from "@/hooks/useSurvey";
import type { QuestionProps } from "@/types/questionTypes";
import { useEffect, useRef, useState } from "react";

const ConsentScreen = ({ surveyID }: QuestionProps) => {
  const { setCanProceed } = useSurveyFlow();
  const [agreed, setAgreed] = useState(false);
  const { goNext } = useFlowRuntime();
  const containerRef = useRef<HTMLDivElement>(null);

  const deviceID = useDeviceId();
  const { mutate, isPending } = useRecordConsent();

  useEffect(() => {
    setCanProceed(false);
  }, [setCanProceed]);

  const handleSubmit = () => {
    if (!agreed || !deviceID) return;

    const consentedAtClient = new Date().toISOString();

    console.log("Recording consent at:", deviceID);

    mutate(
      {
        surveyID,
        deviceID,
        consentGiven: true,
        consentTimestamp: consentedAtClient,
      },
      {
        onSuccess: () => {
          setCanProceed(true);
          goNext();
        },
      }
    );
  };

  const handleKeyDown = useSubmitOnEnter(handleSubmit);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 font-sans">
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl outline-none sm:p-8"
        aria-labelledby="privacy-heading"
        role="region"
      >
        <div className="flex flex-col items-center gap-5 text-center md:items-start md:gap-6 lg:flex-row lg:gap-8 lg:text-left">
          {/* Illustration */}
          <div className="flex-shrink-0">
            <div className="rounded-full bg-blue-100 p-4 text-blue-600">
              <svg
                className="h-12 w-12 lg:h-14 lg:w-14"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
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
          <div className="w-full">
            <h1 id="privacy-heading" className="text-2xl font-bold text-gray-800 sm:text-3xl">
              We Respect Your Privacy
            </h1>

            <p className="mt-2 text-base text-gray-600 lg:mt-3">
              Before you begin, we’d like your consent to collect certain information to help us
              improve experience.
            </p>

            {/* Collection List */}
            <div className="mt-5 text-left sm:mt-6">
              <p className="mb-3 font-semibold text-gray-700">What we collect:</p>
              <ul className="space-y-3 text-gray-600">
                {collectionItems.map(({ icon, label }, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex w-6 flex-shrink-0 justify-center pt-0.5 text-lg text-blue-500">
                      {icon}
                    </span>
                    <span className="mt-1 text-base">{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Usage Info */}
            <div className="mt-5 rounded-lg bg-gray-50 p-3.5 text-left sm:mt-6">
              <p className="text-sm text-gray-600">
                This data is used only to improve our services and will never be used to identify
                you personally. Learn more in our{" "}
                <a
                  href="#"
                  className="rounded font-medium text-blue-600 hover:underline focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            {/* Consent + Button */}
            <div className="mt-6 sm:mt-8">
              <label className="flex cursor-pointer items-start text-left">
                <div className="relative mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="peer h-full w-full appearance-none rounded border-2 border-gray-300 bg-white checked:border-blue-600 checked:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    aria-describedby="consent-text"
                  />
                  <svg
                    className="pointer-events-none absolute hidden h-3 w-3 text-white peer-checked:block"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span id="consent-text" className="mt-1 ml-3 text-sm text-gray-700">
                  I agree to the terms and consent to data collection for this session.
                </span>
              </label>
              <button
                onClick={handleSubmit}
                disabled={!agreed}
                className={`mt-6 w-full rounded-lg px-4 py-3 text-base font-bold transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                  agreed
                    ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600"
                    : "cursor-not-allowed bg-gray-300 text-gray-500"
                }`}
                aria-disabled={!agreed}
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
