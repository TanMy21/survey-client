import SurveyScreenLayout from "@/components/SurveyScreenLayout";
import { FlowRuntimeProvider } from "@/context/FlowRuntimeProvider";
import type { Question, QuestionPreferences } from "@/types/questionTypes";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

function mockQuestionPreferences(questionID: string): QuestionPreferences {
  return {
    preferencesID: "pref-" + questionID,
    relatedQuestionID: questionID,

    // Text sizes
    titleFontSize: 16,
    titleFontSizeMobile: 16,
    descriptionFontSize: 14,
    descriptionFontSizeMobile: 14,

    // Colors
    titleFontColor: "#000000",
    descriptionFontColor: "#444444",
    questionBackgroundColor: "#FFFFFF",

    // Image template fields
    questionImageTemplate: false,
    questionImageTemplateUrl: "",
    questionImageTemplatePublicId: "",

    // Required
    required: false,

    // UI config
    uiConfig: {},
  };
}

function mockQuestion(overrides: Partial<Question> = {}): Question {
  const id = overrides.questionID ?? "q-" + Math.random();

  return {
    questionID: id,
    relatedSurveyId: "survey-1",
    creatorId: "creator-1",

    text: "",
    description: "",

    type: "TEXT",
    order: 1,

    minOptions: 0,
    maxOptions: 0,
    required: false,

    // Options needed by your interface
    options: [],

    // Your Model3D structure (mock minimal)
    Model3D: {
      modelID: "model-" + id,
      questionID: id,
      url: "",
      publicId: "",
      fileName: "",
    } as any,

    questionImage: false,
    questionImageUrl: "",
    questionImageAltTxt: "",
    questionImagePublicId: "",
    questionImageWidth: 0,
    questionImageHeight: 0,

    questionPreferences: mockQuestionPreferences(id),

    ...overrides,
  };
}

const baseSurvey = {
  shareID: "abc123",
  FlowCondition: [],
  questions: [
    mockQuestion({
      questionID: "welcome",
      type: "WELCOME_SCREEN",
      order: 1,
    }),
    mockQuestion({
      questionID: "q1",
      type: "TEXT",
      order: 2,
    }),
  ],
};

describe("Consent screen flow", () => {
  it("never skips the consent screen after welcome", async () => {
    const user = userEvent.setup();

    render(
      <FlowRuntimeProvider payload={baseSurvey}>
        <SurveyScreenLayout surveyID="test" shareID="abc123" />
      </FlowRuntimeProvider>
    );

    expect(await screen.findByText(/We Respect Your Privacy/i)).not.toBeInTheDocument();
    expect(await screen.findByText(/Welcome/i)).toBeInTheDocument();

    const nextBtn = screen.getByRole("button");
    await user.click(nextBtn);

    expect(await screen.findByText(/We Respect Your Privacy/i)).toBeInTheDocument();
  });
});
