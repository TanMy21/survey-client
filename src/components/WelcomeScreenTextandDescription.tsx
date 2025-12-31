import { useIsMobile } from "@/hooks/useIsMobile";
import type { QuestionTextandDescriptionProps } from "@/types/questionTypes";
import { htmlToPlainText } from "@/utils/utils";

export const WelcomeScreenTextandDescription = ({ question }: QuestionTextandDescriptionProps) => {
  const isMobile = useIsMobile();
  const { text, description, questionPreferences } = question || {};

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

  return (
    <div className="flex w-full origin-bottom flex-col">
      <div className={`mx-auto flex w-[92%] flex-col items-center justify-center md:w-[98%]`}>
        <div className="mx-auto flex w-full min-w-0 flex-col items-center justify-center gap-2 border-2 border-green-500 md:flex-row">
          <div className={`flex w-full min-w-0 flex-row items-center justify-center`}>
            <p
              className={`w-full max-w-none text-center leading-[1.4] font-normal break-normal whitespace-normal`}
              style={{
                fontSize: `${actualTitleFontSize}px`,
                color: titleFontColor || "black",
                fontFamily:
                  "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                letterSpacing: "0.01em",
                wordSpacing: "0.05em",
                // hyphens: "auto",
              }}
            >
              {htmlToPlainText(text)}
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
