import type { Email } from "../types/email";

type EmailDetailProps = {
  email: Email;
  onBack: () => void;
};

function EmailDetail({
  email,
  onBack,
}: EmailDetailProps) {
  const priorityStyles = {
    critical:
      "bg-red-100 text-red-700 border-red-200",
    urgent:
      "bg-amber-100 text-amber-700 border-amber-200",
    normal:
      "bg-slate-100 text-slate-700 border-slate-200",
    low:
      "bg-blue-100 text-blue-700 border-blue-200",
  };

  const priorityClass =
    priorityStyles[
      email.priority as keyof typeof priorityStyles
    ] ?? priorityStyles.normal;

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="
          inline-flex
          min-h-10
          items-center
          rounded-lg
          border
          border-slate-300
          bg-white
          px-4
          py-2
          text-sm
          font-medium
          text-slate-700
          shadow-sm
          transition
          hover:bg-slate-50
          active:bg-slate-100
          focus:outline-none
          focus:ring-2
          focus:ring-slate-300
        "
      >
        ← Back to queue
      </button>

      {/* Email header */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          <div className="min-w-0 flex-1">
            <h1
              className="
                break-words
                text-xl
                font-bold
                leading-7
                text-slate-900
                sm:text-2xl
              "
            >
              {email.subject}
            </h1>

            <p
              className="
                mt-2
                break-words
                text-sm
                leading-5
                text-slate-500
                sm:text-base
              "
            >
              {email.sender.name}
              <span className="mx-1">·</span>
              {email.sender.email}
            </p>
          </div>

          <span
            className={`
              w-fit
              shrink-0
              rounded-full
              border
              px-3
              py-1
              text-xs
              font-semibold
              uppercase
              tracking-wide
              ${priorityClass}
            `}
          >
            {email.priority}
          </span>

        </div>
      </section>

      {/* Conversation */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          Conversation
        </h2>

        <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
          {email.thread.map((message, index) => (
            <div
              key={index}
              className="
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                p-4
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-1
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <strong className="break-words text-sm font-semibold text-slate-800">
                  {message.from}
                </strong>

                <span className="text-xs text-slate-500">
                  {new Date(message.at).toLocaleString()}
                </span>
              </div>

              <p
                className="
                  mt-3
                  whitespace-pre-wrap
                  break-words
                  text-sm
                  leading-6
                  text-slate-700
                "
              >
                {message.body}
              </p>
            </div>
          ))}
        </div>

      </section>

      {/* AI Analysis */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          AI Analysis
        </h2>

        {/* Analysis summary */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-4">

          {/* Intent */}
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Intent
            </p>

            <p className="mt-1 break-words text-sm font-semibold text-slate-900">
              {email.aiAnalysis.intent}
            </p>
          </div>

          {/* Confidence */}
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Confidence
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {Math.round(
                email.aiAnalysis.confidence * 100
              )}
              %
            </p>
          </div>

          {/* Risk */}
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Risk Level
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {email.aiAnalysis.riskLevel}
            </p>
          </div>

          {/* Sentiment */}
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Sentiment
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {email.aiAnalysis.sentiment}
            </p>
          </div>

        </div>

        {/* Recommended Action */}
        <div className="mt-3 rounded-lg border border-slate-200 p-4 sm:mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Recommended Action
          </p>

          <p className="mt-1 break-words text-sm font-semibold text-slate-900">
            {email.aiAnalysis.recommendedAction}
          </p>
        </div>

        {/* Rationale */}
        <div className="mt-3 rounded-lg border border-slate-200 p-4 sm:mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Rationale
          </p>

          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
            {email.aiAnalysis.rationale}
          </p>
        </div>

        {/* Missing Information */}
        {email.aiAnalysis.missingInformation.length > 0 && (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4 sm:mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
              Missing Information
            </p>

            <ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-6 text-amber-900">
              {email.aiAnalysis.missingInformation.map(
                (item) => (
                  <li key={item} className="break-words">
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

      </section>

      {/* Draft Response */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          Draft Response
        </h2>

        <div
          className="
            mt-3
            rounded-lg
            border
            border-slate-200
            bg-slate-50
            p-4
            sm:mt-4
          "
        >
          <p
            className="
              whitespace-pre-wrap
              break-words
              text-sm
              leading-6
              text-slate-700
            "
          >
            {email.draftResponse}
          </p>
        </div>

      </section>

    </div>
  );
}

export default EmailDetail;