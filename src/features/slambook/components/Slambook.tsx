"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Alert, Badge, Button, Container, Form, Modal, Spinner } from "react-bootstrap";
import { BsBook, BsHeart, BsInbox, BsJournal, BsLock, BsPencil, BsPlusLg, BsSend } from "react-icons/bs";
import { useAuthStore } from "@/features/account/store/authStore";
import { useNotebook } from "../hooks/useNotebook";
import { connections } from "../services/fixtures";
import type { Book, Invitation, NotebookAction, Person } from "../types";
import BookEditor from "./BookEditor";
import { ResponseForm, SendForm } from "./InvitationForms";
import { AnswerPages } from "./QuestionFields";
import styles from "./slambook.module.css";

const sections = {
  books: ["My Slambooks", BsBook],
  received: ["Received Requests", BsInbox],
  sent: ["Sent Requests", BsSend],
  completed: ["Completed Responses", BsHeart],
  drafts: ["Drafts", BsPencil],
} as const;
type Section = keyof typeof sections;
type Panel =
  | { type: "edit"; book: Book; recipientId?: string }
  | { type: "choose"; recipientId: string }
  | { type: "send"; book: Book; recipientId?: string }
  | { type: "invitation"; item: Invitation }
  | { type: "confirm"; item: Invitation; action: "cancel" | "decline" };

const date = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });
const displayDate = (value: string) => date.format(new Date(value));

function Loading() {
  return <div role="status" className="placeholder-glow p-4">
    <span className="visually-hidden">Loading slambooks</span>
    <span className="placeholder col-7 mb-3" aria-hidden />
    <span className="placeholder col-12 mb-2" aria-hidden />
    <span className="placeholder col-9" aria-hidden />
  </div>;
}

function Avatar({ person }: { person: Person }) {
  return person.avatar ? <Image src={person.avatar} alt="" width={36} height={36} className={styles.avatar} unoptimized /> :
    <span className={styles.avatar} aria-hidden>{person.name.slice(0, 1)}</span>;
}

