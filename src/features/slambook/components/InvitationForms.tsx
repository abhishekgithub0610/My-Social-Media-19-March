import { useState } from "react";
import { Button, Form, ProgressBar, Stack } from "react-bootstrap";
import { BsLock } from "react-icons/bs";
import type { Answers, Invitation, Person } from "../types";
import { hasAnswer, validateAnswers } from "../validation";
import { AnswerPages, QuestionFields } from "./QuestionFields";

export function SendForm({ contacts, preselected, unavailable, busy, send }: {
  contacts: Person[];
  preselected?: string;
  unavailable: Set<string>;
  busy: boolean;
  send: (ids: string[], message: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<string[]>(preselected && contacts.some(({ id }) => id === preselected) && !unavailable.has(preselected) ? [preselected] : []);
  const matches = contacts.filter(({ name }) => name.toLowerCase().includes(search.trim().toLowerCase()));
  return <Stack gap={3}>
    <Form.Control type="search" aria-label="Search eligible friends" placeholder="Search eligible friends" value={search} onChange={(e) => setSearch(e.target.value)} />
    <fieldset>
      <legend className="fs-6">Friends</legend>
      {!matches.length && <p className="text-body-secondary">No eligible friends match your search.</p>}
      {matches.map(({ id, name }) => <Form.Check key={id} id={`recipient-${id}`} checked={selected.includes(id)} disabled={unavailable.has(id)}
        label={unavailable.has(id) ? `${name} (already invited)` : name}
        onChange={(e) => setSelected(e.target.checked ? [...selected, id] : selected.filter((entry) => entry !== id))} />)}
    </fieldset>
    <Form.Group controlId="invitation-message"><Form.Label>Personal message (optional)</Form.Label>
      <Form.Control as="textarea" maxLength={500} rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
    </Form.Group>
    <Button disabled={busy || selected.length === 0} onClick={() => send(selected, message)}>
      {busy ? "Sending…" : `Send invitation${selected.length === 1 ? "" : "s"} (${selected.length})`}
    </Button>
  </Stack>;
}

export function ResponseForm({ item, busy, sender, save }: {
  item: Invitation;
  busy: boolean;
  sender: Person;
  save: (answers: Answers, submit: boolean) => void;
}) {
  const [answers, setAnswers] = useState(item.answers);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");
  const { questions } = item.book;
  const answered = questions.filter(({ id }) => hasAnswer(answers[id])).length;
  function review() {
    const issue = validateAnswers(questions, answers, true);
    setError(issue ?? "");
    if (!issue) setPreview(true);
  }
  return <Stack gap={3}>
    <p className="mb-0"><BsLock aria-hidden /> Your submitted answers are shared with {sender.name}.</p>
    <div>
      <div className="small mb-1">{answered} of {questions.length} answered</div>
      <ProgressBar aria-label="Answering progress" now={answered} max={questions.length} />
    </div>
    {preview ? <AnswerPages questions={questions} answers={answers} /> :
      <QuestionFields questions={questions} answers={answers} onAnswer={busy ? undefined : (id, value) => setAnswers({ ...answers, [id]: value })} />}
    {error && <p className="text-danger mb-0" role="alert">{error}</p>}
    <div className="d-flex flex-wrap gap-2">
      <Button variant="outline-secondary" disabled={busy} onClick={() => save(answers, false)}>Save answer draft</Button>
      {preview ? <>
        <Button variant="outline-primary" disabled={busy} onClick={() => setPreview(false)}>Back to answers</Button>
        <Button disabled={busy} onClick={() => save(answers, true)}>{busy ? "Submitting…" : "Submit answers"}</Button>
      </> : <Button disabled={busy} onClick={review}>Review answers</Button>}
    </div>
  </Stack>;
}
