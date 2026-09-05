import { useState } from "react";

type ApprovalActionsProps = {
  onApprove: () => void;
  onReject: () => void;
  onEscalate: () => void;
  onEdit: () => void;

  isEditing: boolean;
  draftResponse: string;
  onDraftChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  allowedActions: string[];
  status: string;
};

function ApprovalActions({
  onApprove,
  onReject,
  onEscalate,
  onEdit,
  isEditing,
  draftResponse,
  onDraftChange,
  onSave,
  onCancel,
  allowedActions,
  status,
}: ApprovalActionsProps) {
  const [confirmation, setConfirmation] = useState<
    "approve" | "reject" | "escalate" | null
  >(null);

  const [message, setMessage] = useState("");

  const canApprove = allowedActions.includes("approve_send");
  const canReject = allowedActions.includes("reject");
  const canEdit = allowedActions.includes("edit");
const canEscalate = allowedActions.includes("escalate");
  const isPending = status === "pending_review";
  const isApproved = status === "approved";
  const isRejected = status === "rejected";
    const isEscalated = status === "escalated";
  const handleConfirm = () => {
    if (confirmation === "approve") {
      onApprove();
      setMessage("Email approved successfully.");
    }

    if (confirmation === "reject") {
      onReject();
      setMessage("Email rejected successfully.");
    }
     if (confirmation === "escalate") {
    onEscalate();
    setMessage("Email escalated successfully.");
  }
    setConfirmation(null);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  if (isEditing) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          Edit Response
        </h2>

        <textarea
          value={draftResponse}
          onChange={(e) => onDraftChange(e.target.value)}
          rows={8}
          className="mt-4 w-full resize-y rounded-lg border border-slate-300 bg-white p-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          aria-label="Edit draft response"
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
          >
            Save Response
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
              Approval Decision
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Review the AI analysis and draft response before taking action.
            </p>
          </div>

          {/* Current Status */}
          {isPending && (
            <span className="w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
              Pending Review
            </span>
          )}

          {isApproved && (
            <span className="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Approved
            </span>
          )}

          {isRejected && (
            <span className="w-fit rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-700">
              Rejected
            </span>
          )}

          {isEscalated && (
  <span className="w-fit rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
    Escalated
  </span>
)}
        </div>

        {/* Success message */}
        {message && (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            ✓ {message}
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {isPending && canApprove && (
            <button
              type="button"
              onClick={() => setConfirmation("approve")}
              className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              Approve
            </button>
          )}

          {isPending && canReject && (
            <button
              type="button"
              onClick={() => setConfirmation("reject")}
              className="w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Reject
            </button>
          )}
    {isPending && canEscalate && (
  <button
    type="button"
    onClick={() => setConfirmation("escalate")}
    className="w-full rounded-lg bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
  >
    Escalate
  </button>
)}
          {canEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Edit Response
            </button>
          )}
        </div>
      </section>

      {/* Confirmation Modal */}
      {confirmation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
          onClick={() => setConfirmation(null)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-slate-900">
            {confirmation === "approve"
              ? "Approve this email?"
              : confirmation === "reject"
               ? "Reject this email?"
               : "Escalate this email?"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
            {confirmation === "approve"
             ? "Are you sure you want to approve this email?"
                 : confirmation === "reject"
                  ? "Are you sure you want to reject this email?"
                 : "Are you sure you want to escalate this email?"}
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setConfirmation(null)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition sm:w-auto ${
                    confirmation === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : confirmation === "reject"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {confirmation === "approve"
                ? "Yes, Approve"
            : confirmation === "reject"
             ? "Yes, Reject"
            : "Yes, Escalate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ApprovalActions;