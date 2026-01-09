import React from "react";
import { Handle, Position } from "reactflow";
import { AIImageNodeData } from "../types";

interface AIImageNodeProps {
  data: AIImageNodeData;
}

const AIImageNode: React.FC<AIImageNodeProps> = ({ data }) => {
  return (
    <div className="builder-node ai-image">
      <div className="node-title">Generate Image</div>
      <div className="node-meta">{data.provider} | {data.model}</div>
      <div className="node-meta">Size: {data.size}</div>
      <div className="node-pill">AI Tool</div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default AIImageNode;
