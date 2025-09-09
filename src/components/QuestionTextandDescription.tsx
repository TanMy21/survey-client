import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { QuestionTextandDescriptionProps } from "@/types/questionTypes";
import QuestionNumberCircle from "./QuestionNumberCircle";
import QuestionNumberChip from "./QuestionNumberChip";

const QuestionTextandDescription = ({ question }: QuestionTextandDescriptionProps) => {
  const isMobile = useIsMobile();
  const { currentDisplayIndex } = useFlowRuntime();

  const { text, description, questionPreferences, type } = question || {};

  const {
    titleFontSizeMobile,
    titleFontSize = 36,
    titleFontColor,
    descriptionFontColor,
    descriptionFontSize,
    descriptionFontSizeMobile,
  } = questionPreferences || {};

  const actualTitleFontSize = isMobile ? titleFontSizeMobile : titleFontSize;
  const actualDescriptionFontSize = isMobile ? descriptionFontSizeMobile : descriptionFontSize;

  const orderFontSize = titleFontSize * 0.5;
  const circleSize = orderFontSize * 1.6;

  const nonOrderableTypes = ["WELCOME_SCREEN", "INSTRUCTIONS", "EMAIL_CONTACT", "END_SCREEN"];
  const isNonOrderableType = nonOrderableTypes.includes(type!);

  return (
    <div className="flex w-full origin-bottom flex-col">
      <div className="mx-auto flex w-[92%] flex-col items-end justify-center md:w-[98%]">
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-2 md:flex-row">
          {!isNonOrderableType &&
            currentDisplayIndex !== null &&
            (isMobile ? (
              <QuestionNumberChip currentDisplayIndex={currentDisplayIndex} />
            ) : (
              <QuestionNumberCircle
                circleSize={circleSize}
                orderFontSize={orderFontSize}
                currentDisplayIndex={currentDisplayIndex}
              />
            ))}

          <div className="flex flex-row items-center justify-start">
            <p
              className="w-full max-w-[80ch] text-start leading-[1.4] font-normal break-words whitespace-normal"
              style={{
                fontSize: `${actualTitleFontSize}px`,
                color: titleFontColor || "black",
                fontFamily:
                  "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                letterSpacing: "0.01em",
                wordSpacing: "0.05em",
                hyphens: "auto",
              }}
            >
              {text}
            </p>
          </div>
        </div>

        <div className="my-[8%] flex w-full flex-row items-center justify-center md:my-[1%]">
          <div>
            <p
              className="w-fit whitespace-normal italic"
              style={{
                fontSize: `${actualDescriptionFontSize}px`,
                color: descriptionFontColor,
                fontFamily:
                  "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
              }}
            >
              {description === "Description (optional)" ? null : description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionTextandDescription;
