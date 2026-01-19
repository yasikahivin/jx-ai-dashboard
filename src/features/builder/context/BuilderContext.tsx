import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
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
  selectedEdgeId: string | null;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  selectNode: (nodeId: string | null) => void;
  selectEdge: (edgeId: string | null) => void;
  updateNodeData: (nodeId: string, data: Partial<BuilderNodeData>) => void;
  addNode: (node: Node<BuilderNodeData>) => void;
  deleteSelected: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
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
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const historyRef = useRef<Array<{ nodes: Node<BuilderNodeData>[]; edges: Edge[] }>>([]);
  const futureRef = useRef<Array<{ nodes: Node<BuilderNodeData>[]; edges: Edge[] }>>([]);
  const isRestoringRef = useRef(false);

  const cloneSnapshot = useCallback(
    (snapshotNodes: Node<BuilderNodeData>[], snapshotEdges: Edge[]) => ({
      nodes: snapshotNodes.map((node) => ({
        ...node,
        position: { ...node.position },
        data: { ...node.data },
      })),
      edges: snapshotEdges.map((edge) => ({ ...edge })),
    }),
    []
  );

  const recordHistory = useCallback(() => {
    if (isRestoringRef.current) {
      return;
    }
    historyRef.current.push(cloneSnapshot(nodes, edges));
    futureRef.current = [];
    setCanUndo(historyRef.current.length > 0);
    setCanRedo(false);
  }, [cloneSnapshot, edges, nodes]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      recordHistory();
      setNodes((current) => applyNodeChanges(changes, current));
    },
    [recordHistory, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      recordHistory();
      setEdges((current) => applyEdgeChanges(changes, current));
    },
    [recordHistory, setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      recordHistory();
      setEdges((current) => addEdge(connection, current));
    },
    [recordHistory, setEdges]
  );

  const selectNode = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
    if (nodeId) {
      setSelectedEdgeId(null);
    }
  }, []);

  const selectEdge = useCallback((edgeId: string | null) => {
    setSelectedEdgeId(edgeId);
    if (edgeId) {
      setSelectedNodeId(null);
    }
  }, []);

  const updateNodeData = useCallback(
    (nodeId: string, data: Partial<BuilderNodeData>) => {
      recordHistory();
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
    [recordHistory]
  );

  const addNode = useCallback((node: Node<BuilderNodeData>) => {
    recordHistory();
    setNodes((current) => [...current, node]);
  }, [recordHistory]);

  const deleteSelected = useCallback(() => {
    if (!selectedNodeId && !selectedEdgeId) {
      return;
    }
    recordHistory();
    if (selectedNodeId) {
      setNodes((current) => current.filter((node) => node.id !== selectedNodeId));
      setEdges((current) =>
        current.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId)
      );
      setSelectedNodeId(null);
    }
    if (selectedEdgeId) {
      setEdges((current) => current.filter((edge) => edge.id !== selectedEdgeId));
      setSelectedEdgeId(null);
    }
  }, [recordHistory, selectedEdgeId, selectedNodeId]);

  const undo = useCallback(() => {
    const snapshot = historyRef.current.pop();
    if (!snapshot) {
      return;
    }
    futureRef.current.push(cloneSnapshot(nodes, edges));
    isRestoringRef.current = true;
    setNodes(snapshot.nodes);
    setEdges(snapshot.edges);
    isRestoringRef.current = false;
    setCanUndo(historyRef.current.length > 0);
    setCanRedo(futureRef.current.length > 0);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, [cloneSnapshot, edges, nodes]);

  const redo = useCallback(() => {
    const snapshot = futureRef.current.pop();
    if (!snapshot) {
      return;
    }
    historyRef.current.push(cloneSnapshot(nodes, edges));
    isRestoringRef.current = true;
    setNodes(snapshot.nodes);
    setEdges(snapshot.edges);
    isRestoringRef.current = false;
    setCanUndo(historyRef.current.length > 0);
    setCanRedo(futureRef.current.length > 0);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, [cloneSnapshot, edges, nodes]);

  const value = useMemo(
    () => ({
      nodes,
      edges,
      selectedNodeId,
      selectedEdgeId,
      onNodesChange,
      onEdgesChange,
      onConnect,
      selectNode,
      selectEdge,
      updateNodeData,
      addNode,
      deleteSelected,
      undo,
      redo,
      canUndo,
      canRedo,
      setNodes,
    }),
    [
      nodes,
      edges,
      selectedNodeId,
      selectedEdgeId,
      onNodesChange,
      onEdgesChange,
      onConnect,
      selectNode,
      selectEdge,
      updateNodeData,
      addNode,
      deleteSelected,
      undo,
      redo,
      canUndo,
      canRedo,
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
