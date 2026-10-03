import { baseClient } from "@/shared/api/baseClient";
import type { ApiResponseResult } from "@/types/api";
import type {
  CreateThinkingSession,
  CreateThoughtNode,
  ThoughtNode,
  ThinkingSession,
  ThinkingSessionSummary,
} from "@/features/thinking-ide/types";

const sessionsPath = "/thinking/sessions";

export async function getThinkingSessions(
  search: string,
): Promise<ThinkingSessionSummary[]> {
  const response = await baseClient.get<
    ApiResponseResult<ThinkingSessionSummary[]>
  >(sessionsPath, { params: search ? { search } : undefined });
  return response.data.result ?? [];
}

export async function getThinkingSession(
  sessionId: string,
): Promise<ThinkingSession> {
  const response = await baseClient.get<ApiResponseResult<ThinkingSession>>(
    `${sessionsPath}/${sessionId}`,
  );
  if (!response.data.result) throw new Error("Session data was not returned.");
  return response.data.result;
}

export async function createThinkingSession(
  payload: CreateThinkingSession,
): Promise<ThinkingSessionSummary> {
  const response = await baseClient.post<
    ApiResponseResult<ThinkingSessionSummary>
  >(sessionsPath, payload);
  if (!response.data.result) throw new Error("Session was not created.");
  return response.data.result;
}

export async function deleteThinkingSession(sessionId: string): Promise<void> {
  await baseClient.delete(`${sessionsPath}/${sessionId}`);
}

export async function createThoughtNode(
  sessionId: string,
  payload: CreateThoughtNode,
): Promise<ThoughtNode> {
  const response = await baseClient.post<ApiResponseResult<ThoughtNode>>(
    `${sessionsPath}/${sessionId}/nodes`,
    payload,
  );
  if (!response.data.result) throw new Error("Branch was not created.");
  return response.data.result;
}

export async function updateThoughtNode(
  sessionId: string,
  nodeId: string,
  payload: { content?: string; status?: ThoughtNode["status"] },
): Promise<void> {
  await baseClient.patch(
    `${sessionsPath}/${sessionId}/nodes/${nodeId}`,
    payload,
  );
}

export async function rateThoughtNode(
  sessionId: string,
  nodeId: string,
  score: number | null,
): Promise<void> {
  await baseClient.put(`${sessionsPath}/${sessionId}/nodes/${nodeId}/rating`, {
    score,
  });
}
