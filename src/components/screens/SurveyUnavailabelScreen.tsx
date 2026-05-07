import type { SurveyUnavailableScreenProps } from "@/types/surveyTypes";
import { AlertCircle, Clock3, FileQuestion, LockKeyhole, TimerOff } from "lucide-react";

export const SurveyUnavailableScreen = ({ variant }: SurveyUnavailableScreenProps) => {
  const content = {
    "not-found": {
      icon: FileQuestion,
      title: "Survey not found",
      description: "This link may be incorrect, deleted, or no longer available.",
      hint: "Please contact the person who shared this link if you think this is a mistake.",
    },
    expired: {
      icon: TimerOff,
      title: "Survey closed",
      description: "This survey is no longer accepting responses.",
      hint: "Please contact the survey owner if you need access.",
    },
    "not-started": {
      icon: Clock3,
      title: "Survey not open yet",
      description: "This survey is scheduled to open later.",
      hint: "Please check the link again later.",
    },
    unavailable: {
      icon: LockKeyhole,
      title: "Survey unavailable",
      description: "This survey is not currently accepting responses.",
      hint: "Please contact the person who shared this link if you think this is a mistake.",
    },
    error: {
      icon: AlertCircle,
      title: "Unable to load survey",
      description: "Something went wrong while loading this survey.",
      hint: "Please refresh the page or try again later.",
    },
  }[variant];

  const Icon = content.icon;

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white px-5 text-center">
      <div className="flex max-w-md flex-col items-center">
        {/* Icon  */}
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-700">
          <Icon size={36} strokeWidth={1.8} />
        </div>

        {/* Title */}
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
          {content.title}
        </h1>

        {/* Description */}
        <p className="mt-3 text-base leading-6 text-gray-500 sm:text-lg">{content.description}</p>

        {/* Subtle hint */}
        <p className="mt-4 text-sm leading-5 text-gray-400 sm:text-sm">{content.hint}</p>
      </div>
    </div>
  );
};
