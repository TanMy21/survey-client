import { useState } from "react";

import type { QuestionProps } from "@/types/questionTypes";
import CenteredStack from "../layout/CenteredStack";
import { ResponseContainer } from "../layout/ResponseContainer";
import ScreenRoot from "../layout/ScreenRoot";
import QuestionTextandDescription from "../QuestionTextandDescription";
import { DEFAULT_CONCEPT_FIT_MS } from "@/constants/screenConstants";
import ConceptFitCountdown from "../screen-components/ConceptFitCountdown";
import ConceptFitResponse from "../QuestionResponse/ConceptFitResponse";

const ConceptFitScreen = ({ surveyID, question }: QuestionProps) => {
  const [timerResetKey, setTimerResetKey] = useState(0);
  const timeLimitMs =
    typeof question?.questionPreferences?.uiConfig?.timeLimitMs === "number"
      ? question.questionPreferences.uiConfig.timeLimitMs
      : DEFAULT_CONCEPT_FIT_MS;

  return (
    <ScreenRoot>
      <div className="mt-4 flex w-full justify-end px-6 md:mt-6 md:px-10">
        <ConceptFitCountdown timeLimitMs={timeLimitMs}  resetKey={timerResetKey}/>
      </div>

      <CenteredStack>
        <QuestionTextandDescription surveyID={surveyID} question={question} />
      </CenteredStack>

      <ResponseContainer>
        <ConceptFitResponse question={question!} surveyID={surveyID!}  onResetTimer={() => setTimerResetKey((prev) => prev + 1)}/>
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default ConceptFitScreen;
