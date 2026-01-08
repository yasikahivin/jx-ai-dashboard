import React from "react";
import { Handle, Position } from "reactflow";
import { ResultNodeData } from "../types";

interface ResultNodeProps {
  data: ResultNodeData;
}

const ResultNode: React.FC<ResultNodeProps> = ({ data }) => {
  return (
    <div style={{ padding: 12, border: "1px solid #fbcfe8", borderRadius: 10, background: "#fdf2f8", minWidth: 200 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Result</div>
      <div style={{ fontSize: 12, color: "#475569" }}>{data.output || "Awaiting output..."}</div>
      <Handle type="target" position={Position.Left} />
    </div>
  );
};

export default ResultNode;
