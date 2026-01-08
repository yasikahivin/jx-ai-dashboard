import { AITextConfig } from "../features/builder/types";
import { createThread } from "./threads";
import { sendText } from "./chat";

export interface ExecuteTextFlowResponse {
  output: string;
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
