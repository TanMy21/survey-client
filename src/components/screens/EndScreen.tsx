import type { QuestionProps } from "@/types/question";
import QuestionTextandDescription from "../QuestionTextandDescription";
import { motion } from "motion/react";
import { useBehavior } from "@/context/BehaviorTrackerContext";

const EndScreen = ({ surveyID, question }: QuestionProps) => {
  const { handleClick, markSubmission, collectBehaviorData } = useBehavior();

  const handleClickEnd = () => {
    handleClick();
    markSubmission();
    const data = collectBehaviorData();
    console.log("📦 EndScreen behavior data:", data);
  };

  return (
    <div className="border-black-500 relative z-20 mx-auto flex min-h-[700px] w-[98%] flex-col border-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="text-center text-2xl font-bold text-[#005BC4]"
      >
        <div className="absolute bottom-[56%] z-2 my-[8%] mb-5 flex w-full flex-row items-end justify-center border-2 border-red-500 xl:bottom-[50%]">
          <QuestionTextandDescription surveyID={surveyID} question={question} />
        </div>
      </motion.div>
      <div className="absolute top-[44%] mx-auto flex h-[60%] w-full flex-col items-center justify-start border-2 border-red-500 xl:top-[50%]">
        <a
          href={import.meta.env.VITE_APP_URL}
          onClick={handleClickEnd}
          className="flex items-center justify-center rounded-4xl bg-[#005BC4] px-3 py-2 text-base font-bold text-white transition duration-200 hover:bg-[#004a9f] md:px-6 md:py-4"
        >
          Create with Feedflo
        </a>
      </div>
    </div>
  );
};

export default EndScreen;
