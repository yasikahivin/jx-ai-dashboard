import React from "react";
import { Handle, Position } from "reactflow";
import { StartNodeData } from "../types";

interface StartNodeProps {
  data: StartNodeData;
}

const StartNode: React.FC<StartNodeProps> = ({ data }) => {
  return (
    <div style={{ padding: 12, border: "1px solid #cbd5f5", borderRadius: 10, background: "#eef2ff" }}>
      <strong>{data.label}</strong>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default StartNode;
