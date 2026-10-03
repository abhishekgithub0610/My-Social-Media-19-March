"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BsArrowDownUp,
  BsCheck2,
  BsDownload,
  BsPlus,
  BsSearch,
  BsTrash,
} from "react-icons/bs";
import {
  createThinkingSession,
  createThoughtNode,
  deleteThinkingSession,
  getThinkingSession,
  getThinkingSessions,
  rateThoughtNode,
  updateThoughtNode,
} from "@/features/thinking-ide/services/thinkingApi";
import type {
  CreateThoughtNode,
  ThoughtKind,
  ThoughtNode,
  ThinkingSession,
} from "@/features/thinking-ide/types";
import styles from "./ThinkingWorkspace.module.scss";

type TreeNode = ThoughtNode & { children: TreeNode[] };
const EMPTY_NODES: ThoughtNode[] = [];

function buildTree(nodes: ThoughtNode[]): TreeNode[] {
  const byId = new Map<string, TreeNode>();
  nodes.forEach((node) => byId.set(node.id, { ...node, children: [] }));
  const roots: TreeNode[] = [];

  byId.forEach((node) => {
    const parent = node.parentId ? byId.get(node.parentId) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  });

  const sortChildren = (branch: TreeNode) => {
    branch.children.sort(
      (left, right) =>
        new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
    );
    branch.children.forEach(sortChildren);
  };
  roots.forEach(sortChildren);
  return roots;
}

function toExportTree(nodes: ThoughtNode[], parentId: string | null = null) {
  return nodes
    .filter((node) => node.parentId === parentId)
    .sort(
      (left, right) =>
        new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
    )
    .map((node) => ({
      id: node.id,
      type: node.kind,
      content: node.content,
      status: node.status,
      score: node.score,
      createdAt: node.createdAt,
      updatedAt: node.updatedAt,
      children: toExportTree(nodes, node.id),
    }));
}

