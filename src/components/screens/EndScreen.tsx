import { useBehavior } from "@/context/BehaviorTrackerContext";
import type { QuestionProps } from "@/types/questionTypes";
import { motion } from "motion/react";
import QuestionTextandDescription from "../QuestionTextandDescription";
import ScreenRoot from "../layout/ScreenRoot";
import CenteredStack from "../layout/CenteredStack";
import { PositionedBlock } from "../layout/PositionedBlock";
import { ResponseContainer } from "../layout/ResponseContainer";

const EndScreen = ({ surveyID, question }: QuestionProps) => {
  const { handleClick, markSubmission, collectBehaviorData } = useBehavior();

  const handleClickEnd = () => {
    handleClick();
    markSubmission();
    const data = collectBehaviorData();
    console.log("📦 EndScreen behavior data:", data);
  };

  return (
    <ScreenRoot>
      <CenteredStack>
        <PositionedBlock>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center text-6xl font-bold text-[#005BC4] sm:text-2xl"
          >
            <QuestionTextandDescription surveyID={surveyID} question={question} />
          </motion.div>
        </PositionedBlock>
        <ResponseContainer>
          <a
            href={import.meta.env.VITE_APP_URL}
            onClick={handleClickEnd}
            className="flex items-center justify-center rounded-4xl bg-[#005BC4] px-3 py-2 text-base font-bold text-white transition duration-200 hover:bg-[#004a9f] md:px-6 md:py-4"
          >
            Create with Feedflo
          </a>
        </ResponseContainer>
      </CenteredStack>
    </ScreenRoot>
  );
};

export default EndScreen;
