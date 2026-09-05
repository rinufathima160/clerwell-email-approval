import { useEffect, useState } from "react";
import type { Email } from "./types/email";
import Header from "./components/Header";
import Filters from "./components/Filters";
import EmailList from "./components/EmailList";
import EmailDetail from "./components/EmailDetail";

function App() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedEmail, setSelectedEmail] =
    useState<Email | null>(null);

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  useEffect(() => {
    fetch("/mock-data/emails.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load emails");
        }

        return response.json();
      })
      .then((data) => {
        setEmails(data.emails);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load emails.");
        setLoading(false);
      });
  }, []);

  const filteredEmails = emails.filter((email) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      email.subject.toLowerCase().includes(searchText) ||
      email.sender.name.toLowerCase().includes(searchText) ||
      email.sender.email.toLowerCase().includes(searchText);

    const matchesPriority =
      priorityFilter === "all" ||
      email.priority === priorityFilter;

    const matchesRisk =
      riskFilter === "all" ||
      email.aiAnalysis.riskLevel === riskFilter;

    return (
      matchesSearch &&
      matchesPriority &&
      matchesRisk
    );
  });

  const clearFilters = () => {
    setSearch("");
    setPriorityFilter("all");
    setRiskFilter("all");
  };

  // Approve email
  const handleApprove = () => {
    if (!selectedEmail) return;

    const updatedEmail = {
      ...selectedEmail,
      status: "approved",
    };

    setEmails((currentEmails) =>
      currentEmails.map((email) =>
        email.id === updatedEmail.id
          ? updatedEmail
          : email
      )
    );

    setSelectedEmail(updatedEmail);
  };

  // Reject email
  const handleReject = () => {
    if (!selectedEmail) return;

    const updatedEmail = {
      ...selectedEmail,
      status: "rejected",
    };

    setEmails((currentEmails) =>
      currentEmails.map((email) =>
        email.id === updatedEmail.id
          ? updatedEmail
          : email
      )
    );

    setSelectedEmail(updatedEmail);
  };

  // Save edited response
  const handleSaveDraft = (draft: string) => {
    if (!selectedEmail) return;

    const updatedEmail = {
      ...selectedEmail,
      draftResponse: draft,
    };

    setEmails((currentEmails) =>
      currentEmails.map((email) =>
        email.id === updatedEmail.id
          ? updatedEmail
          : email
      )
    );

    setSelectedEmail(updatedEmail);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />

          <h1 className="text-lg font-semibold text-slate-800">
            Loading emails...
          </h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-red-600">
            {error}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Please refresh the page and try again.
          </p>
        </div>
      </div>
    );
  }

  // Email detail page
  if (selectedEmail) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <EmailDetail
            email={selectedEmail}
            onBack={() => setSelectedEmail(null)}
            onApprove={handleApprove}
            onReject={handleReject}
            onSaveDraft={handleSaveDraft}
          />
        </main>
      </div>
    );
  }

  // Main queue
  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        emailCount={filteredEmails.length}
        totalEmails={emails.length}
      />

      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Filters
          search={search}
          priorityFilter={priorityFilter}
          riskFilter={riskFilter}
          setSearch={setSearch}
          setPriorityFilter={setPriorityFilter}
          setRiskFilter={setRiskFilter}
          clearFilters={clearFilters}
        />

        <EmailList
          emails={filteredEmails}
          onSelectEmail={setSelectedEmail}
        />
      </main>
    </div>
  );
}

export default App;