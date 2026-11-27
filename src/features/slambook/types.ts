export const questionTypes = {
  short: "Short text",
  long: "Long text",
  single: "Single choice",
  multiple: "Multiple choice",
  rating: "Rating",
} as const;

export type Question = {
  id: string;
  prompt: string;
  type: keyof typeof questionTypes;
  required: boolean;
  options: string[];
};

export type Book = {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  questions: Question[];
  status: "draft" | "ready";
};

export type Person = { id: string; name: string; avatar?: string };
export type Connection = Person & { eligible: boolean };
export type Answers = Record<string, string | string[]>;
export type Invitation = {
  id: string;
  book: Book;
  senderId: string;
  recipientId: string;
  message: string;
  sentAt: string;
  status: "pending" | "declined" | "cancelled" | "completed";
  submittedAt?: string;
  draftSavedAt?: string;
  answers: Answers;
};

export type Notebook = {
  books: Book[];
  invitations: Invitation[];
};

export type NotebookAction =
  | { type: "save"; book: Book }
  | { type: "send"; bookId: string; recipientIds: string[]; message: string }
  | { type: "cancel" | "decline"; invitationId: string }
  | { type: "draft" | "submit"; invitationId: string; answers: Answers };
