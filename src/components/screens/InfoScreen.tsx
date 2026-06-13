import { useSurveyFlow } from "@/context/useSurveyFlow";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { QuestionProps } from "@/types/questionTypes";
import DOMPurify from "dompurify";
import { useEffect, useMemo } from "react";
import ScreenRoot from "../layout/ScreenRoot";
import CenteredStack from "../layout/CenteredStack";

const InfoScreen = ({ question }: QuestionProps) => {
  const isMobile = useIsMobile();
  const { setCanProceed } = useSurveyFlow();

  const description = question?.description || "";

  /**
   * Info screen is read-only content.
   * It does not need an answer, so participant can continue.
   */
  useEffect(() => {
    setCanProceed(true);
  }, [setCanProceed]);

  const safeHTML = useMemo(() => {
    return DOMPurify.sanitize(description, {
      USE_PROFILES: { html: true },
      ADD_TAGS: ["img"],
      ADD_ATTR: [
        "style",
        "src",
        "alt",
        "title",
        "href",
        "target",
        "rel",
        "data-editor-image-id",
        "data-public-id",
      ],
    });
  }, [description]);

  return (
    <ScreenRoot>
      <CenteredStack>
        <div className="mt-6 flex w-full justify-center md:mt-8">
          <div className="w-[92%] max-w-[980px] rounded-[28px] px-5 py-6 md:w-[88%] md:px-10 md:py-8">
            <div
              className="participant-info-screen-content"
              dangerouslySetInnerHTML={{ __html: safeHTML }}
            />
          </div>
        </div>
      </CenteredStack>

      <style>{`
  .participant-info-screen-content {
    min-height: ${isMobile ? "220px" : "320px"};
    outline: none;
    color: #0F172A;
    font-size: ${isMobile ? "15px" : "16px"};
    line-height: 1.7;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  .participant-info-screen-content p {
    margin: 0 0 12px;
  }

  .participant-info-screen-content ul {
    list-style-type: disc;
    list-style-position: outside;
    padding-left: 1.6rem;
    margin: 0 0 14px;
  }

  .participant-info-screen-content ol {
    list-style-type: decimal;
    list-style-position: outside;
    padding-left: 1.6rem;
    margin: 0 0 14px;
  }

  .participant-info-screen-content li {
    display: list-item;
    margin-bottom: 8px;
    padding-left: 0.25rem;
  }

  .participant-info-screen-content li::marker {
    color: #0F172A;
    font-size: 0.9em;
  }

  .participant-info-screen-content li p {
    display: inline;
    margin: 0;
  }

  .participant-info-screen-content h1 {
    font-size: ${isMobile ? "26px" : "32px"};
    line-height: 1.2;
    margin: 0 0 16px;
    font-weight: 900;
  }

  .participant-info-screen-content h2 {
    font-size: ${isMobile ? "22px" : "26px"};
    line-height: 1.25;
    margin: 0 0 14px;
    font-weight: 900;
  }

  .participant-info-screen-content h3 {
    font-size: ${isMobile ? "18px" : "22px"};
    line-height: 1.3;
    margin: 0 0 12px;
    font-weight: 800;
  }

  .participant-info-screen-content blockquote {
    border-left: 4px solid #CBD5E1;
    margin: 12px 0;
    padding: 8px 12px;
    color: #475569;
    background-color: #F8FAFC;
    border-radius: 8px;
  }

  .participant-info-screen-content img {
    display: block;
    max-width: 100%;
    max-height: ${isMobile ? "240px" : "300px"};
    height: auto;
    border-radius: 16px;
    margin: 16px auto;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
  }

  .participant-info-screen-content strong {
    font-weight: 800;
  }

  .participant-info-screen-content a {
    color: #2563EB;
    text-decoration: underline;
    font-weight: 600;
  }
`}</style>
    </ScreenRoot>
  );
};

export default InfoScreen;
