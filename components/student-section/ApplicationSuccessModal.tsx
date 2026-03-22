"use client";

import { useRouter } from "next/navigation";

interface ApplicationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  company: string;
  interviewRequired: boolean;
  applicationId: string;
  jobId: string;
  jobSkills: string[];
}

export default function ApplicationSuccessModal({
  isOpen,
  onClose,
  jobTitle,
  company,
  interviewRequired,
  applicationId,
  jobId,
  jobSkills,
}: ApplicationSuccessModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleStartInterview = () => {
    // Pass job context and application ID to AI interview page via URL params
    const params = new URLSearchParams({
      jobId,
      applicationId,
      jobTitle,
      company,
      jobSkills: JSON.stringify(jobSkills),
      required: interviewRequired.toString(),
    });
    router.push(`/students/aiInterview?${params.toString()}`);
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-2xl border border-slate-700">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-2 text-center text-2xl font-bold text-white">
          Application Submitted!
        </h2>

        {/* Job Info */}
        <p className="mb-6 text-center text-slate-300">
          Your application for{" "}
          <span className="font-semibold text-white">{jobTitle}</span> at{" "}
          <span className="font-semibold text-white">{company}</span> has been
          submitted successfully.
        </p>

        {/* Interview Section */}
        {interviewRequired ? (
          <div className="mb-6 rounded-lg bg-amber-500/10 border border-amber-500/30 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20">
                <svg
                  className="h-4 w-4 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-sm font-semibold text-amber-300">
                  Interview Required
                </h3>
                <p className="text-xs text-amber-200/80">
                  This position requires an AI interview to complete your
                  application. You&apos;ll be asked questions tailored to the
                  job requirements.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 rounded-lg bg-blue-500/10 border border-blue-500/30 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20">
                <svg
                  className="h-4 w-4 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-sm font-semibold text-blue-300">
                  Stand Out with an Interview
                </h3>
                <p className="text-xs text-blue-200/80">
                  While not required, completing an AI interview can strengthen
                  your application and showcase your skills.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          {!interviewRequired && (
            <button
              onClick={handleSkip}
              className="flex-1 rounded-lg border border-slate-600 px-4 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-slate-700/50"
            >
              Skip for Now
            </button>
          )}
          <button
            onClick={handleStartInterview}
            className={`${
              interviewRequired ? "flex-1" : "flex-1"
            } rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-teal-500/50 hover:scale-[1.02]`}
          >
            {interviewRequired ? "Start Interview" : "Take Optional Interview"}
          </button>
        </div>

        {/* Close button */}
        {!interviewRequired && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 transition-colors hover:text-white"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
