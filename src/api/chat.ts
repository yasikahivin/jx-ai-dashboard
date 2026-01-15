import { apiRequest } from "./client";
import { Provider } from "../features/builder/types";

export interface SendTextRequest {
  thread_id: string;
  provider: Provider;
  model: string;
  prompt: string;
}

export interface SendTextResponse {
  output?: string;
  assistant?: string;
  message?: string;
}

export async function sendText(request: SendTextRequest): Promise<SendTextResponse> {
  return apiRequest<SendTextResponse, SendTextRequest>("/api/chat/text?user_id=dev", {
    method: "POST",
    body: request,
  });
}
