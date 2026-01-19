import React from "react";
import { Handle, Position } from "reactflow";
import { StartNodeData } from "../types";

interface StartNodeProps {
  data: StartNodeData;
}

const StartNode: React.FC<StartNodeProps> = ({ data }) => {
  return (
    <div className="builder-node">
      <div className="node-title">{data.label}</div>
      <div className="node-pill">Starting Point</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default StartNode;
