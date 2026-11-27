import type { Notebook, NotebookAction, Person } from "../types";
import { validateAnswers, validateBook } from "../validation";
import { connections, seedNotebook } from "./fixtures";

function storageKey(account: Person) {
  return `slambook-demo:v1:${account.id}`;
}

function read(account: Person): Notebook {
  const saved = localStorage.getItem(storageKey(account));
  return saved ? JSON.parse(saved) : seedNotebook(account);
}

function ensure(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export const notebookService = {
  async get(account: Person, actorId: string) {
    const notebook = read(account);
    return {
      books: notebook.books.filter((book) => book.ownerId === actorId),
      invitations: notebook.invitations
        .filter((item) => item.senderId === actorId || item.recipientId === actorId)
        .map((item) => item.recipientId === actorId || item.status === "completed"
          ? item
          : { ...item, answers: {}, draftSavedAt: undefined }),
    };
  },

  async getConnections(account: Person, actorId: string) {
    return [...connections, { ...account, eligible: true }].filter((person) => person.id !== actorId && person.eligible);
  },

  async change(account: Person, actorId: string, action: NotebookAction) {
    const notebook = read(account);
    if (action.type === "save") {
      const { book } = action;
      ensure(book.ownerId === actorId, "This slambook belongs to another person.");
      const previous = notebook.books.find(({ id }) => id === book.id);
      ensure(!previous || previous.ownerId === actorId, "This slambook belongs to another person.");
      const error = validateBook(book);
      ensure(!error, error ?? "");
      notebook.books = [book, ...notebook.books.filter(({ id }) => id !== book.id)];
    } else if (action.type === "send") {
      const book = notebook.books.find(({ id, ownerId }) => id === action.bookId && ownerId === actorId);
      ensure(book?.status === "ready", "Mark your slambook ready before sending it.");
      const recipients = [...new Set(action.recipientIds)];
      const eligible = [...connections, { ...account, eligible: true }];
      ensure(recipients.length, "Select at least one friend.");
      for (const id of recipients) {
        ensure(id !== actorId && eligible.some((person) => person.id === id && person.eligible), "A selected friend can no longer receive invitations.");
        ensure(!notebook.invitations.some((item) => item.book.id === book.id &&
          item.recipientId === id && ["pending", "completed"].includes(item.status)),
        "A selected friend already has a pending or completed invitation for this slambook.");
      }
      for (const recipientId of recipients) {
        notebook.invitations.unshift({
          id: crypto.randomUUID(), book, recipientId, senderId: actorId,
          message: action.message.trim(), sentAt: new Date().toISOString(), status: "pending", answers: {},
        });
      }
    } else {
      const item = notebook.invitations.find(({ id }) => id === action.invitationId);
      ensure(item?.status === "pending", "This invitation is no longer pending.");
      if (action.type === "cancel") {
        ensure(item.senderId === actorId, "Only the sender can cancel.");
        item.status = "cancelled";
        item.answers = {};
        delete item.draftSavedAt;
      } else {
        ensure(item.recipientId === actorId, "Only the recipient can update this invitation.");
        if (action.type === "decline") {
          item.status = "declined";
          item.answers = {};
          delete item.draftSavedAt;
        } else if ("answers" in action) {
          const error = validateAnswers(item.book.questions, action.answers, action.type === "submit");
          ensure(!error, error ?? "");
          item.answers = action.answers;
          if (action.type === "submit") {
            item.status = "completed";
            item.submittedAt = new Date().toISOString();
            delete item.draftSavedAt;
          } else {
            item.draftSavedAt = new Date().toISOString();
          }
        }
      }
    }
    // Each mock mutation reads and writes synchronously within this tab.
    localStorage.setItem(storageKey(account), JSON.stringify(notebook));
  },
};
