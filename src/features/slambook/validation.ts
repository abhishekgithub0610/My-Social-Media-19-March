import type { Answers, Book, Question } from "./types";

export function validateBook(book: Book) {
  if (!book.title.trim()) return "Enter a title for your slambook.";
  if (book.status === "draft") return;
  if (!book.questions.length) return "Add at least one question before marking your slambook ready.";
  for (const [index, question] of book.questions.entries()) {
    if (!question.prompt.trim()) return `Enter text for question ${index + 1}.`;
    if (question.type === "single" || question.type === "multiple") {
      const options = question.options.map((option) => option.trim().toLowerCase());
      if (new Set(options).size !== options.length || options.length < 2 || options.includes("")) {
        return `Question ${index + 1} needs at least two distinct choices.`;
      }
    }
  }
}

export function hasAnswer(value: Answers[string] | undefined) {
  return Array.isArray(value) ? value.length > 0 : Boolean(value?.trim());
}

export function validateAnswers(questions: Question[], answers: Answers, submitting: boolean) {
  for (const [index, question] of questions.entries()) {
    const value = answers[question.id];
    if (!hasAnswer(value)) {
      if (submitting && question.required) return `Answer question ${index + 1} before submitting.`;
      continue;
    }
    if (question.type === "multiple") {
      if (!Array.isArray(value) || value.some((option) => !question.options.includes(option))) {
        return `Choose valid options for question ${index + 1}.`;
      }
    } else if (typeof value !== "string" ||
      (question.type === "single" && !question.options.includes(value)) ||
      (question.type === "rating" && !["1", "2", "3", "4", "5"].includes(value))) {
      return `Enter a valid answer for question ${index + 1}.`;
    }
  }
}
