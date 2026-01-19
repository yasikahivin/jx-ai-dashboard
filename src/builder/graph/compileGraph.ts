import { BuilderGraphEdge, BuilderGraphNode, CompileError, CompileGraphResult, GraphPlan } from "./types";

const buildAdjacency = (nodes: BuilderGraphNode[], edges: BuilderGraphEdge[]) => {
  const deps: Record<string, string[]> = {};
  const outgoing: Record<string, string[]> = {};

  nodes.forEach((node) => {
    deps[node.id] = [];
    outgoing[node.id] = [];
  });

  edges.forEach((edge) => {
    if (!edge.source || !edge.target) {
      return;
    }
    if (!deps[edge.target]) {
      deps[edge.target] = [];
    }
    if (!outgoing[edge.source]) {
      outgoing[edge.source] = [];
    }
    deps[edge.target].push(edge.source);
    outgoing[edge.source].push(edge.target);
  });

  return { deps, outgoing };
};

const buildReachable = (startNodeIds: string[], outgoing: Record<string, string[]>): Set<string> => {
  const reachable = new Set<string>();
  const queue = [...startNodeIds];

  while (queue.length) {
    const nodeId = queue.shift();
    if (!nodeId || reachable.has(nodeId)) {
      continue;
    }
    reachable.add(nodeId);
    const next = outgoing[nodeId] ?? [];
    next.forEach((neighbor) => {
      if (!reachable.has(neighbor)) {
        queue.push(neighbor);
      }
    });
  }

  return reachable;
};

const topoSortStages = (reachable: Set<string>, deps: Record<string, string[]>, outgoing: Record<string, string[]>) => {
  const indegree = new Map<string, number>();
  reachable.forEach((nodeId) => {
    indegree.set(nodeId, (deps[nodeId] ?? []).filter((dep) => reachable.has(dep)).length);
  });

  const stages: Array<{ stageIndex: number; nodeIds: string[] }> = [];
  const ordered: string[] = [];
  let stageIndex = 0;

  const queue = Array.from(indegree.entries())
    .filter(([, count]) => count === 0)
    .map(([nodeId]) => nodeId);

  while (queue.length) {
    queue.sort();
    const stageNodes = [...queue];
    queue.length = 0;

    stageNodes.forEach((nodeId) => {
      ordered.push(nodeId);
      const neighbors = outgoing[nodeId] ?? [];
      neighbors.forEach((neighbor) => {
        if (!reachable.has(neighbor)) {
          return;
        }
        const next = (indegree.get(neighbor) ?? 0) - 1;
        indegree.set(neighbor, next);
        if (next === 0) {
          queue.push(neighbor);
        }
      });
    });

    stages.push({ stageIndex, nodeIds: stageNodes });
    stageIndex += 1;
  }

  return { stages, ordered, indegree };
};

export const compileGraph = (nodes: BuilderGraphNode[], edges: BuilderGraphEdge[]): CompileGraphResult => {
  const errors: CompileError[] = [];
  const nodeIds = new Set(nodes.map((node) => node.id));
  const startNodeIds = nodes.filter((node) => node.data.kind === "start").map((node) => node.id);

  if (startNodeIds.length === 0) {
    errors.push({
      code: "NO_START_NODE",
      message: "Graph must include at least one start node.",
    });
  }

  edges.forEach((edge) => {
    if (!edge.source || !edge.target) {
      errors.push({
        code: "DANGLING_EDGE",
        message: "An edge is missing a source or target.",
        meta: { edgeId: edge.id },
      });
      return;
    }
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      errors.push({
        code: "UNKNOWN_NODE",
        message: "An edge references an unknown node.",
        meta: { edgeId: edge.id, source: edge.source, target: edge.target },
      });
    }
  });

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const { deps, outgoing } = buildAdjacency(nodes, edges);
  const reachable = buildReachable(startNodeIds, outgoing);

  nodes.forEach((node) => {
    if (!reachable.has(node.id)) {
      errors.push({
        code: "UNREACHABLE_NODE",
        message: "Node is not reachable from any start node.",
        meta: { nodeId: node.id },
      });
    }
  });

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const { stages, ordered, indegree } = topoSortStages(reachable, deps, outgoing);
  const remaining = Array.from(indegree.entries())
    .filter(([nodeId, count]) => count > 0 && reachable.has(nodeId))
    .map(([nodeId]) => nodeId);

  if (remaining.length > 0) {
    return {
      ok: false,
      errors: [
        {
          code: "CYCLE_DETECTED",
          message: "Cycle detected in reachable graph nodes.",
          meta: { remaining },
        },
      ],
    };
  }

  const plan: GraphPlan = {
    stages,
    ordered,
    deps,
    outgoing,
    startNodeIds,
    reachable,
  };

  return { ok: true, plan };
};
