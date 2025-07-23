import { useIsMobile } from "@/hooks/useIsMobile";
import type { QuestionTextandDescriptionProps } from "@/types/question";

const QuestionTextandDescription = ({ question }: QuestionTextandDescriptionProps) => {
  const isMobile = useIsMobile();

  const { text, order, description, questionPreferences, type } = question || {};

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

  const orderFontSize = titleFontSize * 0.6;
  const circleSize = orderFontSize * 1.6;

  const nonOrderableTypes = ["WELCOME_SCREEN", "INSTRUCTIONS", "EMAIL_CONTACT", "END_SCREEN"];
  const isNonOrderableType = nonOrderableTypes.includes(type!);

  return (
    <div className="origin-bottom flex flex-col w-full">
      <div className="flex flex-col justify-center items-end mx-auto w-[92%] md:w-[98%]">
        <div className="flex flex-row justify-center items-center mx-auto w-full">
          {!isNonOrderableType && (
            <div
              className="flex justify-center items-center rounded-full mr-2"
              style={{
                width: `${circleSize}px`,
                height: `${circleSize}px`,
                backgroundColor: "#0074EB",
              }}
            >
              <p className="font-bold text-white" style={{ fontSize: orderFontSize || 20 }}>
                {order}
              </p>
            </div>
          )}

          <div className="flex flex-row justify-center items-center">
            <p
              className="whitespace-normal w-full max-w-[80ch] font-normal text-start leading-[1.4] break-words"
              style={{
                fontSize: `${actualTitleFontSize}px`,
                color: titleFontColor,
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

        <div className="flex flex-row justify-center items-center w-full my-[8%] md:my-[1%]">
          <div>
            <p
              className="whitespace-normal w-fit italic"
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
