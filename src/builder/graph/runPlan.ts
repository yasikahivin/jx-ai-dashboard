import { BuilderGraphNode, ExecuteNodeFn, GraphPlan } from "./types";

interface RunOptions {
  parallel?: boolean;
}

export const runGraphPlan = async (
  nodes: BuilderGraphNode[],
  plan: GraphPlan,
  executeNode: ExecuteNodeFn,
  options: RunOptions = {}
): Promise<Record<string, unknown>> => {
  const outputs: Record<string, unknown> = {};
  const nodeById = new Map(nodes.map((node) => [node.id, node]));

  for (const stage of plan.stages) {
    const runnableNodes = stage.nodeIds
      .map((nodeId) => nodeById.get(nodeId))
      .filter((node): node is BuilderGraphNode => Boolean(node));

    const runNode = async (node: BuilderGraphNode) => {
      const inputs = (plan.deps[node.id] ?? []).map((depId) => outputs[depId]);
      const result = await executeNode(node, { inputs, outputs });
      outputs[node.id] = result;
    };

    if (options.parallel) {
      await Promise.all(runnableNodes.map((node) => runNode(node)));
    } else {
      for (const node of runnableNodes) {
        await runNode(node);
      }
    }
  }

  return outputs;
};
