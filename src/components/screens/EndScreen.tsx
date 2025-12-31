import { useBehavior } from "@/context/BehaviorTrackerContext";
import type { QuestionProps } from "@/types/questionTypes";
import { AnimatePresence, motion } from "motion/react";
import QuestionTextandDescription from "../QuestionTextandDescription";
import ScreenRoot from "../layout/ScreenRoot";
import CenteredStack from "../layout/CenteredStack";
import { ResponseContainer } from "../layout/ResponseContainer";
import { SuccessCheckmark } from "../motion/SuccessCheckmark";

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
      <CenteredStack className="justify-center">
        <div className="flex flex-col items-center gap-8">
          <AnimatePresence mode="wait">
            <motion.div
              key="notification-container"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="flex flex-col items-center"
            >
              <SuccessCheckmark size={100} />
            </motion.div>
          </AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
            className="text-center text-6xl font-bold text-[#005BC4] sm:text-2xl"
          >
            <QuestionTextandDescription surveyID={surveyID} question={question} />
          </motion.div>
        </div>
      </CenteredStack>
      <ResponseContainer>
        <a
          href={import.meta.env.VITE_APP_URL}
          onClick={handleClickEnd}
          className="flex items-center justify-center rounded-4xl bg-[#005BC4] px-3 py-2 text-base font-bold text-white transition duration-200 hover:bg-[#004a9f] md:px-6 md:py-4"
        >
          Create with Feedflo
        </a>
      </ResponseContainer>
    </ScreenRoot>
  );
};

export default EndScreen;
