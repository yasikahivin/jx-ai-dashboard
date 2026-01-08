import React, { useCallback } from "react";
import Canvas from "./components/Canvas";
import ToolPanel from "./components/ToolPanel";
import NodeConfigDrawer from "./components/NodeConfigDrawer";
import ResultPanel from "./components/ResultPanel";
import { useBuilderContext } from "./context/BuilderContext";
import { useExecutionContext } from "./context/ExecutionContext";
import { runWorkflow } from "./engine/runner";
import { AITextNodeData, PromptNodeData } from "./types";

const BuilderPage: React.FC = () => {
  const { nodes, updateNodeData } = useBuilderContext();
  const { setStatus, addLog, setResult, reset } = useExecutionContext();

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
      const output = await runWorkflow({
        prompt: promptData.prompt,
        aiTextConfig: {
          provider: aiTextData.provider,
          model: aiTextData.model,
          temperature: aiTextData.temperature,
        },
      });
      setResult(output);
      updateNodeData(resultNode.id, { output });
      setStatus("success");
      addLog("Workflow completed.");
    } catch (error) {
      setStatus("error");
      addLog(error instanceof Error ? error.message : "Unknown error occurred.");
    }
  }, [addLog, nodes, reset, setResult, setStatus, updateNodeData]);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f8fafc" }}>
      <div style={{ width: 48 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0", background: "#ffffff" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>Builder</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Design AI workflows visually.</div>
            </div>
            <button
              onClick={handleRun}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                background: "#1d4ed8",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Run
            </button>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex" }}>
          <Canvas />
        </div>
      </div>
      <div style={{ width: 320, borderLeft: "1px solid #e2e8f0", background: "#ffffff", display: "flex", flexDirection: "column" }}>
        <ToolPanel />
        <NodeConfigDrawer />
        <ResultPanel />
      </div>
    </div>
  );
};

export default BuilderPage;