function Notebook({ account, actor }: { account: Person; actor: Person }) {
  const { notebook, contacts, change } = useNotebook(account, actor.id);
  const [section, setSection] = useState<Section>("books");
  const [panel, setPanel] = useState<Panel>();
  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState("all");
  const [notice, setNotice] = useState("");
  const people = [account, ...connections];
  const person = (id: string) => people.find((entry) => entry.id === id) ?? { id, name: "Connection" };

  if (notebook.isPending || contacts.isPending) return <Loading />;
  if (notebook.isError || contacts.isError) return <Alert variant="danger">
    The notebook could not be loaded. <Button size="sm" variant="outline-danger" onClick={() => { void notebook.refetch(); void contacts.refetch(); }}>Try again</Button>
  </Alert>;

  const { books, invitations } = notebook.data;
  const received = invitations.filter((item) => item.recipientId === actor.id);
  const sent = invitations.filter((item) => item.senderId === actor.id);
  const completed = invitations.filter(({ status }) => status === "completed");
  const answerDrafts = received.filter((item) => item.status === "pending" && item.draftSavedAt);
  const drafts = books.filter(({ status }) => status === "draft");
  const ready = books.filter(({ status }) => status === "ready");
  const pending = received.filter(({ status }) => status === "pending").length;
  const latest = received[0];
  const counts = { books: ready.length, received: pending, sent: sent.length, completed: completed.length, drafts: drafts.length + answerDrafts.length };
  const matchingCompleted = completed.filter((item) => {
    const inbound = item.recipientId === actor.id;
    const other = person(inbound ? item.senderId : item.recipientId);
    return (direction === "all" || (direction === "mine") === inbound) &&
      [other.name, item.book.title].some((value) => value.toLowerCase().includes(search.trim().toLowerCase()));
  });

  function open(next: Panel) {
    change.reset();
    setPanel(next);
  }
  function create(recipientId?: string) {
    open({ type: "edit", recipientId, book: { id: crypto.randomUUID(), ownerId: actor.id, title: "", description: "", questions: [], status: "draft" } });
  }
  function commit(action: NotebookAction, message: string, next: Section, nextPanel?: Panel) {
    if (change.isPending) return;
    change.mutate(action, { onSuccess: () => {
      setPanel(nextPanel);
      setNotice(message);
      setSection(next);
    } });
  }

  function bookCard(book: Book) {
    return <article key={book.id} className={styles.card}>
      <div className={styles.bookIcon}><BsBook aria-hidden /></div>
      <h3>{book.title}</h3>
      {book.description && <p>{book.description}</p>}
      <div className={styles.cardFooter}>
        <small>{book.questions.length} questions</small>
        <div className="d-flex flex-wrap gap-2">
          <Button size="sm" variant="outline-secondary" onClick={() => open({ type: "edit", book })}>{book.status === "draft" ? "Resume editing" : "Edit"}</Button>
          {book.status === "ready" && <Button size="sm" variant="outline-primary" onClick={() => open({ type: "send", book })}>Invite friends</Button>}
        </div>
      </div>
    </article>;
  }

  function invitationCard(item: Invitation) {
    const inbound = item.recipientId === actor.id;
    const other = person(inbound ? item.senderId : item.recipientId);
    return <article key={item.id} className={styles.card}>
      <div className="d-flex align-items-center gap-2 mb-3">
        <Avatar person={other} />
        <div className="flex-grow-1"><strong>{other.name}</strong><div className="small">{inbound ? "From" : "To"} · {displayDate(item.submittedAt ?? item.sentAt)}</div></div>
        <Badge bg={item.status === "completed" ? "success" : "secondary"} className="text-capitalize">{item.status}</Badge>
      </div>
      <h3>{item.book.title}</h3>
      {item.book.description && <p>{item.book.description}</p>}
      {item.message && <blockquote className={styles.note}>{item.message}</blockquote>}
      <div className={styles.cardFooter}>
        <small>{item.book.questions.length} questions</small>
        <Button size="sm" variant="outline-primary" onClick={() => open({ type: "invitation", item })}>
          {item.status === "completed" ? "Read response" : inbound && item.status === "pending" ? "Open invitation" : "View details"}
        </Button>
      </div>
    </article>;
  }

  const cards = section === "books" ? ready.map(bookCard) : section === "drafts" ? [...drafts.map(bookCard), ...answerDrafts.map(invitationCard)] :
    (section === "received" ? received : section === "sent" ? sent : matchingCompleted).map(invitationCard);
  const item = panel && "item" in panel ? panel.item : undefined;
  const modalTitle = panel?.type === "edit" ? "Edit slambook" : panel?.type === "send" ? `Invite friends · ${panel.book.title}` :
    panel?.type === "choose" ? "Choose a slambook to send" : panel?.type === "confirm" ?
      panel.action === "cancel" ? "Cancel this invitation?" : "Decline this invitation?" : item?.book.title;

  return <>
    <section className={styles.hero} aria-labelledby="slambook-title-heading">
      <div className={styles.heroContent}>
        <h1 id="slambook-title-heading">Slambook</h1>
        <p>Make a little book of questions, share it with a friend, and keep the stories they write back.</p>
        <Button className={styles.createButton} onClick={() => create()}><BsPlusLg aria-hidden /> Create new slambook</Button>
      </div>
      <div className={styles.heroArt}>
        <Image src="/slambook/woodland-friends.webp" alt="" fill sizes="(max-width: 700px) 100vw, 570px" priority />
      </div>
    </section>
    <aside className={styles.activity} aria-label="Slambook activity">
      <span><BsInbox aria-hidden /> {pending} pending {pending === 1 ? "invitation" : "invitations"}</span>
      <span><BsHeart aria-hidden /> {completed.length} completed</span>
      {latest && <button type="button" onClick={() => open({ type: "invitation", item: latest })}>Latest from {person(latest.senderId).name} <span aria-hidden>→</span></button>}
    </aside>

    <nav aria-label="Slambook sections" className={styles.navigation}>
      {Object.entries(sections).map(([key, [label, Icon]]) => <button key={key} type="button" aria-current={key === section ? "page" : undefined}
        onClick={() => setSection(key as Section)}><Icon aria-hidden /> {label} <span>{counts[key as Section]}</span></button>)}
    </nav>
    {notice && <Alert variant="success" dismissible onClose={() => setNotice("")} role="status">{notice}</Alert>}

    <section aria-labelledby="slambook-section">
      <h2 id="slambook-section" className={styles.sectionTitle}>{sections[section][0]}</h2>
      {section === "completed" && <div className={styles.filters}>
        <Form.Control type="search" aria-label="Search by friend or slambook" placeholder="Search by friend or slambook"
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <Form.Select aria-label="Response direction" value={direction} onChange={(e) => setDirection(e.target.value)}>
          <option value="all">All responses</option><option value="friends">From friends</option><option value="mine">My submissions</option>
        </Form.Select>
      </div>}
      {cards.length ? <div className={styles.grid}>{cards}</div> : <div className={styles.empty}>
        <span className={styles.emptyIcon}><BsJournal aria-hidden /></span>
        <p>{section === "completed" && (search || direction !== "all") ? "No responses match these filters." : {
          books: "Your ready-to-send slambooks will appear here.",
          drafts: "Saved slambooks and partially answered invitations will appear here.",
          received: "Invitations from friends will appear here.",
          sent: "Invitations you send will appear here.",
          completed: "Submitted answers will appear here.",
        }[section]}</p>
        {section === "books" && <Button variant="outline-primary" size="sm" onClick={() => create()}>Start a slambook</Button>}
      </div>}
    </section>

    <Modal show={Boolean(panel)} onHide={() => !change.isPending && setPanel(undefined)} size="lg" scrollable dialogClassName={styles.dialog}
      backdrop={change.isPending ? "static" : true} keyboard={!change.isPending} aria-labelledby="notebook-modal-title">
      <Modal.Header closeButton={!change.isPending}><Modal.Title id="notebook-modal-title" as="h2">{modalTitle}</Modal.Title></Modal.Header>
      <Modal.Body aria-busy={change.isPending}>
        {change.isError && <Alert variant="danger">{change.error.message}</Alert>}
        {panel?.type === "edit" && <BookEditor key={panel.book.id} initial={panel.book} busy={change.isPending}
          save={(book) => commit(
            { type: "save", book },
            book.status === "draft" ? "Slambook draft saved." : "Slambook ready to send.",
            book.status === "draft" ? "drafts" : "books",
            book.status === "ready" && panel.recipientId ? { type: "send", book, recipientId: panel.recipientId } : undefined,
          )} />}
        {panel?.type === "choose" && <div className="d-flex flex-column align-items-start gap-2">
          {ready.map((book) => <Button key={book.id} variant="outline-primary" onClick={() => open({ type: "send", book, recipientId: panel.recipientId })}>{book.title}</Button>)}
          <Button variant={ready.length ? "link" : "primary"} onClick={() => create(panel.recipientId)}>Create a slambook</Button>
        </div>}
        {panel?.type === "send" && <SendForm key={panel.book.id} contacts={contacts.data} preselected={panel.recipientId}
          unavailable={new Set(sent.filter((entry) => entry.book.id === panel.book.id && ["pending", "completed"].includes(entry.status)).map(({ recipientId }) => recipientId))}
          busy={change.isPending} send={(recipientIds, message) => commit(
            { type: "send", bookId: panel.book.id, recipientIds, message }, "Invitation sent.", "sent")} />}
        {panel?.type === "invitation" && item && <>
          <p className="mb-1">{item.book.description}</p>
          <p className="small text-body-secondary">{person(item.senderId).name} invited {person(item.recipientId).name} on {displayDate(item.sentAt)} · {item.book.questions.length} questions · {item.status}</p>
          {item.message && <blockquote className={styles.note}>{item.message}</blockquote>}
          {item.status === "completed" && <>
            <p className="small"><BsLock aria-hidden /> Private memory · Answered by {person(item.recipientId).name} on {displayDate(item.submittedAt ?? item.sentAt)}</p>
            <AnswerPages questions={item.book.questions} answers={item.answers} />
          </>}
          {item.status === "pending" && item.recipientId === actor.id && <ResponseForm key={item.id} item={item}
            sender={person(item.senderId)} busy={change.isPending}
            save={(answers, submit) => commit({ type: submit ? "submit" : "draft", invitationId: item.id, answers },
              submit ? "Your answers were submitted." : "Answer draft saved.", submit ? "completed" : "drafts")} />}
          <div className="d-flex flex-wrap gap-2 mt-3">
            {item.status === "pending" && <Button variant="outline-danger" disabled={change.isPending}
              onClick={() => open({ type: "confirm", item, action: item.senderId === actor.id ? "cancel" : "decline" })}>
              {item.senderId === actor.id ? "Cancel invitation" : "Decline invitation"}
            </Button>}
            {item.recipientId === actor.id && <Button variant="outline-primary" disabled={change.isPending}
              onClick={() => open({ type: "choose", recipientId: item.senderId })}>Send a slambook back</Button>}
          </div>
        </>}
        {panel?.type === "confirm" && <>
          <p>{panel.action === "cancel" ? "The recipient will no longer be able to answer." : "The sender will see that you declined. Any saved answers for this invitation will be cleared."}</p>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" disabled={change.isPending} onClick={() => open({ type: "invitation", item: panel.item })}>Go back</Button>
            <Button variant="danger" disabled={change.isPending} onClick={() => commit(
              { type: panel.action, invitationId: panel.item.id },
              panel.action === "cancel" ? "Invitation cancelled." : "Invitation declined.",
              panel.action === "cancel" ? "sent" : "received")}>
              {change.isPending ? <Spinner size="sm" aria-label="Saving" /> : panel.action === "cancel" ? "Cancel invitation" : "Decline invitation"}
            </Button>
          </div>
        </>}
      </Modal.Body>
    </Modal>
  </>;
}

