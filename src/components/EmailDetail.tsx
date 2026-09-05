import { useState } from "react";
import type { Email, Policy } from "../types/email";
import ApprovalActions from "./ApprovalActions";

type EmailDetailProps = {
  email: Email;
  policy?: Policy;
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
  policy,
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

  const confidencePercentage = Math.round(
    email.aiAnalysis.confidence * 100
  );

  const riskLevel =
    email.aiAnalysis.riskLevel.toLowerCase();

  const riskClass =
    riskLevel === "high"
      ? "text-red-400"
      : riskLevel === "medium"
      ? "text-amber-400"
      : "text-emerald-400";

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
          ←{" "}
          <span className="hidden sm:inline">
            Previous
          </span>
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
          <span className="hidden sm:inline">
            Next{" "}
          </span>
          →
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

              <span className="mx-1.5 text-zinc-700">
                ·
              </span>

              {email.sender.email}
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Received{" "}
              {new Date(
                email.receivedAt
              ).toLocaleString()}
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
                  {new Date(
                    message.at
                  ).toLocaleString()}
                </span>
              </div>

              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-400">
                {message.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Attachments / Evidence */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/10 sm:p-6">
        <h2 className="text-lg font-semibold text-zinc-100 sm:text-xl">
          Attachments / Evidence
        </h2>

        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          {email.aiAnalysis.missingInformation.length >
          0 ? (
            <>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                  !
                </span>

                <p className="text-sm font-semibold text-amber-400">
                  Missing evidence
                </p>
              </div>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                The incoming email does not include all
                evidence needed for review.
              </p>

              <p className="mt-2 text-xs font-medium text-zinc-600">
                {
                  email.aiAnalysis.missingInformation
                    .length
                }{" "}
                item
                {email.aiAnalysis.missingInformation
                  .length !== 1
                  ? "s"
                  : ""}{" "}
                may be required.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  ✓
                </span>

                <p className="text-sm font-semibold text-zinc-300">
                  Evidence appears complete
                </p>
              </div>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                No additional evidence is required based
                on the current analysis.
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

          <div>
            <h2 className="text-lg font-semibold text-zinc-100 sm:text-xl">
              AI Worker Analysis
            </h2>

            <p className="text-xs text-zinc-600">
              Review the recommendation before taking action
            </p>
          </div>
        </div>

        {/* Analysis summary */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Intent */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
              Intent
            </p>

            <p className="mt-1 break-words text-sm font-semibold text-zinc-200">
              {email.aiAnalysis.intent}
            </p>
          </div>

          {/* Confidence */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
                Confidence
              </p>

              <span className="text-sm font-bold text-zinc-100">
                {confidencePercentage}%
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className={`h-full rounded-full transition-all ${
                  confidencePercentage >= 80
                    ? "bg-emerald-500"
                    : confidencePercentage >= 60
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`}
                style={{
                  width: `${confidencePercentage}%`,
                }}
              />
            </div>

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

          {/* Risk */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
              Risk Level
            </p>

            <p
              className={`mt-1 text-sm font-bold uppercase ${riskClass}`}
            >
              {email.aiAnalysis.riskLevel}
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-600">
              Confidence does not determine safety. Review
              the risk context before approving.
            </p>
          </div>

          {/* Sentiment */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
              Sentiment
            </p>

            <p className="mt-1 text-sm font-semibold text-zinc-200">
              {email.aiAnalysis.sentiment}
            </p>
          </div>
        </div>

        {/* Governing Policy */}
        <div className="mt-4 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
              §
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-violet-400">
                Governing Policy
              </p>

              {policy ? (
                <>
                  <h3 className="mt-1 break-words text-base font-semibold text-zinc-100">
                    {policy.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {policy.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-400">
                      ID: {policy.id}
                    </span>

                    <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-400">
                      Category: {policy.category}
                    </span>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                        policy.requiresHumanApproval
                          ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {policy.requiresHumanApproval
                        ? "Human approval required"
                        : "Human approval not required"}
                    </span>
                  </div>

                  {policy.riskFlags.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
                        Policy Risk Flags
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {policy.riskFlags.map(
                          (flag) => (
                            <span
                              key={flag}
                              className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-400"
                            >
                              {flag}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="mt-1 text-sm font-semibold text-amber-400">
                    Policy context unavailable
                  </p>

                  <p className="mt-2 text-xs leading-5 text-zinc-600">
                    The AI analysis references policy ID{" "}
                    <span className="text-zinc-400">
                      {email.aiAnalysis.policyId ||
                        "unknown"}
                    </span>
                    , but the full policy could not be
                    loaded.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Recommended Action */}
        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
            Recommended Action
          </p>

          <p className="mt-1 break-words text-sm font-semibold text-zinc-200">
            {email.aiAnalysis.recommendedAction}
          </p>
        </div>

        {/* Rationale */}
        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
            Rationale
          </p>

          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-400">
            {email.aiAnalysis.rationale}
          </p>
        </div>

        {/* Missing information */}
        {email.aiAnalysis.missingInformation.length >
          0 && (
          <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-400">
              Missing Information
            </p>

            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-200">
              {email.aiAnalysis.missingInformation.map(
                (item) => (
                  <li key={item}>{item}</li>
                )
              )}
            </ul>
          </div>
        )}

        {/* Audit */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
              AI Worker
            </p>

            <p className="mt-1 break-words text-sm font-semibold text-zinc-200">
              {email.audit.aiWorker}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
              Model Version
            </p>

            <p className="mt-1 break-words text-sm font-semibold text-zinc-200">
              {email.audit.modelVersion}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
              Analysis Generated
            </p>

            <p className="mt-1 text-sm font-semibold text-zinc-200">
              {new Date(
                email.audit.generatedAt
              ).toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {/* Draft Response */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/10 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100 sm:text-xl">
              Draft Response
            </h2>

            <p className="mt-1 text-xs text-zinc-600">
              Review and edit the response before sending.
            </p>
          </div>

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
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              !
            </div>

            <h2 className="text-lg font-semibold text-zinc-100">
              Unsaved changes
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              You have unsaved changes to this draft. Leave
              without saving?
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setNavigationAction(null)
                }
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100 sm:w-auto"
              >
                Stay
              </button>

              <button
                type="button"
                onClick={() => {
                  const action =
                    navigationAction;

                  setNavigationAction(null);

                  if (action === "back") {
                    onBack();
                  }

                  if (action === "previous") {
                    onPrevious();
                  }

                  if (action === "next") {
                    onNext();
                  }
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