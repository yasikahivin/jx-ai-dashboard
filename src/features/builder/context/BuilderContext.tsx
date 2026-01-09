import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  Connection,
} from "reactflow";
import { BuilderNodeData } from "../types";

interface BuilderContextValue {
  nodes: Node<BuilderNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  selectNode: (nodeId: string | null) => void;
  updateNodeData: (nodeId: string, data: Partial<BuilderNodeData>) => void;
  addNode: (node: Node<BuilderNodeData>) => void;
  setNodes: React.Dispatch<React.SetStateAction<Node<BuilderNodeData>[]>>;
}

const BuilderContext = createContext<BuilderContextValue | undefined>(undefined);

const initialNodes: Node<BuilderNodeData>[] = [
  {
    id: "start",
    type: "start",
    position: { x: 80, y: 120 },
    data: { kind: "start", label: "Start" },
  },
  {
    id: "prompt",
    type: "prompt",
    position: { x: 300, y: 120 },
    data: { kind: "prompt", prompt: "Write a helpful answer to the user." },
  },
  {
    id: "ai_text",
    type: "ai_text",
    position: { x: 560, y: 120 },
    data: { kind: "ai_text", provider: "openai", model: "gpt-4o-mini", temperature: 0.7 },
  },
  {
    id: "result",
    type: "result",
    position: { x: 820, y: 120 },
    data: { kind: "result", output: "" },
  },
];

const initialEdges: Edge[] = [
  { id: "e-start-prompt", source: "start", target: "prompt" },
  { id: "e-prompt-ai", source: "prompt", target: "ai_text" },
  { id: "e-ai-result", source: "ai_text", target: "result" },
];

export const BuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<Node<BuilderNodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((current) => applyNodeChanges(changes, current));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((current) => applyEdgeChanges(changes, current));
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((current) => addEdge(connection, current));
    },
    [setEdges]
  );

  const selectNode = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
  }, []);

  const updateNodeData = useCallback(
    (nodeId: string, data: Partial<BuilderNodeData>) => {
      setNodes((current) =>
        current.map((node) => {
          if (node.id !== nodeId) {
            return node;
          }
          return {
            ...node,
            data: {
              ...node.data,
              ...data,
            } as BuilderNodeData,
          };
        })
      );
    },
    []
  );

  const addNode = useCallback((node: Node<BuilderNodeData>) => {
    setNodes((current) => [...current, node]);
  }, []);

  const value = useMemo(
    () => ({
      nodes,
      edges,
      selectedNodeId,
      onNodesChange,
      onEdgesChange,
      onConnect,
      selectNode,
      updateNodeData,
      addNode,
      setNodes,
    }),
    [
      nodes,
      edges,
      selectedNodeId,
      onNodesChange,
      onEdgesChange,
      onConnect,
      selectNode,
      updateNodeData,
      addNode,
      setNodes,
    ]
  );

  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
};

export const useBuilderContext = (): BuilderContextValue => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilderContext must be used within BuilderProvider");
  }
  return context;
};
