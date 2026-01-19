export { compileGraph } from "./compileGraph";
export { runGraphPlan } from "./runPlan";
export type {
  BuilderGraphEdge,
  BuilderGraphNode,
  CompileError,
  CompileGraphResult,
  ExecuteNodeContext,
  ExecuteNodeFn,
  GraphPlan,
} from "./types";

/*
Example usage from a Run button:

const result = compileGraph(nodes, edges);
if (!result.ok) {
  setCompileErrors(result.errors);
  return;
}

const outputs = await runGraphPlan(
  nodes,
  result.plan,
  async (node, ctx) => executeNode(node, ctx),
  { parallel: true }
);
*/
