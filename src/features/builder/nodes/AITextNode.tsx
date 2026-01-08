import React from "react";
import { Handle, Position } from "reactflow";
import { AITextNodeData } from "../types";

interface AITextNodeProps {
  data: AITextNodeData;
}

const AITextNode: React.FC<AITextNodeProps> = ({ data }) => {
  return (
    <div style={{ padding: 12, border: "1px solid #bae6fd", borderRadius: 10, background: "#f0f9ff" }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>AI Text</div>
      <div style={{ fontSize: 12, color: "#0f172a" }}>{data.provider}</div>
      <div style={{ fontSize: 12, color: "#475569" }}>{data.model}</div>
      <div style={{ fontSize: 12, color: "#475569" }}>Temp: {data.temperature}</div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default AITextNode;
