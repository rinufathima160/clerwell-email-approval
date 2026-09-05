import { useEffect, useRef, useState } from "react";

type ApprovalActionsProps = {
  onApprove: () => void | Promise<void>;
  onReject: () => void | Promise<void>;
  onEscalate: () => void | Promise<void>;
  onRetry: (guidance: string) => void;
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
  onRetry,
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

  const [retryOpen, setRetryOpen] = useState(false);
  const [retryGuidance, setRetryGuidance] = useState("");
  const [message, setMessage] = useState("");
  const [actionState, setActionState] = useState<
    "idle" | "in_progress" | "success" | "error"
  >("idle");

  const [actionError, setActionError] = useState("");
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!confirmation && !retryOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setConfirmation(null);
        setRetryOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    if (confirmation) {
      cancelButtonRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [confirmation, retryOpen]);

  const canApprove = allowedActions.includes("approve_send");
  const canReject = allowedActions.includes("reject");
  const canEdit = allowedActions.includes("edit");
  const canEscalate = allowedActions.includes("escalate");
  const canRetry = allowedActions.includes("retry");

  const isPending = status === "pending_review";
  const isApproved = status === "approved";
  const isRejected = status === "rejected";
  const isEscalated = status === "escalated";

  const handleConfirm = async () => {
    if (!confirmation) return;

    setActionState("in_progress");
    setActionError("");
    setMessage("");

    try {
      if (confirmation === "approve") {
        await onApprove();
        setMessage("Email approved successfully.");
      }

      if (confirmation === "reject") {
        await onReject();
        setMessage("Email rejected successfully.");
      }

      if (confirmation === "escalate") {
        await onEscalate();
        setMessage("Email escalated successfully.");
      }

      setActionState("success");
      setConfirmation(null);

      setTimeout(() => {
        setMessage("");
        setActionState("idle");
      }, 3000);
    } catch {
      setActionState("error");
      setActionError(
        "The action could not be completed. Please try again."
      );
    }
  };

  const handleRetry = () => {
    const guidance = retryGuidance.trim();

    if (!guidance) return;

    onRetry(guidance);
    setRetryGuidance("");
    setRetryOpen(false);
  };

  if (isEditing) {
    return (
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/10 sm:p-6">
        <h2 className="text-lg font-semibold text-zinc-100 sm:text-xl">
          Edit Response
        </h2>

        <textarea
          value={draftResponse}
          onChange={(e) => onDraftChange(e.target.value)}
          rows={8}
          className="mt-4 w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm leading-6 text-zinc-300 outline-none transition placeholder:text-zinc-600 hover:border-zinc-600 focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/10"
          aria-label="Edit draft response"
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500/40 sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            className="w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400/40 sm:w-auto"
          >
            Save Response
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/10 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100 sm:text-xl">
              Approval Decision
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Review the AI analysis and draft response before taking
              action.
            </p>
          </div>

          {isPending && (
            <span className="w-fit rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-400">
              Pending Review
            </span>
          )}

          {isApproved && (
            <span className="w-fit rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-400">
              Approved
            </span>
          )}

          {isRejected && (
            <span className="w-fit rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-400">
              Rejected
            </span>
          )}

          {isEscalated && (
            <span className="w-fit rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-400">
              Escalated
            </span>
          )}
        </div>

        {message && (
          <div
            className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400"
            role="status"
            aria-live="polite"
          >
            ✓ {message}
          </div>
        )}

        {actionState === "in_progress" && (
          <div
            className="mt-4 rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-3 text-sm font-medium text-violet-300"
            role="status"
            aria-live="polite"
          >
            Processing your decision...
          </div>
        )}

        {actionState === "error" && (
          <div
            className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400"
            role="alert"
            aria-live="assertive"
          >
            {actionError}
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {isPending && canApprove && (
            <button
              type="button"
              onClick={() => setConfirmation("approve")}
              disabled={actionState === "in_progress"}
              className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
            >
              {actionState === "in_progress"
                ? "Processing..."
                : "Approve & Send"}
            </button>
          )}

          {isPending && canReject && (
            <button
              type="button"
              onClick={() => setConfirmation("reject")}
              disabled={actionState === "in_progress"}
              className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-400/40"
            >
              {actionState === "in_progress"
                ? "Processing..."
                : "Reject"}
            </button>
          )}

          {isPending && canEscalate && (
            <button
              type="button"
              onClick={() => setConfirmation("escalate")}
              disabled={actionState === "in_progress"}
              className="w-full rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-orange-400/40"
            >
              {actionState === "in_progress"
                ? "Processing..."
                : "Escalate"}
            </button>
          )}

          {isPending && canRetry && (
            <button
              type="button"
              onClick={() => setRetryOpen(true)}
              className="w-full rounded-xl border border-violet-500/30 bg-violet-500/5 px-4 py-3 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/10 focus:outline-none focus:ring-2 focus:ring-violet-400/40"
            >
              Retry AI Analysis
            </button>
          )}

          {canEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500/40"
            >
              Edit Response
            </button>
          )}
        </div>
      </section>

      {/* Confirmation Modal */}
      {confirmation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={() => setConfirmation(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-zinc-100">
              {confirmation === "approve"
                ? "Approve & Send this email?"
                : confirmation === "reject"
                  ? "Reject this email?"
                  : "Escalate this email?"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              {confirmation === "approve"
                ? "Are you sure you want to approve & Send this email?"
                : confirmation === "reject"
                  ? "Are you sure you want to reject this email?"
                  : "Are you sure you want to escalate this email?"}
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={() => setConfirmation(null)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={actionState === "in_progress"}
                className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50 sm:w-auto ${
                  confirmation === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-500"
                    : confirmation === "reject"
                      ? "bg-red-600 hover:bg-red-500"
                      : "bg-orange-600 hover:bg-orange-500"
                }`}
              >
                {confirmation === "approve"
                  ? "Yes, Approve & Send"
                  : confirmation === "reject"
                    ? "Yes, Reject"
                    : "Yes, Escalate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Retry Modal */}
      {retryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={() => setRetryOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-zinc-100">
              Ask AI Worker to Retry
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Tell the AI worker what it should reconsider before
              generating a new analysis.
            </p>

            <label
              htmlFor="retry-guidance"
              className="mt-5 block text-sm font-medium text-zinc-300"
            >
              Reviewer guidance
            </label>

            <textarea
              id="retry-guidance"
              value={retryGuidance}
              onChange={(e) => setRetryGuidance(e.target.value)}
              rows={5}
              placeholder="Example: Re-check the refund policy and consider the customer's purchase date."
              className="mt-2 w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm leading-6 text-zinc-300 outline-none transition placeholder:text-zinc-600 focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/10"
              autoFocus
            />

            <p className="mt-2 text-xs text-zinc-600">
              Guidance is required before retrying.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setRetryGuidance("");
                  setRetryOpen(false);
                }}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleRetry}
                disabled={!retryGuidance.trim()}
                className="w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                Retry AI Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ApprovalActions;