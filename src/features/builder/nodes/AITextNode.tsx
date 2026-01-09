import React from 'react';
import { Handle, Position } from 'reactflow';
import { AITextNodeData } from '../types';

interface AITextNodeProps {
  data: AITextNodeData;
}

const AITextNode: React.FC<AITextNodeProps> = ({ data }) => {
  return (
    <div className="builder-node ai-text">
      <div className="node-title">Generate Text</div>
      <div className="node-meta">
        {data.provider} | {data.model}
      </div>
      <div className="node-pill">AI Tool</div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default AITextNode;
