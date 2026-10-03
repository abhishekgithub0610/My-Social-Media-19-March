export type ThoughtKind = "question" | "answer";
export type ThoughtStatus = "open" | "resolved";

export type ThoughtNode = {
  id: string;
  sessionId: string;
  parentId: string | null;
  kind: ThoughtKind;
  content: string;
  status: ThoughtStatus;
  score: number | null;
  createdAt: string;
  updatedAt: string;
};

export type ThinkingSessionSummary = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  nodeCount: number;
};

export type ThinkingSession = ThinkingSessionSummary & {
  nodes: ThoughtNode[];
};

export type CreateThinkingSession = {
  title: string;
  initialQuestion: string;
};

export type CreateThoughtNode = {
  parentId: string;
  kind: ThoughtKind;
  content: string;
};