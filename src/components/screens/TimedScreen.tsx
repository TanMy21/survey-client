import type { QuestionProps } from "@/types/questionTypes";
import ScreenRoot from "../layout/ScreenRoot";
import CenteredStack from "../layout/CenteredStack";
import QuestionTextandDescription from "../QuestionTextandDescription";
import { ResponseContainer } from "../layout/ResponseContainer";
import { TimedChoiceCountdown } from "../screen-components/TimedChoiceCountdown";
import { DEFAULT_TIMED_CHOICE_MS } from "@/constants/screenConstants";
import TimedChoiceResponse from "../QuestionResponse/TImedChoiceResponse";

const TimedScreen = ({ surveyID, question }: QuestionProps) => {
  const timeLimitMs =
    typeof question?.questionPreferences?.uiConfig?.timeLimitMs === "number"
      ? question.questionPreferences.uiConfig.timeLimitMs
      : DEFAULT_TIMED_CHOICE_MS;

  return (
    <ScreenRoot>
      <div className="mt-4 flex w-full justify-end px-6 md:mt-6 md:px-10">
        <TimedChoiceCountdown timeLimitMs={timeLimitMs} />
      </div>

      <CenteredStack>
        <QuestionTextandDescription surveyID={surveyID} question={question} />
      </CenteredStack>

      <ResponseContainer>
        <TimedChoiceResponse question={question!} surveyID={surveyID!} />
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default TimedScreen;
