import { AITextConfig } from "../features/builder/types";
import { createThread } from "./threads";
import { sendText } from "./chat";

export interface ExecuteTextFlowResponse {
  output: string;
}

export interface GraphNodePayload {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

export interface GraphEdgePayload {
  id: string;
  source: string;
  target: string;
}

export interface ExecuteGraphPayload {
  nodes: GraphNodePayload[];
  edges: GraphEdgePayload[];
  runtimeInputs: Record<string, unknown>;
}

export interface ExecuteGraphFlowResponse {
  output: string;
  threadId: string;
}

const getOutputFromResponse = (response: { output?: string; assistant?: string; message?: string }): string => {
  // The backend responses vary by provider today, so we normalize to keep UI stable.
  if (response.output) {
    return response.output;
  }
  if (response.assistant) {
    return response.assistant;
  }
  if (response.message) {
    return response.message;
  }
  return "";
};

export async function executeTextFlow(
  prompt: string,
  config: AITextConfig
): Promise<ExecuteTextFlowResponse> {
  const thread = await createThread();
  const response = await sendText({
    thread_id: thread.thread_id,
    provider: config.provider,
    model: config.model,
    temperature: config.temperature,
    prompt,
  });

  return { output: getOutputFromResponse(response) };
}

const buildGraphPrompt = (payload: ExecuteGraphPayload): string => {
  // The backend only supports text endpoints, so we serialize the graph into a single prompt.
  return `Execute workflow graph with runtime inputs:\n${JSON.stringify(payload, null, 2)}`;
};

export async function executeGraphFlow(
  payload: ExecuteGraphPayload,
  config: AITextConfig
): Promise<ExecuteGraphFlowResponse> {
  const thread = await createThread();
  const response = await sendText({
    thread_id: thread.thread_id,
    provider: config.provider,
    model: config.model,
    temperature: config.temperature,
    prompt: buildGraphPrompt(payload),
  });

  return { output: getOutputFromResponse(response), threadId: thread.thread_id };
}
