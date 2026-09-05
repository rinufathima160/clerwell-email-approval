import { useEffect, useState } from "react";
import type { Email } from "./types/email";
import "./App.css";

function App() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return <h1>Loading emails...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
  
  <div className="app">
    <header className="header">
      <h1>Clerwell Email Approval</h1>
      <p>Human Approval Queue</p>
    </header>

    <main className="email-list">
      {emails.map((email) => (
        <div className="email-card" key={email.id}>
          
          <div className="email-number">
            #{email.queuePosition}
          </div>

          <div className="email-content">
            <div className="email-top">
              <h3>{email.subject}</h3>

              <span className={`priority ${email.priority}`}>
                {email.priority}
              </span>
            </div>

            <p className="sender">
              {email.sender.name} · {email.sender.email}
            </p>

            <div className="email-info">
              <span>
                Risk: {email.aiAnalysis.riskLevel}
              </span>

              <span>
                Confidence:{" "}
                {Math.round(email.aiAnalysis.confidence * 100)}%
              </span>

              <span>
                Status: {email.status}
              </span>
            </div>

            <div className="labels">
              {email.labels.map((label) => (
                <span key={label} className="label">
                  {label}
                </span>
              ))}
            </div>
          </div>

        </div>
      ))}
    </main>
  </div>
);
  
}

export default App;