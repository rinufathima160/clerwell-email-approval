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
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-300 sm:p-5"
    >
      <div className="flex gap-3 sm:gap-5">
        {/* Queue number */}
        <div className="flex shrink-0 items-start pt-1">
          <span className="text-sm font-semibold text-slate-400 sm:text-base">
            #{email.queuePosition}
          </span>
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Subject + priority */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <h3 className="min-w-0 text-base font-semibold leading-6 text-slate-900 group-hover:text-slate-700 sm:text-lg">
              {email.subject}
            </h3>

            <span
              className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${priorityClass}`}
            >
              {email.priority}
            </span>
          </div>

          {/* Sender */}
          <p className="mt-2 truncate text-sm text-slate-500">
            {email.sender.name}
            <span className="mx-1">·</span>
            {email.sender.email}
          </p>

          {/* Email information */}
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
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

            <span>
              <span className="font-medium text-slate-800">
                Status:
              </span>{" "}
              {email.status}
            </span>
          </div>

          {/* Labels */}
          <div className="mt-4 flex flex-wrap gap-2">
            {email.labels.map((label) => (
              <span
                key={label}
                className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}

export default EmailCard;