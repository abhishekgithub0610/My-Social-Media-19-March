import { useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { BsArrowDown, BsArrowUp, BsTrash } from "react-icons/bs";
import { templates } from "../services/fixtures";
import { questionTypes, type Book, type Question } from "../types";
import { validateBook } from "../validation";
import { QuestionFields } from "./QuestionFields";

export default function BookEditor({ initial, busy, save }: {
  initial: Book;
  busy: boolean;
  save: (book: Book) => void;
}) {
  const [book, setBook] = useState(initial);
  const [category, setCategory] = useState(Object.keys(templates)[0]);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");
  function add(prompt = "", type: Question["type"] = "short") {
    setBook({ ...book, questions: [...book.questions, { id: crypto.randomUUID(), prompt, type, required: false, options: [] }] });
  }
  function update(index: number, question: Question) {
    setBook({ ...book, questions: book.questions.map((current, i) => i === index ? question : current) });
  }
  function move(index: number, offset: number) {
    const questions = [...book.questions];
    [questions[index], questions[index + offset]] = [questions[index + offset], questions[index]];
    setBook({ ...book, questions });
  }
  function finish(status: Book["status"]) {
    const candidate = { ...book, status, title: book.title.trim(), description: book.description.trim(),
      questions: book.questions.map((q) => ({ ...q, prompt: q.prompt.trim(), options: q.options.map((option) => option.trim()) })) };
    const issue = validateBook(candidate);
    setError(issue ?? "");
    if (!issue) save(candidate);
  }
  return <Stack gap={3}>
    {preview ? <section><h3>{book.title || "Untitled slambook"}</h3><p>{book.description}</p>
      <QuestionFields questions={book.questions} answers={{}} /></section> : <>
      <Form.Group controlId="slambook-title"><Form.Label>Title</Form.Label>
        <Form.Control value={book.title} maxLength={100} onChange={(e) => setBook({ ...book, title: e.target.value })} />
      </Form.Group>
      <Form.Group controlId="slambook-description"><Form.Label>Description</Form.Label>
        <Form.Control as="textarea" rows={2} value={book.description} maxLength={500} onChange={(e) => setBook({ ...book, description: e.target.value })} />
      </Form.Group>
      <Form.Group controlId="slambook-template"><Form.Label>Question templates</Form.Label>
        <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
          {Object.keys(templates).map((name) => <option key={name}>{name}</option>)}
        </Form.Select>
        <Form.Text>{templates[category][0]}</Form.Text>
        <div className="mt-2 d-flex flex-wrap gap-2">
          <Button size="sm" variant="outline-primary" onClick={() => add(...templates[category])}>Add template question</Button>
          <Button size="sm" variant="outline-secondary" onClick={() => add()}>Add custom question</Button>
        </div>
      </Form.Group>
      {book.questions.map((question, index) => <fieldset className="border rounded p-3" key={question.id}>
        <legend className="float-none w-auto px-1 fs-6">Question {index + 1}</legend>
        <Stack gap={2}>
          <Form.Control aria-label={`Question ${index + 1} text`} placeholder="Write a question" value={question.prompt} maxLength={250}
            onChange={(e) => update(index, { ...question, prompt: e.target.value })} />
          <Form.Select aria-label={`Question ${index + 1} type`} value={question.type}
            onChange={(e) => update(index, { ...question, type: e.target.value as Question["type"] })}>
            {Object.entries(questionTypes).map(([type, label]) => <option value={type} key={type}>{label}</option>)}
          </Form.Select>
          {["single", "multiple"].includes(question.type) && <Form.Group controlId={`options-${question.id}`}>
            <Form.Label>Choices (one per line)</Form.Label>
            <Form.Control as="textarea" value={question.options.join("\n")} maxLength={1000}
              onChange={(e) => update(index, { ...question, options: e.target.value.split("\n") })} />
          </Form.Group>}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <Form.Check id={`required-${question.id}`} label="Required" checked={question.required}
              onChange={(e) => update(index, { ...question, required: e.target.checked })} />
            <div className="d-flex gap-1">
              <Button size="sm" variant="outline-secondary" aria-label={`Move question ${index + 1} up`} disabled={index === 0} onClick={() => move(index, -1)}><BsArrowUp /></Button>
              <Button size="sm" variant="outline-secondary" aria-label={`Move question ${index + 1} down`} disabled={index === book.questions.length - 1} onClick={() => move(index, 1)}><BsArrowDown /></Button>
              <Button size="sm" variant="outline-danger" aria-label={`Delete question ${index + 1}`}
                onClick={() => setBook({ ...book, questions: book.questions.filter(({ id }) => id !== question.id) })}><BsTrash /></Button>
            </div>
          </div>
        </Stack>
      </fieldset>)}
    </>}
    {error && <p role="alert" className="text-danger mb-0">{error}</p>}
    <div className="d-flex flex-wrap gap-2">
      <Button variant="outline-secondary" onClick={() => setPreview(!preview)}>{preview ? "Back to editing" : "Preview slambook"}</Button>
      <Button variant="outline-primary" disabled={busy} onClick={() => finish("draft")}>Save draft</Button>
      <Button disabled={busy} onClick={() => finish("ready")}>{busy ? "Saving…" : "Save as ready"}</Button>
    </div>
  </Stack>;
}
