import { Edge, Node } from "reactflow";
import { BuilderNodeData } from "../../features/builder/types";

export type CompileErrorCode =
  | "NO_START_NODE"
  | "DANGLING_EDGE"
  | "UNKNOWN_NODE"
  | "CYCLE_DETECTED"
  | "UNREACHABLE_NODE";

export interface CompileError {
  code: CompileErrorCode;
  message: string;
  meta?: Record<string, unknown>;
}

export interface GraphPlan {
  stages: Array<{ stageIndex: number; nodeIds: string[] }>;
  ordered: string[];
  deps: Record<string, string[]>;
  outgoing: Record<string, string[]>;
  startNodeIds: string[];
  reachable: Set<string>;
}

export type CompileGraphResult =
  | { ok: true; plan: GraphPlan }
  | { ok: false; errors: CompileError[] };

export type BuilderGraphNode = Node<BuilderNodeData>;
export type BuilderGraphEdge = Edge;

export interface ExecuteNodeContext {
  inputs: unknown[];
  outputs: Record<string, unknown>;
}

export type ExecuteNodeFn = (node: BuilderGraphNode, ctx: ExecuteNodeContext) => Promise<unknown>;
