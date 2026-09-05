import { useEffect, useState } from "react";
import type { Email } from "./types/email";
import Header from "./components/Header";
import Filters from "./components/Filters";
import EmailList from "./components/EmailList";
import EmailDetail from "./components/EmailDetail";

function getSavedEmails(): Email[] {
  const savedEmails = localStorage.getItem("approvalQueueEmails");

  if (!savedEmails) {
    return [];
  }

  try {
    return JSON.parse(savedEmails) as Email[];
  } catch {
    localStorage.removeItem("approvalQueueEmails");
    return [];
  }
}

function App() {
  const [emails, setEmails] = useState<Email[]>(getSavedEmails);
  const [loading, setLoading] = useState(
    () => getSavedEmails().length === 0
  );
  const [error, setError] = useState("");

  const [selectedEmail, setSelectedEmail] =
    useState<Email | null>(null);

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (emails.length > 0) {
      return;
    }

    fetch("/mock-data/emails.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load emails");
        }

        return response.json();
      })
      .then((data) => {
        setEmails(data.emails as Email[]);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load emails.");
        setLoading(false);
      });
  }, [emails.length]);

  useEffect(() => {
    if (emails.length > 0) {
      localStorage.setItem(
        "approvalQueueEmails",
        JSON.stringify(emails)
      );
    }
  }, [emails]);

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

    const matchesStatus =
      statusFilter === "all" ||
      email.status === statusFilter;

    return (
      matchesSearch &&
      matchesPriority &&
      matchesRisk &&
      matchesStatus
    );
  });

  const clearFilters = () => {
    setSearch("");
    setPriorityFilter("all");
    setRiskFilter("all");
    setStatusFilter("all");
  };

  const selectedIndex = selectedEmail
  ? emails.findIndex((email) => email.id === selectedEmail.id)
  : -1;

const handlePrevious = () => {
  if (selectedIndex <= 0) return;

  setSelectedEmail(emails[selectedIndex - 1]);
};

const handleNext = () => {
  if (
    selectedIndex === -1 ||
    selectedIndex >= emails.length - 1
  ) {
    return;
  }

  setSelectedEmail(emails[selectedIndex + 1]);
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
        email.id === updatedEmail.id ? updatedEmail : email
      )
    );

    setSelectedEmail(null);
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
        email.id === updatedEmail.id ? updatedEmail : email
      )
    );

    setSelectedEmail(null);
  };

  // Escalate email
  const handleEscalate = () => {
    if (!selectedEmail) return;

    const updatedEmail = {
      ...selectedEmail,
      status: "escalated",
    };

    setEmails((currentEmails) =>
      currentEmails.map((email) =>
        email.id === updatedEmail.id
          ? updatedEmail
          : email
      )
    );

    setSelectedEmail(null);
  };

// Retry AI analysis

// Retry AI analysis with reviewer guidance
const handleRetry = (guidance: string) => {
  if (!selectedEmail) return;

  const updatedEmail: Email = {
    ...selectedEmail,
    status: "pending_review",
    aiAnalysis: {
      ...selectedEmail.aiAnalysis,
      rationale: `${selectedEmail.aiAnalysis.rationale}

Reviewer guidance: ${guidance}

AI worker retry: The analysis was re-evaluated using the reviewer's guidance.`,
    },
    audit: {
      ...selectedEmail.audit,
      generatedAt: new Date().toISOString(),
      modelVersion: `${selectedEmail.audit.modelVersion}-retry`,
    },
  };

  setEmails((currentEmails) =>
    currentEmails.map((email) =>
      email.id === updatedEmail.id ? updatedEmail : email
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
          key={selectedEmail.id}
         email={selectedEmail}
  onBack={() => setSelectedEmail(null)}
  onPrevious={handlePrevious}
  onNext={handleNext}
  currentPosition={selectedIndex + 1}
  totalEmails={emails.length}
  onApprove={handleApprove}
  onReject={handleReject}
  onEscalate={handleEscalate}
  onRetry={handleRetry}
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
          statusFilter={statusFilter}
          setSearch={setSearch}
          setPriorityFilter={setPriorityFilter}
          setRiskFilter={setRiskFilter}
          setStatusFilter={setStatusFilter}
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