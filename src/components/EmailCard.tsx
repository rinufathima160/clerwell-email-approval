import type { Email } from "../types/email";

type EmailCardProps = {
  email: Email;
  onClick: () => void;
};

function EmailCard({
  email,
  onClick,
}: EmailCardProps) {
  const priorityStyles = {
    critical:
      "bg-red-50 text-red-700 border-red-200",
    urgent:
      "bg-amber-50 text-amber-700 border-amber-200",
    normal:
      "bg-slate-50 text-slate-700 border-slate-200",
    low:
      "bg-blue-50 text-blue-700 border-blue-200",
  };

  const statusStyles = {
    pending_review:
      "bg-amber-50 text-amber-700 border-amber-200",
    approved:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected:
      "bg-red-50 text-red-700 border-red-200",
  };

  const statusLabels = {
    pending_review: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",
  };

  const priorityClass =
    priorityStyles[
      email.priority as keyof typeof priorityStyles
    ] ?? priorityStyles.normal;

  const statusClass =
    statusStyles[
      email.status as keyof typeof statusStyles
    ] ?? "bg-slate-50 text-slate-700 border-slate-200";

  const statusLabel =
    statusLabels[
      email.status as keyof typeof statusLabels
    ] ?? email.status;

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group w-full
        rounded-xl
        border border-slate-200
        bg-white
        p-4
        text-left
        shadow-sm
        transition-all duration-200
        hover:border-slate-300
        hover:shadow-md
        focus:outline-none
        focus:ring-2
        focus:ring-slate-300
        sm:p-5
      "
    >
      <div className="flex gap-3 sm:gap-4">

        {/* Queue number */}
        <div className="shrink-0 pt-1">
          <span className="text-sm font-semibold text-slate-400">
            #{email.queuePosition}
          </span>
        </div>

        {/* Email content */}
        <div className="min-w-0 flex-1">

          {/* Subject + Status + Priority */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

            <h3
              className="
                min-w-0
                text-base
                font-semibold
                leading-6
                text-slate-900
                transition-colors
                group-hover:text-slate-700
                sm:text-lg
              "
            >
              {email.subject}
            </h3>

            <div className="flex flex-wrap gap-2">

              {/* Status */}
              <span
                className="
                  w-fit
                  shrink-0
                  rounded-full
                  border
                  px-2.5
                  py-1
                  text-[11px]
                  font-semibold
                  tracking-wide
                  sm:px-3
                  sm:text-xs
                "
                style={{}}
              >
                <span
                  className={`
                    rounded-full
                    ${statusClass}
                  `}
                >
                  {statusLabel}
                </span>
              </span>

              {/* Priority */}
              <span
                className={`
                  w-fit
                  shrink-0
                  rounded-full
                  border
                  px-2.5
                  py-1
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-wide
                  sm:px-3
                  sm:text-xs
                  ${priorityClass}
                `}
              >
                {email.priority}
              </span>

            </div>
          </div>

          {/* Sender */}
          <p className="mt-2 truncate text-sm text-slate-500">
            {email.sender.name}
            <span className="mx-1 text-slate-300">·</span>
            {email.sender.email}
          </p>

          {/* Email information */}
          <div
            className="
              mt-4
              grid
              grid-cols-1
              gap-2
              text-sm
              text-slate-600
              sm:flex
              sm:flex-wrap
              sm:gap-x-6
            "
          >
            <span>
              <span className="font-medium text-slate-800">
                Risk:
              </span>{" "}
              {email.aiAnalysis.riskLevel}
            </span>

            <span>
              <span className="font-medium text-slate-800">
                Confidence:
              </span>{" "}
              {Math.round(
                email.aiAnalysis.confidence * 100
              )}
              %
            </span>
          </div>

          {/* Labels */}
          {email.labels.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {email.labels.map((label) => (
                <span
                  key={label}
                  className="
                    rounded-md
                    bg-indigo-50
                    px-2.5
                    py-1
                    text-xs
                    font-medium
                    text-indigo-700
                  "
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