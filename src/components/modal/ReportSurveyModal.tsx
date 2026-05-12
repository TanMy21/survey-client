import {
  MAX_DESCRIPTION_LENGTH,
  MAX_SCREENSHOT_SIZE,
  REASON_OPTIONS,
} from "@/constants/reportConstants";
import { useReportSurvey } from "@/hooks/useReportSurvey";
import type { ReportSurveyModalProps, SurveyReportReason } from "@/types/reportSurveyTypes";
import { X, Upload, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { type ChangeEvent, useEffect, useMemo, useState } from "react";

export const ReportSurveyModal = ({ open, shareID, onClose }: ReportSurveyModalProps) => {
  const [reason, setReason] = useState<SurveyReportReason | "">("");
  const [description, setDescription] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { mutateAsync: submitReport, isPending } = useReportSurvey();

  const descriptionTooLong = description.length > MAX_DESCRIPTION_LENGTH;

  const screenshotPreviewUrl = useMemo(() => {
    if (!screenshot) return "";

    // Preview URL for the selected screenshot.
    return URL.createObjectURL(screenshot);
  }, [screenshot]);

  // Cleans up the local preview URL
  useEffect(() => {
    return () => {
      if (screenshotPreviewUrl) {
        URL.revokeObjectURL(screenshotPreviewUrl);
      }
    };
  }, [screenshotPreviewUrl]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, isPending]);

  useEffect(() => {
    if (!open) return;

    setReason("");
    setDescription("");
    setScreenshot(null);
    setFileError("");
    setFormError("");
    setSubmitted(false);
  }, [open]);

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleScreenshotChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setFileError("");

    if (!file) {
      setScreenshot(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setScreenshot(null);
      setFileError("Only image files are allowed.");
      return;
    }

    if (file.size > MAX_SCREENSHOT_SIZE) {
      setScreenshot(null);
      setFileError("Screenshot must be 5MB or smaller.");
      return;
    }

    setScreenshot(file);
  };

  const handleRemoveScreenshot = () => {
    setScreenshot(null);
    setFileError("");
  };

  const handleSubmit = async () => {
    try {
      setFormError("");

      if (!reason) {
        setFormError("Please select a reason.");
        return;
      }

      if (descriptionTooLong) {
        setFormError("Details cannot exceed 1500 characters.");
        return;
      }

      await submitReport({
        shareID,
        reason,
        description,
        screenshot,
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting report: ", error);

      setFormError("Could not submit your report. Please try again.");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-sm"
      onMouseDown={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Report this survey"
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Report this survey</h2>
            {!submitted && (
              <p className="mt-1 text-sm leading-5 text-slate-500">
                Tell us if this survey seems unsafe, misleading, abusive, or inappropriate.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close report modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="px-5 py-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-950">
              Thanks — your report has been submitted.
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              We’ll review it and take action if needed.
            </p>

            <button
              type="button"
              onClick={handleClose}
              className="mt-6 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-5 px-5 py-5">
            <div>
              <p className="text-sm font-medium text-slate-800">What seems wrong?</p>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {REASON_OPTIONS.map((option) => {
                  const selected = reason === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setReason(option.value)}
                      className={[
                        "rounded-xl border px-3 py-2.5 text-left text-sm transition",
                        selected
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium text-slate-800">Details optional</label>
                <span className="text-xs text-slate-400">
                  {description.length}/{MAX_DESCRIPTION_LENGTH}
                </span>
              </div>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add any details that may help us review this."
                className="mt-2 min-h-24 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 transition outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

              {descriptionTooLong && (
                <p className="mt-1 text-xs text-red-500">Details cannot exceed 1500 characters.</p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-slate-800">Attach screenshot optional</p>
              <p className="mt-1 text-xs text-slate-500">PNG, JPG, or WEBP up to 5MB.</p>

              {!screenshot ? (
                <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center transition hover:border-blue-300 hover:bg-blue-50/50">
                  <Upload className="h-5 w-5 text-slate-400" />
                  <span className="mt-2 text-sm font-medium text-slate-700">Choose screenshot</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={handleScreenshotChange}
                  />
                </label>
              ) : (
                <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  {screenshotPreviewUrl && (
                    <img
                      src={screenshotPreviewUrl}
                      alt="Selected screenshot preview"
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{screenshot.name}</p>
                    <p className="text-xs text-slate-500">
                      {(screenshot.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveScreenshot}
                    className="rounded-full p-2 text-slate-400 transition hover:bg-white hover:text-red-500"
                    aria-label="Remove screenshot"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}

              {fileError && <p className="mt-1 text-xs text-red-500">{fileError}</p>}
            </div>

            <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-xs leading-5 text-slate-500">
              We won’t share your report details with the survey creator.
            </div>

            {formError && (
              <div className="flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!reason || isPending || descriptionTooLong}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isPending ? "Submitting…" : "Submit report"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
