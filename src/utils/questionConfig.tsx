import BinaryScreen from "@/components/screens/BinaryScreen";
import ConceptFitScreen from "@/components/screens/ConceptFitScreen";
import ConsentScreen from "@/components/screens/ConsentScreen";
import DropDownScreen from "@/components/screens/DropDownScreen";
import EmailContactScreen from "@/components/screens/EmailContactScreen";
import EndScreen from "@/components/screens/EndScreen";
import IATScreen from "@/components/screens/IATScreen";
import InfoScreen from "@/components/screens/InfoScreen";
import InstructionScreen from "@/components/screens/InstructionScreen";
import MediaScreen from "@/components/screens/MediaScreen";
import MultipleChoiceScreen from "@/components/screens/MultipleChoiceScreen";
import NumberScreen from "@/components/screens/NumberScreen";
import RangeScreen from "@/components/screens/RangeScreen";
import RankScreen from "@/components/screens/RankScreen";
import SingleChoiceScreen from "@/components/screens/SingleChoiceScreen";
import TextScreen from "@/components/screens/TextScreen";
import ThreeDModelScreen from "@/components/screens/ThreeDModelScreen";
import TimedScreen from "@/components/screens/TimedScreen";
import WelcomeScreen from "@/components/screens/WelcomeScreen";
import type { QuestionProps, QuestionType, QuestionTypeKey } from "@/types/questionTypes";

export const questionComponents: {
  [key in QuestionTypeKey]: React.ComponentType<QuestionProps>;
} = {
  BINARY: BinaryScreen,
  CONCEPT_FIT: ConceptFitScreen,
  CONSENT: ConsentScreen,
  DROPDOWN: DropDownScreen,
  EMAIL_CONTACT: EmailContactScreen,
  END_SCREEN: EndScreen,
  IAT: IATScreen,
  INSTRUCTIONS: InstructionScreen,
  INFO_SCREEN: InfoScreen,
  MEDIA: MediaScreen,
  MULTIPLE_CHOICE: MultipleChoiceScreen,
  NUMBER: NumberScreen,
  RADIO: SingleChoiceScreen,
  RANK: RankScreen,
  RANGE: RangeScreen,
  TEXT: TextScreen,
  THREE_D: ThreeDModelScreen,
  TIMED_CHOICE: TimedScreen,
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
  Concept: {
    type: "Concept",
    Screen: ConceptFitScreen,
  },
  Dropdown: {
    type: "Dropdown",
    Screen: DropDownScreen,
  },
  EmailContact: {
    type: "EmailContact",
    Screen: EmailContactScreen,
  },
  EndScreen: {
    type: "EndScreen",
    Screen: EndScreen,
  },
  IAT: {
    type: "IAT",
    Screen: IATScreen,
  },
  Instructions: {
    type: "Instructions",
    Screen: InstructionScreen,
  },
  Info_screen: {
    type: "Info_screen",
    Screen: InfoScreen,
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
  Timed: {
    type: "Timed",
    Screen: TimedScreen,
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
  "IAT",
  "DROPDOWN",
  "TIMED_CHOICE",
  "CONCEPT_FIT",
]);

export const NON_SKIP_ON_ADVANCE_TYPES = new Set([
  "WELCOME_SCREEN",
  "INSTRUCTIONS",
  "INFO_SCREEN",
  "EMAIL_CONTACT",
  "END_SCREEN",
  "CONSENT",
]);

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
