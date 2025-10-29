import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { OptionType } from "./optionTypes";

export interface InputErrorProps {
  error?: string | null;
  className?: string;
}

export interface BacktrackLoggerProps {
  questionID: string;
  visitedRef: React.RefObject<string[]>;
}

type MeshEventHandler = (name: string, e: ThreeEvent<PointerEvent>) => void;

export type Model3DParams = {
  readonly src: string;
  readonly onReady?: (root: THREE.Object3D) => void;
  onMeshOver?: MeshEventHandler;
  onMeshOut?: MeshEventHandler;
  onMeshClick?: MeshEventHandler;
  onFit?: () => void;
};

export type QuestionTypeKey =
  | "BINARY"
  | "CONSENT"
  | "EMAIL_CONTACT"
  | "END_SCREEN"
  | "INSTRUCTIONS"
  | "MEDIA"
  | "NUMBER"
  | "RADIO"
  | "RANK"
  | "RANGE"
  | "TEXT"
  | "THREE_D"
  | "MULTIPLE_CHOICE"
  | "WELCOME_SCREEN";

export interface QuestionProps {
  surveyID?: string;
  qOptions?: OptionType[];
  question?: Question;
  currentIndex?: number;
  setCurrentQuestionIndex?: React.Dispatch<React.SetStateAction<number>>;
  preloadWindow?: number;
}

export type Model3D = {
  model3DID: string;
  relatedQuestionID: string;
  name: string;
  fileUrl: string;
  posterUrl: string;
  public_id: string;
  format: string;
  sizeBytes: number;
  polycount: number;
  materialCount: number;
  width: number;
  height: number;
  depth: number;
  draco: boolean;
  ktx2: boolean;
  showQuestion: boolean;
};

export interface Question {
  questionID: string;
  relatedSurveyId: string;
  creatorId: string;
  text: string;
  description?: string;
  type: QuestionTypeKey;
  order?: number;
  minOptions: number;
  maxOptions: number;
  options: OptionType[];
  Model3D: Model3D;
  questionImage?: boolean;
  questionImageUrl?: string;
  questionImageAltTxt?: string;
  questionImagePublicId?: string;
  questionImageWidth?: number;
  questionImageHeight?: number;
  questionPreferences: QuestionPreferences;
  required: boolean;
}

export interface QuestionPreferences {
  preferencesID: string;
  relatedQuestionID: string;
  titleFontSize: number;
  titleFontSizeMobile: number;
  titleFontColor: string;
  descriptionFontSize: number;
  descriptionFontSizeMobile: number;
  descriptionFontColor: string;
  questionImageTemplate: boolean;
  questionImageTemplateUrl: string;
  questionImageTemplatePublicId: string;
  questionBackgroundColor: string;
  required: boolean;
  uiConfig: Record<string, any>;
}

export interface QuestionType {
  questionID?: string;
  type: string;
  order?: number;
  Screen?: React.ComponentType<QuestionProps>;
}

export interface QuestionTextandDescriptionProps {
  surveyID?: string;
  question?: Question;
}

export interface QuestionImageContainerProps {
  questionImageWidth?: number;
  questionImageHeight?: number;
  questionImageUrl?: string;
  questionImageAltText?: string;
  questionImage?: boolean;
}

export interface QuestionNumberProps {
  currentDisplayIndex: number;
  circleSize?: number;
  orderFontSize?: number;
}

export interface MultipleChoiceFormData {
  selectedChoices: {
    [key: string]: boolean;
  };
}

export interface SlideMotionProps {
  children: React.ReactNode;
  direction: "left" | "right";
  keyProp: string | number;
}

export type GetPulseTargets = () => Array<HTMLElement | null>;
export type ViewName = "front" | "back" | "left" | "right" | "top" | "bottom";

export interface UseAutoSubmitPulseOptions {
  active: boolean;
  delayMs: number;
  feedbackMs?: number;
  onSubmit: () => void;
  getPulseTargets: GetPulseTargets;
  vibrate?: boolean;
}
export interface SetInitialViewParams {
  camera: THREE.PerspectiveCamera;
  controls: any;
  object: THREE.Object3D;
  view?: ViewName;
  fov?: number;
  aspect?: number;
  padding?: number;
  frontIsNegZ?: boolean;
}

export interface InitialViewParams {
  object: THREE.Object3D | null;
  initialView: ViewName;
  frontIsNegZ: boolean;
  controlsRef: React.RefObject<any>;
}

export interface Interactive3DModelViewerProps {
  src: string;
  questionID?: string;
  hdrEnvUrl?: string;
  height?: number;
  background?: string;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  minDistance?: number;
  maxDistance?: number;
  maxPolarAngle?: number;
  initialView?: ViewName;
  frontIsNegZ?: boolean;
  exposure?: number;
  envIntensity?: number;
  ambientIntensity?: number;
  hemiIntensity?: number;
  envResolution?: 256 | 512;
  onAttachControls?: (c: any) => void;
  onMeshOver?: (name: string, e?: ThreeEvent<PointerEvent>) => void;
  onMeshOut?: (name: string, e?: ThreeEvent<PointerEvent>) => void;
  onMeshClick?: (name: string, e?: ThreeEvent<PointerEvent>) => void;
  onFit?: () => void;
}

export interface CachedModelProps {
  url: string;
  onReady?: (obj: THREE.Object3D) => void;
  onPointerOver?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut?: (e: ThreeEvent<PointerEvent>) => void;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  onFit?: () => void;
}

export type Question3Dish = {
  Model3D?: {
    fileUrl?: string | null;
  } | null;
};
