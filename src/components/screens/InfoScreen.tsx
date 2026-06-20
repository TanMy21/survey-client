import { useSurveyFlow } from "@/context/useSurveyFlow";
import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import type { QuestionProps } from "@/types/questionTypes";
import "@/styles/rich-text.css";
import { useEffect, useMemo } from "react";
import ScreenRoot from "../layout/ScreenRoot";
import CenteredStack from "../layout/CenteredStack";
import { sanitizeRichTextHtml } from "@/utils/utils";

const InfoScreen = ({ question }: QuestionProps) => {
  const { setCanProceed } = useSurveyFlow();
  const { goNext } = useFlowRuntime();

  const description = question?.description || "";

  useEffect(() => {
    setCanProceed(true);
  }, [setCanProceed]);

  useEffect(() => {
    const handleSpaceNext = (event: KeyboardEvent) => {
      const isSpace = event.code === "Space" || event.key === " " || event.key === "Spacebar";

      if (!isSpace || event.repeat) return;

      event.preventDefault();
      event.stopPropagation();

      goNext();
    };

    window.addEventListener("keydown", handleSpaceNext, true);

    return () => {
      window.removeEventListener("keydown", handleSpaceNext, true);
    };
  }, [goNext]);

  const safeHTML = useMemo(() => sanitizeRichTextHtml(description), [description]);
  return (
    <ScreenRoot>
      <CenteredStack>
        <div className="mt-6 flex w-full justify-center md:mt-8">
          <div className="w-[92%] max-w-[980px] rounded-[28px] px-5 py-6 md:w-[88%] md:px-10 md:py-8">
            <div
              className="participant-rich-text-content"
              dangerouslySetInnerHTML={{ __html: safeHTML }}
            />
          </div>
        </div>
      </CenteredStack>
    </ScreenRoot>
  );
};

export default InfoScreen;
