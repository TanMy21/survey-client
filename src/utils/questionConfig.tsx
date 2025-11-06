import BinaryScreen from "@/components/screens/BinaryScreen";
import ConsentScreen from "@/components/screens/ConsentScreen";
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
import ThreeDModelScreen from "@/components/screens/ThreeDModelScreen";
import WelcomeScreen from "@/components/screens/WelcomeScreen";
import type { QuestionProps, QuestionType, QuestionTypeKey } from "@/types/questionTypes";

export const questionComponents: {
  [key in QuestionTypeKey]: React.ComponentType<QuestionProps>;
} = {
  BINARY: BinaryScreen,
  CONSENT: ConsentScreen,
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
  THREE_D: ThreeDModelScreen,
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
  Consent: {
    type: "Consent",
    Screen: ConsentScreen,
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
  Three_D: {
    type: "Three_D",
    Screen: ThreeDModelScreen,
  },
  WelcomeScreen: {
    type: "WelcomeScreen",
    Screen: WelcomeScreen,
  },
};


export const SKIPPABLE_TYPES = new Set([
  "BINARY",
  "MEDIA",
  "MULTIPLE_CHOICE",
  "TEXT",
  "NUMBER",
  "RANGE",
  "RANK",
  "THREE_D",
  "RADIO",
]);

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;