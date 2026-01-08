import { executeTextFlow } from "../../../api/execute";
import { AITextConfig } from "../types";

export interface RunWorkflowParams {
  prompt: string;
  aiTextConfig: AITextConfig;
}

export async function runWorkflow({ prompt, aiTextConfig }: RunWorkflowParams): Promise<string> {
  const response = await executeTextFlow(prompt, aiTextConfig);
  return response.output;
}
