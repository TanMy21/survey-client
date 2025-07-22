import BinaryScreen from "@/components/screens/BinaryScreen";
import EmailContactScreen from "@/components/screens/EmailContactScreen";
import EndScreen from "@/components/screens/EndScreen";
import InstructionScreen from "@/components/screens/InstructionScreen";
import MediaScreen from "@/components/screens/MediaScreen";
import MultipleChoiceScreen from "@/components/screens/MultipleChoiceScreen";
import NumberScreen from "@/components/screens/NumberScreen";
import RangeScreen from "@/components/screens/RangeScreen";
import RankScreen from "@/components/screens/RankScreen";
import SingleChoiceScreen from "@/components/screens/SingleChoiceScreen";
import TextScreen from "@/components/screens/TextScreen";
import WelcomeScreen from "@/components/screens/WelcomeScreen";
import type { QuestionProps, QuestionType, QuestionTypeKey } from "@/types/question";

export const questionComponents: {
  [key in QuestionTypeKey]: React.ComponentType<QuestionProps>;
} = {
  BINARY: BinaryScreen,
  EMAIL_CONTACT: EmailContactScreen,
  END_SCREEN: EndScreen,
  INSTRUCTIONS: InstructionScreen,
  MEDIA: MediaScreen,
  MULTIPLE_CHOICE: MultipleChoiceScreen,
  NUMBER: NumberScreen,
  RADIO: SingleChoiceScreen,
  RANK: RankScreen,
  RANGE: RangeScreen,
  TEXT: TextScreen,
  WELCOME_SCREEN: WelcomeScreen,
};

export const questionTypes: { [key: string]: QuestionType } = {
  Binary: {
    type: "Binary",
    Screen: BinaryScreen,
  },
  Checkbox: {
    type: "Checkbox",
    Screen: MultipleChoiceScreen,
  },
  Choice: {
    type: "Choice",
    Screen: SingleChoiceScreen,
  },
  EmailContact: {
    type: "EmailContact",
    Screen: EmailContactScreen,
  },
  EndScreen: {
    type: "EndScreen",
    Screen: EndScreen,
  },
  Instructions: {
    type: "Instructions",
    Screen: InstructionScreen,
  },
  Media: {
    type: "Media",
    Screen: MediaScreen,
  },
  Number: {
    type: "Number",
    Screen: NumberScreen,
  },
  Rank: {
    type: "Rank",
    Screen: RankScreen,
  },
  Scale: {
    type: "Scale",
    Screen: RangeScreen,
  },
  Text: {
    type: "Text",
    Screen: TextScreen,
  },
  WelcomeScreen: {
    type: "WelcomeScreen",
    Screen: WelcomeScreen,
  },
};