function DemoNotebook({ account }: { account: Person }) {
  const [demoId, setDemoId] = useState("");
  const actor = connections.find(({ id }) => id === demoId) ?? account;
  return <>
    <div className={styles.demo}>
      <Link href="/feed" className="text-decoration-none">← Back to feed</Link>
      <Form.Group controlId="slambook-demo" className="d-flex align-items-center gap-2">
        <Form.Label className="mb-0">Demo profile</Form.Label>
        <Form.Select size="sm" value={demoId} onChange={(event) => setDemoId(event.target.value)} aria-describedby="slambook-demo-note">
          <option value="">My account</option>
          {connections.filter(({ eligible }) => eligible).map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
        </Form.Select>
      </Form.Group>
    </div>
    <p id="slambook-demo-note" className="small text-body-secondary">Demo invitations and answers are stored in this browser. Switch profiles to try both sides of an invitation.</p>
    <Notebook key={actor.id} account={account} actor={actor} />
  </>;
}

export default function Slambook() {
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.isHydrated);
  return <Container className={styles.shell}>
    {!hydrated ? <Loading /> : user ? <DemoNotebook key={user.id} account={{ id: user.id, name: user.name || "My account", avatar: user.avatar }} /> :
      <Alert variant="info"><Link href="/sign-in">Sign in</Link> to open your slambook.</Alert>}
  </Container>;
}
