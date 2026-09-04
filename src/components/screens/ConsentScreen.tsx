import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useSurveyFlow } from "@/context/useSurveyFlow";
import { useDeviceId } from "@/hooks/useDeviceID";
import { useSubmitOnEnter } from "@/hooks/useSubmitOnEnter";
import { useRecordConsent } from "@/hooks/useSurvey";
import type { QuestionProps } from "@/types/questionTypes";
import {
  ArrowRight,
  Check,
  Info,
  MessageSquareText,
  MonitorSmartphone,
  MousePointer2,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const consentItems = [
  {
    icon: MessageSquareText,
    title: "Your answers",
    description: "Responses, answer changes and revisits.",
  },
  {
    icon: MousePointer2,
    title: "How you interact",
    description: "Timing, mouse/touch activity, scrolling, typing patterns and time away.",
  },
  {
    icon: Timer,
    title: "Timed & 3D tasks",
    description: "Choices, reaction times and 3D interactions, where included.",
  },
  {
    icon: MonitorSmartphone,
    title: "Device & session",
    description:
      "Browser/device details, language, timezone, IP address, country and a persistent browser ID.",
  },
];

const ConsentScreen = ({ surveyID }: QuestionProps) => {
  const { setCanProceed } = useSurveyFlow();
  const [agreed, setAgreed] = useState(false);
  const { goNext } = useFlowRuntime();
  const containerRef = useRef<HTMLDivElement>(null);

  const deviceID = useDeviceId();
  const { mutate } = useRecordConsent();

  useEffect(() => {
    setCanProceed(false);
  }, [setCanProceed]);

  const handleSubmit = () => {
    if (!agreed || !deviceID) return;

    const consentedAtClient = new Date().toISOString();

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
    <div className="flex min-h-[calc(100dvh-8rem)] w-full items-center justify-center py-4 font-sans sm:py-8">
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="w-full max-w-[616px] min-w-0 rounded-[24px] border border-[#e5e4ec] bg-white px-5 py-7 text-[#24242d] shadow-sm outline-none min-[480px]:px-[30px] min-[480px]:py-8"
        aria-labelledby="privacy-heading"
        role="region"
      >
        <p className="flex items-center gap-1.5 text-[10px] leading-4 tracking-[0.16em] text-[#626982] uppercase">
          <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-[#6952ff]" aria-hidden="true" />
          Consent
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <h1
            id="privacy-heading"
            className="text-[28px] leading-tight font-bold tracking-[-0.035em] min-[480px]:text-[34px]"
          >
            Before you begin
          </h1>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f0edff] text-[#6952ff]">
            <ShieldCheck className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </div>
        </div>

        <p className="mt-3 text-[13px] leading-6 text-[#626982]">
          Your answers and interaction data help the survey creator understand responses and
          participation.
        </p>

        <section className="mt-6" aria-labelledby="collection-heading">
          <h2
            id="collection-heading"
            className="text-[10px] leading-4 font-semibold tracking-[0.14em] text-[#626982] uppercase"
          >
            What we collect
          </h2>
          <ul className="mt-2.5 grid grid-cols-1 gap-2.5 min-[480px]:grid-cols-2">
            {consentItems.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="flex min-w-0 flex-col rounded-[14px] border border-[#eeedf5] bg-[#fcfbfe] p-4 min-[480px]:min-h-[140px]"
              >
                <span className="mb-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#f2f0f8] text-[#858198]">
                  <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3 className="text-[13px] leading-5 font-medium text-[#272736]">{title}</h3>
                <p className="mt-1 text-[12px] leading-5 text-[#626982]">{description}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-4 flex items-start gap-2.5">
          <Info
            className="mt-0.5 h-4 w-4 shrink-0 text-[#9691ae]"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <p className="text-[12px] leading-5 text-[#626982]">
            Data may be linked to an email you provide.
            <a
              href="#"
              className="rounded text-[#6246ea] underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-[#6952ff] focus-visible:outline-none"
            >
              Privacy policy
            </a>
          </p>
        </div>

        <div className="mt-6">
          <label className="flex min-h-[50px] cursor-pointer items-center gap-3 rounded-xl border border-[#e5e2f0] px-3.5 py-3 text-left transition-colors hover:bg-[#fcfbfe]">
            <span className="relative flex h-[18px] w-[18px] shrink-0 items-center justify-center">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="peer h-full w-full cursor-pointer appearance-none rounded-[3px] border border-[#929199] bg-white checked:border-[#6952ff] checked:bg-[#6952ff] focus-visible:ring-2 focus-visible:ring-[#6952ff] focus-visible:ring-offset-2 focus-visible:outline-none"
                aria-describedby="consent-text"
              />
              <Check
                className="pointer-events-none absolute hidden h-3 w-3 text-white peer-checked:block"
                strokeWidth={3}
                aria-hidden="true"
              />
            </span>
            <span id="consent-text" className="text-[12px] leading-5 text-[#272736]">
              I consent to the collection and use described above.
            </span>
          </label>
          <button
            onClick={handleSubmit}
            disabled={!agreed}
            className="mt-3.5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#005BC4] px-4 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#004a9f] focus-visible:ring-2 focus-visible:ring-[#414df1] focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-[#efecf8] disabled:text-[#9a94b0]"
            aria-disabled={!agreed}
          >
            Consent
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ConsentScreen;