function mostRecentlyUpdated(nodes: ThoughtNode[]) {
  return [...nodes].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  )[0]?.id;
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function ThinkingWorkspace() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [initialQuestion, setInitialQuestion] = useState("");
  const [contentDraft, setContentDraft] = useState("");
  const [statusDraft, setStatusDraft] = useState<ThoughtNode["status"]>("open");
  const [scoreDraft, setScoreDraft] = useState("");
  const [draftNodeId, setDraftNodeId] = useState<string | null>(null);
  const [branchKind, setBranchKind] = useState<ThoughtKind>("question");
  const [branchDraft, setBranchDraft] = useState("");
  const [error, setError] = useState("");

  const sessionsQuery = useQuery({
    queryKey: ["thinking-sessions", search],
    queryFn: () => getThinkingSessions(search.trim()),
  });
  const sessionQuery = useQuery({
    queryKey: ["thinking-session", activeSessionId],
    queryFn: () => getThinkingSession(activeSessionId!),
    enabled: Boolean(activeSessionId),
  });
  const session = sessionQuery.data;
  const nodes = session?.nodes ?? EMPTY_NODES;
  const tree = useMemo(() => buildTree(nodes), [nodes]);
  const selectedNode =
    nodes.find((node) => node.id === activeNodeId) ??
    (session ? nodes.find((node) => node.id === mostRecentlyUpdated(nodes)) : undefined);
  const contentValue =
    draftNodeId === selectedNode?.id ? contentDraft : selectedNode?.content ?? "";
  const statusValue =
    draftNodeId === selectedNode?.id ? statusDraft : selectedNode?.status ?? "open";
  const scoreValue =
    draftNodeId === selectedNode?.id
      ? scoreDraft
      : selectedNode?.score == null
        ? ""
        : String(selectedNode.score);

  const refreshSession = async (sessionId: string) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["thinking-sessions"] }),
      queryClient.invalidateQueries({ queryKey: ["thinking-session", sessionId] }),
    ]);
  };

  const createSessionMutation = useMutation({
    mutationFn: createThinkingSession,
    onSuccess: async (created) => {
      setError("");
      setShowCreateForm(false);
      setNewTitle("");
      setInitialQuestion("");
      setActiveSessionId(created.id);
      setActiveNodeId(null);
      await queryClient.invalidateQueries({ queryKey: ["thinking-sessions"] });
    },
    onError: (mutationError) =>
      setError(errorMessage(mutationError, "Session could not be created.")),
  });

  const deleteSessionMutation = useMutation({
    mutationFn: deleteThinkingSession,
    onSuccess: async (_result, deletedId) => {
      if (activeSessionId === deletedId) {
        setActiveSessionId(null);
        setActiveNodeId(null);
      }
      await queryClient.invalidateQueries({ queryKey: ["thinking-sessions"] });
    },
    onError: (mutationError) =>
      setError(errorMessage(mutationError, "Session could not be deleted.")),
  });

  const createNodeMutation = useMutation({
    mutationFn: ({ sessionId, payload }: { sessionId: string; payload: CreateThoughtNode }) =>
      createThoughtNode(sessionId, payload),
    onSuccess: async (created, variables) => {
      setBranchDraft("");
      setActiveNodeId(created.id);
      setCollapsedIds((current) => {
        const next = new Set(current);
        next.delete(variables.payload.parentId);
        return next;
      });
      await refreshSession(variables.sessionId);
    },
    onError: (mutationError) =>
      setError(errorMessage(mutationError, "Branch could not be added.")),
  });

  const saveNodeMutation = useMutation({
    mutationFn: ({
      sessionId,
      nodeId,
      content,
      status,
    }: {
      sessionId: string;
      nodeId: string;
      content: string;
      status: ThoughtNode["status"];
    }) => updateThoughtNode(sessionId, nodeId, { content, status }),
    onSuccess: async (_result, variables) => {
      setError("");
      await refreshSession(variables.sessionId);
    },
    onError: (mutationError) =>
      setError(errorMessage(mutationError, "Thought could not be saved.")),
  });

  const rateNodeMutation = useMutation({
    mutationFn: ({
      sessionId,
      nodeId,
      score,
    }: {
      sessionId: string;
      nodeId: string;
      score: number | null;
      previousScore: number | null;
    }) => rateThoughtNode(sessionId, nodeId, score),
    onSuccess: async (_result, variables) => {
      setError("");
      await refreshSession(variables.sessionId);
    },
    onError: (mutationError, variables) => {
      setScoreDraft(
        variables.previousScore == null ? "" : String(variables.previousScore),
      );
      setError(errorMessage(mutationError, "Rating could not be saved."));
    },
  });

  const highestByParent = useMemo(() => {
    const groups = new Map<string, ThoughtNode[]>();
    nodes.forEach((node) => {
      const key = node.parentId ?? "__root__";
      groups.set(key, [...(groups.get(key) ?? []), node]);
    });
    const result = new Set<string>();
    groups.forEach((siblings) => {
      if (siblings.length < 2) return;
      const rated = siblings.filter((node) => node.score !== null);
      const highest = Math.max(...rated.map((node) => node.score!));
      if (rated.length && highest >= 0) {
        rated.filter((node) => node.score === highest).forEach((node) => result.add(node.id));
      }
    });
    return result;
  }, [nodes]);

  const selectSession = (sessionId: string) => {
    setError("");
    setActiveSessionId(sessionId);
    setActiveNodeId(null);
    setDraftNodeId(null);
  };

  const handleExport = (current: ThinkingSession) => {
    const payload = {
      id: current.id,
      title: current.title,
      createdAt: current.createdAt,
      updatedAt: current.updatedAt,
      nodes: toExportTree(current.nodes),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${current.title.trim().replace(/[^a-z0-9-_]+/gi, "-") || "thinking-session"}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const renderTreeNode = (node: TreeNode) => {
    const expanded = !collapsedIds.has(node.id);
    const isTopRated = highestByParent.has(node.id);
    return (
      <li className={styles.treeItem} key={node.id}>
        <div className={styles.treeRow}>
          {node.children.length > 0 ? (
            <button
              type="button"
              className={styles.collapseButton}
              aria-label={`${expanded ? "Collapse" : "Expand"} branches`}
              onClick={() =>
                setCollapsedIds((current) => {
                  const next = new Set(current);
                  if (next.has(node.id)) next.delete(node.id);
                  else next.add(node.id);
                  return next;
                })
              }
            >
              {expanded ? "-" : "+"}
            </button>
          ) : (
            <span className={styles.treeSpacer} />
          )}
          <button
            type="button"
            aria-current={activeNodeId === node.id ? "true" : undefined}
            className={`${styles.nodeCard} ${activeNodeId === node.id ? styles.selectedNode : ""}`}
            onClick={() => setActiveNodeId(node.id)}
          >
            <span className={styles.nodeMeta}>
              <span className={node.kind === "question" ? styles.questionTag : styles.answerTag}>
                {node.kind}
              </span>
              <span className={node.status === "resolved" ? styles.resolvedTag : styles.openTag}>
                {node.status}
              </span>
              {isTopRated && <span className={styles.topTag}>Top rated branch</span>}
              <span className={styles.scoreTag}>
                {node.score === null ? "Not rated" : `${node.score}/10`}
              </span>
            </span>
            <span className={styles.nodeText}>{node.content}</span>
          </button>
        </div>
        {node.children.length > 0 && expanded && (
          <ul className={styles.treeChildren}>{node.children.map(renderTreeNode)}</ul>
        )}
      </li>
    );
  };

  return (
    <section className={styles.workspace} aria-label="Thinking IDE">
      <aside className={styles.sessionRail}>
        <header className={styles.railHeader}>
          <div>
            <p className={styles.eyebrow}>THINKING SPACE</p>
            <h1>Thinking IDE</h1>
          </div>
          <button
            className={styles.iconButton}
            type="button"
            aria-label="Start a session"
            title="Start a session"
            onClick={() => setShowCreateForm((show) => !show)}
          >
            <BsPlus size={20} />
          </button>
        </header>

        {showCreateForm && (
          <form
            className={styles.createForm}
            onSubmit={(event) => {
              event.preventDefault();
              setError("");
              createSessionMutation.mutate({ title: newTitle.trim(), initialQuestion: initialQuestion.trim() });
            }}
          >
            <label htmlFor="session-title">Session title</label>
            <input
              id="session-title"
              maxLength={120}
              required
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              placeholder="A problem to think through"
            />
            <label htmlFor="initial-question">Initial question</label>
            <textarea
              id="initial-question"
              maxLength={5000}
              required
              rows={3}
              value={initialQuestion}
              onChange={(event) => setInitialQuestion(event.target.value)}
              placeholder="What are you trying to understand?"
            />
            <button className={styles.primaryButton} disabled={createSessionMutation.isPending}>
              {createSessionMutation.isPending ? "Creating…" : "Create session"}
            </button>
          </form>
        )}

        <label className={styles.searchBox}>
          <BsSearch aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search sessions"
            aria-label="Search sessions by title"
          />
        </label>

        <div className={styles.sessionList}>
          {sessionsQuery.isPending ? (
            <p className={styles.muted}>Loading sessions...</p>
          ) : sessionsQuery.isError ? (
            <p className={styles.inlineError}>Sessions could not be loaded.</p>
          ) : sessionsQuery.data?.length ? (
            [...sessionsQuery.data]
              .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
              .map((item) => (
                <div className={`${styles.sessionItem} ${activeSessionId === item.id ? styles.activeSession : ""}`} key={item.id}>
                  <button type="button" onClick={() => selectSession(item.id)}>
                    <strong>{item.title}</strong>
                    <span>{item.nodeCount} thoughts - {new Date(item.updatedAt).toLocaleDateString()}</span>
                  </button>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    title="Delete session"
                    aria-label={`Delete ${item.title}`}
                    disabled={deleteSessionMutation.isPending}
                    onClick={() => {
                      if (window.confirm(`Delete "${item.title}" and all its thoughts? This cannot be undone.`)) {
                        setError("");
                        deleteSessionMutation.mutate(item.id);
                      }
                    }}
                  >
                    <BsTrash aria-hidden="true" />
                  </button>
                </div>
              ))
          ) : (
            <div className={styles.emptySessions}>
              <strong>{search ? "No matches" : "No sessions yet"}</strong>
              <span>{search ? "Try another title." : "Start with a question worth exploring."}</span>
            </div>
          )}
        </div>
      </aside>

      <div className={styles.thinkingArea}>
        {error && <div className={styles.errorBanner} role="alert">{error}</div>}
        {!activeSessionId ? (
          <div className={styles.welcomeState}>
            <span className={styles.welcomeMark}><BsArrowDownUp aria-hidden="true" /></span>
            <p className={styles.eyebrow}>MAKE ROOM FOR A BETTER QUESTION</p>
            <h2>Follow an idea where it leads.</h2>
            <p>Create a private session, branch questions and answers, and keep useful thoughts rated and close at hand.</p>
            <button className={styles.primaryButton} onClick={() => setShowCreateForm(true)}>
              <BsPlus aria-hidden="true" /> New thinking session
            </button>
          </div>
        ) : sessionQuery.isPending ? (
          <div className={styles.loadingState}>Loading your session...</div>
        ) : sessionQuery.isError ? (
          <div className={styles.loadingState} role="alert">This session could not be opened. It may have been deleted or access denied.</div>
        ) : session ? (
          <>
            <header className={styles.sessionHeader}>
              <div>
                <p className={styles.eyebrow}>SESSION</p>
                <h2>{session.title}</h2>
              </div>
              <button className={styles.secondaryButton} type="button" onClick={() => handleExport(session)}>
                <BsDownload aria-hidden="true" /> <span>Export JSON</span>
              </button>
            </header>
            <div className={styles.editorGrid}>
              <section className={styles.treePanel} aria-label="Thought branches">
                <div className={styles.panelHeading}>
                  <div><h3>Branch map</h3><span>{nodes.length} thoughts</span></div>
                </div>
                {tree.length ? (
                  <ul className={styles.treeRoot}>{tree.map(renderTreeNode)}</ul>
                ) : (
                  <p className={styles.muted}>This session has no thoughts yet.</p>
                )}
              </section>

              <aside className={styles.detailPanel} aria-label="Selected thought details">
                {selectedNode ? (
                  <>
                    <div className={styles.panelHeading}>
                      <div><h3>Thought details</h3><span>{selectedNode.kind}</span></div>
                      <span className={styles.updatedNote}>Updated {new Date(selectedNode.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <form
                      className={styles.detailForm}
                      onSubmit={(event) => {
                        event.preventDefault();
                        if (!activeSessionId || !selectedNode || !contentValue.trim()) return;
                        setError("");
                        saveNodeMutation.mutate({
                          sessionId: activeSessionId,
                          nodeId: selectedNode.id,
                          content: contentValue.trim(),
                          status: statusValue,
                        });
                      }}
                    >
                      <label htmlFor="thought-content">Content</label>
                      <textarea
                        id="thought-content"
                        value={contentValue}
                        maxLength={5000}
                        rows={7}
                        onChange={(event) => {
                          setDraftNodeId(selectedNode.id);
                          setContentDraft(event.target.value);
                        }}
                      />
                      <div className={styles.statusLine}>
                        <span>Status</span>
                        <button
                          type="button"
                          className={styles.statusToggle}
                          aria-pressed={statusValue === "resolved"}
                          onClick={() => {
                            setDraftNodeId(selectedNode.id);
                            setStatusDraft(statusValue === "resolved" ? "open" : "resolved");
                          }}
                        >
                          {statusValue === "resolved" ? <BsCheck2 aria-hidden="true" /> : null}
                          {statusValue === "resolved" ? "Resolved" : "Open"}
                        </button>
                      </div>
                      <button
                        className={styles.primaryButton}
                        disabled={saveNodeMutation.isPending || !contentValue.trim()}
                      >
                          {saveNodeMutation.isPending ? "Saving..." : "Save thought"}
                      </button>
                    </form>

                    <div className={styles.ratingSection}>
                      <label htmlFor="thought-score">Score</label>
                      <select
                        id="thought-score"
                        value={scoreValue}
                        disabled={rateNodeMutation.isPending}
                        onChange={(event) => {
                          setDraftNodeId(selectedNode.id);
                          setScoreDraft(event.target.value);
                          if (!activeSessionId || !selectedNode) return;
                          const score = event.target.value === "" ? null : Number(event.target.value);
                          rateNodeMutation.mutate({
                            sessionId: activeSessionId,
                            nodeId: selectedNode.id,
                            score,
                            previousScore: selectedNode.score,
                          });
                        }}
                      >
                        <option value="">Not rated</option>
                        {Array.from({ length: 11 }, (_, score) => (
                          <option key={score} value={score}>{score} / 10</option>
                        ))}
                      </select>
                      <small>Ratings are compared only with sibling branches.</small>
                    </div>

                    <form
                      className={styles.branchForm}
                      onSubmit={(event) => {
                        event.preventDefault();
                        if (!activeSessionId || !selectedNode || !branchDraft.trim()) return;
                        setError("");
                        createNodeMutation.mutate({
                          sessionId: activeSessionId,
                          payload: { parentId: selectedNode.id, kind: branchKind, content: branchDraft.trim() },
                        });
                      }}
                    >
                      <h4>Add a branch</h4>
                      <div className={styles.kindPicker} role="group" aria-label="Branch type">
                        {(["question", "answer"] as ThoughtKind[]).map((kind) => (
                          <button
                            type="button"
                            key={kind}
                            aria-pressed={branchKind === kind}
                            className={branchKind === kind ? styles.kindSelected : ""}
                            onClick={() => setBranchKind(kind)}
                          >
                            {kind === "question" ? "? Question" : "Answer"}
                          </button>
                        ))}
                      </div>
                      <textarea
                        aria-label="New branch content"
                        value={branchDraft}
                        maxLength={5000}
                        rows={3}
                        onChange={(event) => setBranchDraft(event.target.value)}
                        placeholder={branchKind === "question" ? "What follows from this?" : "Add a possible answer..."}
                      />
                      <button className={styles.secondaryButton} disabled={createNodeMutation.isPending || !branchDraft.trim()}>
                        <BsPlus aria-hidden="true" /> {createNodeMutation.isPending ? "Adding..." : "Add branch"}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className={styles.noSelection}>Choose a thought to inspect it, edit it, or add a branch.</div>
                )}
              </aside>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}