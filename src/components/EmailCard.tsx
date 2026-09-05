import type { Email } from "../types/email";

type EmailCardProps = {
  email: Email;
  onClick: () => void;
};

function EmailCard({ email, onClick }: EmailCardProps) {
  const priorityStyles = {
    critical: "bg-red-500/10 text-red-400 border-red-500/20",
    urgent: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    normal: "bg-zinc-800 text-zinc-300 border-zinc-700",
    low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

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

  const priorityClass =
    priorityStyles[
      email.priority as keyof typeof priorityStyles
    ] ?? priorityStyles.normal;

  const statusClass =
    statusStyles[
      email.status as keyof typeof statusStyles
    ] ?? "bg-zinc-800 text-zinc-300 border-zinc-700";

  const statusLabel =
    statusLabels[
      email.status as keyof typeof statusLabels
    ] ?? email.status;

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group w-full rounded-2xl
        border border-zinc-800
        bg-zinc-900
        p-4 text-left
        shadow-lg shadow-black/10
        transition-all duration-200
        hover:-translate-y-0.5
        hover:border-zinc-700
        hover:bg-zinc-900/90
        hover:shadow-xl hover:shadow-black/20
        focus:outline-none
        focus:ring-2 focus:ring-violet-500/50
        sm:p-5
      "
    >
      <div className="flex gap-3 sm:gap-4">
        {/* Queue number */}
        <div className="shrink-0 pt-1">
          <span className="text-xs font-semibold text-zinc-600 sm:text-sm">
            #{email.queuePosition}
          </span>
        </div>

        {/* Email content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <h3
              className="
                min-w-0
                text-base font-semibold leading-6
                text-zinc-100
                transition-colors
                group-hover:text-violet-300
                sm:text-lg
              "
            >
              {email.subject}
            </h3>

            <div className="flex flex-wrap gap-2">
              {/* Status */}
              <span
                className={`w-fit shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide sm:px-3 sm:text-xs ${statusClass}`}
              >
                {statusLabel}
              </span>

              {/* Priority */}
              <span
                className={`w-fit shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide sm:px-3 sm:text-xs ${priorityClass}`}
              >
                {email.priority}
              </span>
            </div>
          </div>

          {/* Sender */}
          <p className="mt-2 truncate text-sm text-zinc-500">
            {email.sender.name}
            <span className="mx-1 text-zinc-700">·</span>
            {email.sender.email}
          </p>

          {/* Email information */}
          <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-zinc-400 sm:flex sm:flex-wrap sm:gap-x-6">
            <span>
              <span className="font-medium text-zinc-300">Risk:</span>{" "}
              {email.aiAnalysis.riskLevel}
            </span>

            <span>
              <span className="font-medium text-zinc-300">
                Confidence:
              </span>{" "}
              {Math.round(email.aiAnalysis.confidence * 100)}%
            </span>
          </div>

          {/* Labels */}
          {email.labels.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {email.labels.map((label) => (
                <span
                  key={label}
                  className="rounded-md border border-violet-500/10 bg-violet-500/5 px-2.5 py-1 text-xs font-medium text-violet-300"
                >
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

export default EmailCard;