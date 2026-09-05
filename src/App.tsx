import { useEffect, useState } from "react";
import type { Email, Policy } from "./types/email";
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

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [policiesLoading, setPoliciesLoading] = useState(true);

  const [selectedEmail, setSelectedEmail] =
    useState<Email | null>(null);

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  /*
   * Load policies.
   *
   * Policies are separate from emails because the email only stores
   * the policyId. We use that ID to find the full policy information.
   */
  useEffect(() => {
    fetch("/mock-data/policies.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load policies");
        }

        return response.json();
      })
      .then((data) => {
        setPolicies(data.policies as Policy[]);
        setPoliciesLoading(false);
      })
      .catch(() => {
        setPolicies([]);
        setPoliciesLoading(false);
      });
  }, []);

  /*
   * Load emails.
   */
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

  /*
   * Persist reviewer changes locally.
   */
  useEffect(() => {
    if (emails.length > 0) {
      localStorage.setItem(
        "approvalQueueEmails",
        JSON.stringify(emails)
      );
    }
  }, [emails]);

  /*
   * Find the full policy associated with the selected email.
   */
  const selectedPolicy = selectedEmail
    ? policies.find(
        (policy) =>
          policy.id === selectedEmail.aiAnalysis.policyId
      )
    : undefined;

  /*
   * Search and filters.
   */
  const filteredEmails = emails.filter((email) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      searchText === "" ||
      email.subject.toLowerCase().includes(searchText) ||
      email.sender.name.toLowerCase().includes(searchText) ||
      email.sender.email.toLowerCase().includes(searchText) ||
      email.aiAnalysis.intent.toLowerCase().includes(searchText);

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

  /*
   * Selected email position.
   */
  const selectedIndex = selectedEmail
    ? emails.findIndex(
        (email) => email.id === selectedEmail.id
      )
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

  /*
   * Approve & Send.
   */
  const handleApprove = async () => {
    if (!selectedEmail) return;

    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    const updatedEmail: Email = {
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

  /*
   * Reject.
   */
  const handleReject = async () => {
    if (!selectedEmail) return;

    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    const updatedEmail: Email = {
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

  /*
   * Escalate.
   */
  const handleEscalate = async () => {
    if (!selectedEmail) return;

    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    const updatedEmail: Email = {
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

    setSelectedEmail(updatedEmail);
  };

  /*
   * Ask AI Worker to Retry.
   */
  const handleRetry = (guidance: string) => {
    if (!selectedEmail) return;

    const trimmedGuidance = guidance.trim();

    const retryMessage = trimmedGuidance
      ? `

Reviewer guidance: ${trimmedGuidance}

AI worker retry: The analysis was re-evaluated using the reviewer's guidance.`
      : `

AI worker retry: The analysis was re-evaluated after reviewer requested another analysis.`;

    const updatedEmail: Email = {
      ...selectedEmail,

      status: "pending_review",

      aiAnalysis: {
        ...selectedEmail.aiAnalysis,

        rationale:
          selectedEmail.aiAnalysis.rationale +
          retryMessage,
      },

      audit: {
        ...selectedEmail.audit,

        generatedAt: new Date().toISOString(),

        modelVersion:
          `${selectedEmail.audit.modelVersion}-retry`,
      },
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

  /*
   * Save edited draft locally.
   */
  const handleSaveDraft = (draft: string) => {
    if (!selectedEmail) return;

    const updatedEmail: Email = {
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

  /*
   * Retry loading the email dataset.
   */
  const handleRetryLoad = () => {
    setError("");
    setLoading(true);

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
  };

  /*
   * Loading state.
   */
  if (loading || policiesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-400" />
          </div>

          <h1 className="text-lg font-semibold text-zinc-100">
            Loading approval queue...
          </h1>

          <p className="mt-1 text-sm text-zinc-600">
            Preparing emails and policy context
          </p>
        </div>
      </div>
    );
  }

  /*
   * Error state.
   */
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center shadow-2xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            !
          </div>

          <h1 className="mt-4 text-lg font-semibold text-zinc-100">
            {error}
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            We couldn't load the email queue. Please try again.
          </p>

          <button
            type="button"
            onClick={handleRetryLoad}
            className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400/40"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /*
   * Email detail screen.
   */
  if (selectedEmail) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <EmailDetail
            key={selectedEmail.id}
            email={selectedEmail}
            policy={selectedPolicy}
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

  /*
   * Queue screen.
   */
  return (
    <div className="min-h-screen bg-zinc-950">
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

        {filteredEmails.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl shadow-black/10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-500">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="6.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M16 16L20 20"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-zinc-100">
              No emails found
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              No emails match your current search and filters.
            </p>

            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              {search.trim() && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800"
                >
                  Clear Search
                </button>
              )}

              {(priorityFilter !== "all" ||
                riskFilter !== "all" ||
                statusFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setPriorityFilter("all");
                    setRiskFilter("all");
                    setStatusFilter("all");
                  }}
                  className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <EmailList
            emails={filteredEmails}
            onSelectEmail={setSelectedEmail}
          />
        )}
      </main>
    </div>
  );
}

export default App;