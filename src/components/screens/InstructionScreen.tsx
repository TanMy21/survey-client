import { useSurveyFlow } from "@/context/useSurveyFlow";
import type { QuestionProps } from "@/types/questionTypes";
import CenteredStack from "../layout/CenteredStack";
import "@/styles/rich-text.css";
import ScreenRoot from "../layout/ScreenRoot";
import { useEffect, useMemo } from "react";
import { sanitizeRichTextHtml } from "@/utils/utils";

const InstructionScreen = ({ question }: QuestionProps) => {
  const { setCanProceed } = useSurveyFlow();

  const description = question?.description || "";

  useEffect(() => {
    setCanProceed(true);
  }, [setCanProceed]);

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

export default InstructionScreen;
