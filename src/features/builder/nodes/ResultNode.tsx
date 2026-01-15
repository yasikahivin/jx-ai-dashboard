import React from "react";
import { Handle, Position } from "reactflow";
import { ResultNodeData } from "../types";

interface ResultNodeProps {
  data: ResultNodeData;
}

const ResultNode: React.FC<ResultNodeProps> = ({ data }) => {
  return (
    <div className="builder-node result">
      <div className="node-title">Final Result</div>
      <div className="node-meta">{data.output || "Awaiting output..."}</div>
      <div className="node-pill">Result</div>
      <Handle type="target" position={Position.Left} />
    </div>
  );
};

export default ResultNode;
