import { useState } from "react";
import type { Email } from "../types/email";
import ApprovalActions from "./ApprovalActions";

type EmailDetailProps = {
  email: Email;
  onBack: () => void;
  onApprove: () => void;
  onReject: () => void;
  onSaveDraft: (draft: string) => void;
};

function EmailDetail({
  email,
  onBack,
  onApprove,
  onReject,
  onSaveDraft,
}: EmailDetailProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [draftResponse, setDraftResponse] = useState(
    email.draftResponse
  );

  const priorityStyles = {
    critical:
      "bg-red-100 text-red-700 border border-red-200",
    urgent:
      "bg-amber-100 text-amber-700 border border-amber-200",
    normal:
      "bg-slate-100 text-slate-700 border border-slate-200",
    low:
      "bg-blue-100 text-blue-700 border border-blue-200",
  };

  const priorityClass =
    priorityStyles[
      email.priority as keyof typeof priorityStyles
    ] ?? priorityStyles.normal;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        ← Back to queue
      </button>

      {/* Header */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold leading-7 text-slate-900 sm:text-2xl">
              {email.subject}
            </h1>

            <p className="mt-2 break-words text-sm text-slate-500 sm:text-base">
              {email.sender.name}
              <span className="mx-1">·</span>
              {email.sender.email}
            </p>
          </div>

          <span
            className={`w-fit shrink-0 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${priorityClass}`}
          >
            {email.priority}
          </span>
        </div>
      </section>

      {/* Conversation */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          Conversation
        </h2>

        <div className="mt-5 space-y-4">
          {email.thread.map((message, index) => (
            <div
              key={index}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <strong className="break-words text-sm font-semibold text-slate-800">
                  {message.from}
                </strong>

                <span className="text-xs text-slate-500">
                  {new Date(message.at).toLocaleString()}
                </span>
              </div>

              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                {message.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Analysis */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          AI Analysis
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Intent
            </p>

            <p className="mt-1 break-words text-sm font-semibold text-slate-900">
              {email.aiAnalysis.intent}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Confidence
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {Math.round(email.aiAnalysis.confidence * 100)}%
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Risk Level
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {email.aiAnalysis.riskLevel}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Sentiment
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {email.aiAnalysis.sentiment}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Recommended Action
          </p>

          <p className="mt-1 break-words text-sm font-semibold text-slate-900">
            {email.aiAnalysis.recommendedAction}
          </p>
        </div>

        <div className="mt-4 rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Rationale
          </p>

          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
            {email.aiAnalysis.rationale}
          </p>
        </div>

        {email.aiAnalysis.missingInformation.length > 0 && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
              Missing Information
            </p>

            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-900">
              {email.aiAnalysis.missingInformation.map(
                (item) => (
                  <li key={item}>{item}</li>
                )
              )}
            </ul>
          </div>
        )}
      </section>

      {/* Draft Response */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          Draft Response
        </h2>

        {!isEditing && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
              {draftResponse}
            </p>
          </div>
        )}
      </section>

      {/* Approval Actions */}
      <ApprovalActions
        onApprove={onApprove}
        onReject={onReject}
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
      />
    </div>
  );
}

export default EmailDetail;