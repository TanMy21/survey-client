import { useFlowRuntime } from "@/context/FlowRuntimeProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { QuestionTextandDescriptionProps } from "@/types/questionTypes";
import QuestionNumberCircle from "./QuestionNumberCircle";
import QuestionNumberChip from "./QuestionNumberChip";
import { htmlToPlainText } from "@/utils/utils";

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
  const isEmailContact = type === "EMAIL_CONTACT";

  return (
    <div className="flex w-full min-w-0 flex-col">
      <div
        className={`flex w-full min-w-0 ${
          isMobile ? "flex-col items-start gap-[14px]" : "flex-row items-start gap-3"
        }`}
      >
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

        <div className="min-w-0 flex-1">
          <p
            className={`w-full max-w-[80ch] leading-[1.4] font-normal break-words ${isNonOrderableType ? "whitespace-normal" : "text-start whitespace-normal"}`}
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
            {htmlToPlainText(text)}
          </p>

          {description && description !== "Description (optional)" && (
            <div
              className={`my-[8%] flex w-full flex-row items-center md:my-[1%] ${
                isEmailContact ? "justify-start" : "justify-center"
              }`}
            >
              <div>
                <p
                  className="w-fit whitespace-normal italic"
                  style={{
                    fontSize: `${actualDescriptionFontSize}px`,
                    color: descriptionFontColor || "black",
                    textAlign: isEmailContact ? "left" : "center",
                    fontFamily:
                      "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                  }}
                >
                  {htmlToPlainText(description)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionTextandDescription;
