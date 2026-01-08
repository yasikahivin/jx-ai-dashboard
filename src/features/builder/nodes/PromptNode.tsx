import React from "react";
import { Handle, Position } from "reactflow";
import { PromptNodeData } from "../types";

interface PromptNodeProps {
  data: PromptNodeData;
}

const PromptNode: React.FC<PromptNodeProps> = ({ data }) => {
  return (
    <div style={{ padding: 12, border: "1px solid #e2e8f0", borderRadius: 10, background: "#fff" }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Prompt</div>
      <div style={{ fontSize: 12, color: "#475569" }}>{data.prompt}</div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default PromptNode;
