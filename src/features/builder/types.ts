export type NodeKind = "start" | "prompt" | "ai_text" | "result";

export type Provider = "openai" | "gemini" | "mistral";

export interface StartNodeData {
  kind: "start";
  label: string;
}

export interface PromptNodeData {
  kind: "prompt";
  prompt: string;
}

export interface AITextNodeData {
  kind: "ai_text";
  provider: Provider;
  model: string;
  temperature: number;
}

export interface ResultNodeData {
  kind: "result";
  output: string;
}

export type BuilderNodeData =
  | StartNodeData
  | PromptNodeData
  | AITextNodeData
  | ResultNodeData;

export interface BuilderTool {
  id: string;
  label: string;
  nodeType: NodeKind;
}

export type ExecutionStatus = "idle" | "running" | "success" | "error";

export interface ExecutionState {
  status: ExecutionStatus;
  logs: string[];
  result: string | null;
}

export interface AITextConfig {
  provider: Provider;
  model: string;
  temperature: number;
}
