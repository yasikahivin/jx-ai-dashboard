import { executeGraphFlow, ExecuteGraphPayload } from "../../../api/execute";
import { AITextConfig, BuilderNodeData } from "../types";
import { Edge, Node } from "reactflow";

export interface RuntimeInputs {
  prompt: string;
  aiTextConfig: AITextConfig;
}

export interface RunWorkflowParams {
  nodes: Node<BuilderNodeData>[];
  edges: Edge[];
  runtimeInputs: RuntimeInputs;
}

const buildGraphPayload = (nodes: Node<BuilderNodeData>[], edges: Edge[], runtimeInputs: RuntimeInputs): ExecuteGraphPayload => ({
  nodes: nodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: node.data as Record<string, unknown>,
  })),
  edges: edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
  })),
  runtimeInputs,
});

export interface RunWorkflowResult {
  output: string;
  threadId: string;
}

export async function runWorkflow({ nodes, edges, runtimeInputs }: RunWorkflowParams): Promise<RunWorkflowResult> {
  const payload = buildGraphPayload(nodes, edges, runtimeInputs);
  return executeGraphFlow(payload, runtimeInputs.aiTextConfig);
}
