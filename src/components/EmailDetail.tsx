import { useState } from "react";
import type { Email } from "../types/email";
import ApprovalActions from "./ApprovalActions";

type EmailDetailProps = {
  email: Email;
  onBack: () => void;
  onPrevious: () => void;
  onNext: () => void;
  currentPosition: number;
  totalEmails: number;
  onApprove: () => void;
  onReject: () => void;
  onEscalate: () => void;
  onRetry: (guidance: string) => void;
  onSaveDraft: (draft: string) => void;
};

function EmailDetail({
  email,
  onBack,
  onPrevious,
  onNext,
  currentPosition,
  totalEmails,
  onApprove,
  onReject,
  onEscalate,
  onRetry,
  onSaveDraft,
}: EmailDetailProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [draftResponse, setDraftResponse] = useState(
    email.draftResponse
  );

  const hasUnsavedChanges =
    draftResponse !== email.draftResponse;

  const [navigationAction, setNavigationAction] = useState<
    "back" | "previous" | "next" | null
  >(null);

  const handleNavigation = (
    action: "back" | "previous" | "next"
  ) => {
    if (hasUnsavedChanges) {
      setNavigationAction(action);
      return;
    }

    if (action === "back") onBack();
    if (action === "previous") onPrevious();
    if (action === "next") onNext();
  };

  const priorityStyles = {
    critical:
      "bg-red-500/10 text-red-400 border-red-500/20",
    urgent:
      "bg-amber-500/10 text-amber-400 border-amber-500/20",
    normal:
      "bg-zinc-800 text-zinc-300 border-zinc-700",
    low:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  const priorityClass =
    priorityStyles[
      email.priority as keyof typeof priorityStyles
    ] ?? priorityStyles.normal;

  const statusStyles = {
    pending_review:
      "bg-amber-500/10 text-amber-400 border-amber-500/20",
    approved:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rejected:
      "bg-red-500/10 text-red-400 border-red-500/20",
    escalated:
      "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };

  const statusLabels = {
    pending_review: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",
    escalated: "Escalated",
  };

  const statusClass =
    statusStyles[
      email.status as keyof typeof statusStyles
    ] ?? "bg-zinc-800 text-zinc-300 border-zinc-700";

  const statusLabel =
    statusLabels[
      email.status as keyof typeof statusLabels
    ] ?? email.status;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Back */}
      <button
        type="button"
        onClick={() => handleNavigation("back")}
        className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-300 shadow-lg shadow-black/10 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
      >
        <span aria-hidden="true">←</span>
        Back to queue
      </button>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-3 shadow-lg shadow-black/10">
        <button
          type="button"
          onClick={() => handleNavigation("previous")}
          disabled={currentPosition === 1}
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-30 sm:px-4"
        >
          ← <span className="hidden sm:inline">Previous</span>
        </button>

        <span className="text-xs font-medium text-zinc-500 sm:text-sm">
          Email{" "}
          <span className="text-zinc-200">
            {currentPosition}
          </span>{" "}
          of{" "}
          <span className="text-zinc-200">
            {totalEmails}
          </span>
        </span>

        <button
          type="button"
          onClick={() => handleNavigation("next")}
          disabled={currentPosition === totalEmails}
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-30 sm:px-4"
        >
          <span className="hidden sm:inline">Next </span>→
        </button>
      </div>

      {/* Email Header */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/10 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-3 h-1 w-10 rounded-full bg-violet-500" />

            <h1 className="text-xl font-bold leading-7 text-zinc-50 sm:text-2xl">
              {email.subject}
            </h1>

            <p className="mt-2 break-words text-sm text-zinc-500 sm:text-base">
              {email.sender.name}
              <span className="mx-1.5 text-zinc-700">·</span>
              {email.sender.email}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`w-fit rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide ${statusClass}`}
            >
              {statusLabel}
            </span>

            <span
              className={`w-fit rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${priorityClass}`}
            >
              {email.priority}
            </span>

            {email.labels.map((label) => (
              <span
                key={label}
                className="w-fit rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Conversation */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/10 sm:p-6">
        <h2 className="text-lg font-semibold text-zinc-100 sm:text-xl">
          Conversation
        </h2>

        <div className="mt-5 space-y-4">
          {email.thread.map((message, index) => (
            <div
              key={index}
              className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <strong className="break-words text-sm font-semibold text-zinc-200">
                  {message.from}
                </strong>

                <span className="text-xs text-zinc-600">
                  {new Date(message.at).toLocaleString()}
                </span>
              </div>

              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-400">
                {message.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Attachments */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/10 sm:p-6">
        <h2 className="text-lg font-semibold text-zinc-100 sm:text-xl">
          Attachments / Evidence
        </h2>

        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          {email.aiAnalysis.missingInformation.length > 0 ? (
            <>
              <p className="text-sm font-semibold text-amber-400">
                Missing evidence
              </p>

              <p className="mt-1 text-sm text-zinc-400">
                The incoming email does not include all evidence needed
                for review.
              </p>

              <p className="mt-2 text-xs font-medium text-zinc-600">
                {email.aiAnalysis.missingInformation.length} item
                {email.aiAnalysis.missingInformation.length !== 1
                  ? "s"
                  : ""}{" "}
                may be required.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-zinc-300">
                No attachments provided
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                No additional evidence is required based on the current
                analysis.
              </p>
            </>
          )}
        </div>
      </section>

      {/* AI Analysis */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/10 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
            ✦
          </div>

          <h2 className="text-lg font-semibold text-zinc-100 sm:text-xl">
            AI Analysis
          </h2>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
              Intent
            </p>
            <p className="mt-1 break-words text-sm font-semibold text-zinc-200">
              {email.aiAnalysis.intent}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
              Policy Used
            </p>

            {email.aiAnalysis.policyId ? (
              <p className="mt-1 break-words text-sm font-semibold text-zinc-200">
                {email.aiAnalysis.policyId}
              </p>
            ) : (
              <p
                className="mt-1 text-sm font-semibold text-amber-400"
                role="status"
                aria-live="polite"
              >
                Policy context unavailable
              </p>
            )}
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
              Model Version
            </p>
            <p className="mt-1 break-words text-sm font-semibold text-zinc-200">
              {email.audit.modelVersion}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
              Generated At
            </p>
            <p className="mt-1 text-sm font-semibold text-zinc-200">
              {new Date(email.audit.generatedAt).toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
              Confidence
            </p>

            <p className="mt-1 text-sm font-semibold text-zinc-200">
              {Math.round(email.aiAnalysis.confidence * 100)}%
            </p>

            {email.aiAnalysis.confidence < 0.8 && (
              <p
                className="mt-2 text-xs font-medium text-amber-400"
                role="status"
                aria-live="polite"
              >
                ⚠ Low confidence — manual review recommended
              </p>
            )}
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
              Risk Level
            </p>
            <p className="mt-1 text-sm font-semibold text-zinc-200">
              {email.aiAnalysis.riskLevel}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
              Sentiment
            </p>
            <p className="mt-1 text-sm font-semibold text-zinc-200">
              {email.aiAnalysis.sentiment}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
            Recommended Action
          </p>

          <p className="mt-1 break-words text-sm font-semibold text-zinc-200">
            {email.aiAnalysis.recommendedAction}
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
            Rationale
          </p>

          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-400">
            {email.aiAnalysis.rationale}
          </p>
        </div>

        {email.aiAnalysis.missingInformation.length > 0 && (
          <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-400">
              Missing Information
            </p>

            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-200">
              {email.aiAnalysis.missingInformation.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Draft Response */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/10 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-zinc-100 sm:text-xl">
            Draft Response
          </h2>

          {hasUnsavedChanges && (
            <span
              className="w-fit rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400"
              role="status"
              aria-live="polite"
            >
              Unsaved changes
            </span>
          )}
        </div>

        {!isEditing && (
          <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-zinc-400">
              {draftResponse}
            </p>
          </div>
        )}
      </section>

      {/* Approval Actions */}
      <ApprovalActions
        onApprove={onApprove}
        onReject={onReject}
        onEscalate={onEscalate}
        onRetry={onRetry}
        onEdit={() => setIsEditing(true)}
        isEditing={isEditing}
        draftResponse={draftResponse}
        onDraftChange={setDraftResponse}
        onSave={() => {
          onSaveDraft(draftResponse);
          setIsEditing(false);
        }}
        onCancel={() => {
          setDraftResponse(email.draftResponse);
          setIsEditing(false);
        }}
        allowedActions={email.allowedActions}
        status={email.status}
      />

      {/* Unsaved Changes Modal */}
      {navigationAction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={() => setNavigationAction(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              !
            </div>

            <h2 className="text-lg font-semibold text-zinc-100">
              Unsaved changes
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              You have unsaved changes to this draft. Leave without
              saving?
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setNavigationAction(null)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100 sm:w-auto"
              >
                Stay
              </button>

              <button
                type="button"
                onClick={() => {
                  const action = navigationAction;

                  setNavigationAction(null);

                  if (action === "back") onBack();
                  if (action === "previous") onPrevious();
                  if (action === "next") onNext();
                }}
                className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 sm:w-auto"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailDetail;