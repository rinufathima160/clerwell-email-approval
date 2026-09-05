export interface Sender {
  name: string;
  email: string;
}

export interface ThreadMessage {
  from: string;
  at: string;
  body: string;
}

export interface AIAnalysis {
  intent: string;
  confidence: number;
  sentiment: string;
  riskLevel: string;
  policyId: string;
  recommendedAction: string;
  rationale: string;
  missingInformation: string[];
}

export interface Audit {
  aiWorker: string;
  generatedAt: string;
  modelVersion: string;
}

export interface Policy {
  id: string;
  name: string;
  category: string;
  summary: string;
  requiresHumanApproval: boolean;
  riskFlags: string[];
}

export interface Email {
  id: string;
  queuePosition: number;
  status: string;
  priority: string;
  labels: string[];
  sender: Sender;
  subject: string;
  receivedAt: string;
  thread: ThreadMessage[];
  aiAnalysis: AIAnalysis;
  draftResponse: string;
  allowedActions: string[];
  audit: Audit;
}