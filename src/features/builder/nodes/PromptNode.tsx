import React from "react";
import { Handle, Position } from "reactflow";
import { PromptNodeData } from "../types";

interface PromptNodeProps {
  data: PromptNodeData;
}

const PromptNode: React.FC<PromptNodeProps> = ({ data }) => {
  return (
    <div className="builder-node prompt">
      <div className="node-title">Enter Prompt</div>
      <div className="node-meta">{data.prompt}</div>
      <div className="node-pill">Tool: OpenAI | ChatGPT V5</div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default PromptNode;
