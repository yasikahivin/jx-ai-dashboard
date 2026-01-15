import { apiRequest } from "./client";

export interface CreateThreadResponse {
  thread_id: string;
}

export async function createThread(): Promise<CreateThreadResponse> {
  // return apiRequest<CreateThreadResponse>("/api/chat/threads", {
  //   method: "POST",
  // });
  return { thread_id: 'test-thread-id' };
}
