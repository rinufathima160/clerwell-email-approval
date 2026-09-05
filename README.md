# Clerwell Email Approval Review

A responsive React + TypeScript interface for reviewing AI-analyzed customer emails before taking human approval actions.

The application simulates a human-in-the-loop email approval workflow where reviewers can inspect incoming email context, evaluate AI Worker analysis, edit generated responses, and approve, reject, escalate, or retry an AI analysis.

## Live Demo

[Clerwell Email Review — Live Demo](https://clerwell-email-approval.vercel.app/)

## Features

### Email Review Queue

- Loads the supplied mock email dataset.
- Displays sender, subject, labels, risk, confidence, and review status.
- Displays email timestamps within the conversation view.
- Search emails by subject, sender name, or sender email.
- Filter by priority, risk, and status.
- Displays the current queue count and position.

### Email Detail Review

- Full email subject and sender information.
- Conversation and thread history with timestamps.
- Labels and attachment / missing-evidence indicators.
### AI Worker Analysis

The AI Worker analysis provides structured information to help the reviewer evaluate the recommendation before taking action.

It includes:

- Intent
- Confidence
- Risk level
- Sentiment
- Governing policy
- Policy information
- Policy ID
- Policy category
- Policy conditions / risk flags
- Recommended action
- Rationale
- Missing information
- Model version
- Generated timestamp

The **Governing Policy** section displays the policy name and relevant policy information instead of exposing only a policy identifier. It also surfaces applicable policy conditions or risk flags and indicates when human approval is required.

For example, a refund request may be associated with:

- **Governing Policy:** Refund Policy 3.2
- **Policy ID:** refund-3.2
- **Category:** refunds
- **Policy information:** Standard purchases may be refunded to the original payment method within 30 days when eligibility checks pass.
- **Policy conditions / risk flags:** amount over 5000 INR, payment method mismatch, outside window
- **Human approval:** required

This gives the reviewer policy context alongside the AI recommendation rather than requiring the reviewer to interpret a policy ID alone.

### Draft Response

- View the AI-generated draft response.
- Edit the response before approval.
- Save draft changes locally in the browser.
- Clearly indicates unsaved changes.
- Warns the reviewer before navigating away with unsaved edits.

### Decision Actions

- Approve & Send
- Reject
- Escalate
- Edit Response
- Retry AI Analysis with reviewer guidance
- Confirmation dialogs for important decisions.
- Processing, success, and error states.
- Queue state updates after decisions.

### Accessibility & Responsive Design

- Semantic buttons, inputs, selects, labels, and sections.
- Keyboard-accessible controls.
- Visible focus states.
- Escape-key support for dialogs.
- Status announcements using ARIA live regions.
- Status and risk information is not communicated through colour alone.
- Responsive layouts for desktop and mobile widths.
- Touch-friendly controls and readable content at narrow widths.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- ESLint
- Browser `localStorage` for persisted reviewer changes
- JSON fixtures for mock email data

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

Install the project dependencies:

```bash
npm install
```

### Development

Start the Vite development server:

```bash
npm run dev
```

Then open the local URL shown in the terminal.

### Production Build

Create a production build:

```bash
npm run build
```

### Lint

Run ESLint:

```bash
npm run lint
```
## Testing

The project uses **Vitest** and **React Testing Library** for focused component testing.

Run the test suite with:

```bash
npm test

```
The current tests cover the ApprovalActions component:

- Verifies that all available review actions are    displayed.
- Verifies that AI retry requires reviewer guidance.
- Verifies that approval requires confirmation before onApprove is called.

Current test result:

Test Files: 1 passed
Tests: 3 passed

The tests are focused on critical reviewer interactions and can be expanded to cover additional workflows such as rejection, escalation, filtering, and unsaved draft protection.

## Project Structure

```text
src/
├── components/
│   ├── ApprovalActions.tsx
│   ├── EmailCard.tsx
│   ├── EmailDetail.tsx
|   ├── ApprovalActions.test.tsx
│   ├── EmailList.tsx
│   ├── Filters.tsx
│   └── Header.tsx
├── types/
│   └── email.ts
├── test/
│   └── setup.ts
├── App.tsx
└── index.css

public/
└── mock-data/
    └── emails.json
    └── policies.json

```

## Architecture

The application uses a simple component-based React architecture.

`App.tsx` owns the primary application state, including:

- Email data
- Selected email
- Search and filter state
- Approval, rejection, and escalation state changes
- Draft response updates
- AI retry updates
- Loading and error states

Reusable components handle specific areas of the interface:

- **Header** — queue title and email count
- **Filters** — search and filtering controls
- **EmailList** — renders the review queue
- **EmailCard** — individual queue item
- **EmailDetail** — detailed email review
- **ApprovalActions** — editing, approval, rejection, escalation, and retry workflows

The mock dataset is loaded from:

```text
/public/mock-data/emails.json
/public/mock-data/policies.json
```

Reviewer changes are persisted in browser `localStorage`, allowing draft edits and review decisions to remain available after a page refresh.

## Review Workflow

11. Reviewer opens the email approval queue.
2. Reviewer searches or filters emails if required.
3. Reviewer selects an email.
4. The email conversation and AI Worker analysis are reviewed.
5. The reviewer evaluates:
   - Governing policy
   - Policy information
   - Policy conditions / risk flags
   - Confidence
   - Risk level
   - Missing evidence
   - AI rationale
6. The reviewer can edit the generated draft response.
7. The reviewer can:
   - Approve & Send
   - Reject
   - Escalate
   - Retry the AI analysis with additional guidance
8. Important actions require confirmation.
9. The email status is updated locally after the action.
10. Unsaved draft changes trigger a warning before navigation.

## Risk & Review Considerations

The interface intentionally separates AI confidence from risk.

A high-confidence AI analysis does not automatically mean that an email is safe to approve. Reviewers are shown confidence, risk level, policy context, rationale, and missing information together so that decisions can account for potential financial, privacy, security, legal, or other risks.

Low-confidence analysis and missing policy context are explicitly surfaced for manual review.

Policy context is presented as part of the review decision rather than as a replacement for human judgment. The reviewer can see the governing policy, policy information, applicable conditions or risk flags, and whether human approval is required before taking an action.

## Data & Persistence

This project does not require a backend.

The supplied mock email dataset is used as the application fixture. Review actions and draft edits update React state and are persisted locally using browser `localStorage`.

This is a frontend simulation and does not send real emails or connect to an external AI service.

## Validation

The final implementation was validated with:

```bash
npm run lint
npm run build
npm test -- --run
```

The lint, production build, and automated test suite complete successfully.

## Trade-offs & Assumptions

### Trade-offs

- The application uses local React state and browser `localStorage` instead of a backend because the assignment does not require a real API or email delivery service.
- AI retry, approval, rejection, and escalation flows are simulated locally to demonstrate the reviewer experience and state transitions.
- The interface prioritizes review context and decision-making over adding unnecessary UI features or external dependencies.
- Automated testing is currently focused on the critical `ApprovalActions` reviewer workflows using Vitest and React Testing Library. Broader workflow coverage could be added with more time.

### Assumptions

- The supplied JSON dataset represents the available email review queue.
- Email timestamps displayed within the conversation are sufficient for communicating message timing and thread context.
- Approval, rejection, escalation, and retry actions are simulated and do not perform real email delivery or backend operations.
- Reviewer changes only need to persist locally in the browser.
- A reviewer should be able to make decisions using the email content, AI Worker analysis, policy information, risk level, confidence, and missing-evidence indicators provided by the fixture data.

## What I Would Improve With More Time

With additional time, I would:

- Expand automated test coverage to additional critical workflows such as rejection, escalation, filtering, and unsaved draft protection.
- Add more comprehensive error and failure simulations for action requests.
- Improve persistence with a more structured local data layer or backend integration if required.
- Add additional keyboard-navigation and accessibility testing with automated accessibility tooling.
- Add more detailed interaction analytics or reviewer activity history.
- Further refine mobile layouts and test them across a wider range of devices and screen sizes.

## Notes

This project focuses on the reviewer experience and human-in-the-loop decision workflow rather than implementing a production email delivery or AI backend.