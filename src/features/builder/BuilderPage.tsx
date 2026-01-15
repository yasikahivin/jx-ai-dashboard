import React, { useCallback, useEffect } from "react";
import Canvas from "./components/Canvas";
import ToolPanel from "./components/ToolPanel";
import NodeConfigDrawer from "./components/NodeConfigDrawer";
import ResultPanel from "./components/ResultPanel";
import { useBuilderContext } from "./context/BuilderContext";
import { useExecutionContext } from "./context/ExecutionContext";
import { runWorkflow } from "./engine/runner";
import { AITextNodeData, PromptNodeData } from "./types";
import "./builder.css";

const BuilderPage: React.FC = () => {
  const {
    nodes,
    edges,
    updateNodeData,
    deleteSelected,
    undo,
    redo,
    canUndo,
    canRedo,
    selectedNodeId,
    selectedEdgeId,
    selectNode,
  } = useBuilderContext();
  const { setStatus, addLog, setResult, reset } = useExecutionContext();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        if (selectedNodeId || selectedEdgeId) {
          deleteSelected();
        }
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteSelected, redo, selectedEdgeId, selectedNodeId, undo]);

  const handleEdit = useCallback(() => {
    if (!selectedNodeId) {
      const promptNode = nodes.find((node) => node.data.kind === "prompt");
      selectNode(promptNode ? promptNode.id : null);
    }
  }, [nodes, selectNode, selectedNodeId]);

  const handleRun = useCallback(async () => {
    // We clear previous execution state so the user only sees the latest run.
    reset();
    setStatus("running");
    addLog("Starting workflow execution.");

    const promptNode = nodes.find((node) => node.data.kind === "prompt");
    const aiTextNode = nodes.find((node) => node.data.kind === "ai_text");
    const resultNode = nodes.find((node) => node.data.kind === "result");

    if (!promptNode || !aiTextNode || !resultNode) {
      setStatus("error");
      addLog("Required nodes are missing from the canvas.");
      return;
    }

    const promptData = promptNode.data as PromptNodeData;
    const aiTextData = aiTextNode.data as AITextNodeData;

    try {
      addLog(`Sending graph with ${nodes.length} nodes and ${edges.length} edges to backend.`);
      const response = await runWorkflow({
        nodes,
        edges,
        runtimeInputs: {
          prompt: promptData.prompt,
          aiTextConfig: {
            provider: aiTextData.provider,
            model: aiTextData.model,
          },
        },
      });
      const mergedOutput = `Prompt:\n${promptData.prompt}\n\nOutput:\n${response.output}`;
      setResult(mergedOutput);
      updateNodeData(resultNode.id, { output: response.output });
      setStatus("success");
      addLog(`Workflow completed (thread ${response.threadId}).`);
    } catch (error) {
      setStatus("error");
      addLog(error instanceof Error ? error.message : "Unknown error occurred.");
    }
  }, [addLog, nodes, reset, setResult, setStatus, updateNodeData]);

  return (
    <div className="builder-shell">
      <aside className="builder-sidebar-left">
        <div className="builder-brand">
          <span className="builder-brand-mark" />
          Jxai
        </div>
        <div className="builder-nav">
          <div className="builder-nav-section">
            <div className="builder-nav-title">AI Tools</div>
            <div className="builder-nav-item primary">All Tools</div>
            <div className="builder-nav-item">Favorites</div>
            <div className="builder-nav-item">Popular</div>
          </div>
          <div className="builder-nav-section">
            <div className="builder-nav-title">Utilities</div>
            <div className="builder-nav-item">Templates</div>
            <div className="builder-nav-item">Marketplace</div>
          </div>
        </div>
        <div className="builder-upgrade">Upgrade</div>
      </aside>

      <div className="builder-main">
        <header className="builder-topbar">
          <div className="builder-topbar-title">Template Name</div>
          <div className="builder-topbar-actions">
            <button className="builder-button" onClick={undo} disabled={!canUndo}>
              Undo
            </button>
            <button className="builder-button" onClick={redo} disabled={!canRedo}>
              Redo
            </button>
            <button className="builder-button" onClick={handleEdit}>
              Edit
            </button>
            <button className="builder-button" onClick={deleteSelected}>
              Delete
            </button>
            <button className="builder-button primary" onClick={handleRun}>
              Run
            </button>
          </div>
        </header>
        <div className="builder-canvas">
          <Canvas />
        </div>
      </div>

      <aside className="builder-sidebar-right">
        <ToolPanel />
        <NodeConfigDrawer />
        <ResultPanel />
      </aside>
    </div>
  );
};

export default BuilderPage;
