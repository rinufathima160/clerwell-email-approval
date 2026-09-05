import type { Email } from "../types/email";
import EmailCard from "./EmailCard";

type EmailListProps = {
  emails: Email[];
  onSelectEmail: (email: Email) => void;
};

function EmailList({
  emails,
  onSelectEmail,
}: EmailListProps) {
  if (emails.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          No emails found
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {emails.map((email) => (
        <EmailCard
          key={email.id}
          email={email}
          onClick={() => onSelectEmail(email)}
        />
      ))}
    </section>
  );
}

export default EmailList;