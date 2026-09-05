import { describe, expect, it, vi, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import ApprovalActions from "./ApprovalActions";

describe("ApprovalActions", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const defaultProps = {
    onApprove: vi.fn(),
    onReject: vi.fn(),
    onEscalate: vi.fn(),
    onRetry: vi.fn(),
    onEdit: vi.fn(),
    isEditing: false,
    draftResponse: "Test response",
    onDraftChange: vi.fn(),
    onSave: vi.fn(),
    onCancel: vi.fn(),
    allowedActions: [
      "approve_send",
      "reject",
      "escalate",
      "retry",
      "edit",
    ],
    status: "pending_review",
  };

  it("shows the available review actions", () => {
    render(<ApprovalActions {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: "Approve & Send" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Reject" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Escalate" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Retry AI Analysis" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Edit Response" })
    ).toBeInTheDocument();
  });

  it("requires reviewer guidance before retrying AI analysis", () => {
    const onRetry = vi.fn();

    render(
      <ApprovalActions
        {...defaultProps}
        onRetry={onRetry}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Retry AI Analysis",
      })
    );

    expect(
      screen.getByText("Ask AI Worker to Retry")
    ).toBeInTheDocument();

    const retryButtons = screen.getAllByRole("button", {
      name: "Retry AI Analysis",
    });

    expect(retryButtons).toHaveLength(2);
    expect(retryButtons[1]).toBeDisabled();
  });

  it("requires confirmation before approving", () => {
    const onApprove = vi.fn();

    render(
      <ApprovalActions
        {...defaultProps}
        onApprove={onApprove}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Approve & Send",
      })
    );

    expect(
      screen.getByText("Approve & Send this email?")
    ).toBeInTheDocument();

    expect(onApprove).not.toHaveBeenCalled();
  });
});