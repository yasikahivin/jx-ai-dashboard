import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Node,
  ReactFlowInstance,
  OnSelectionChangeParams,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useBuilderContext } from '../context/BuilderContext';
import StartNode from '../nodes/StartNode';
import PromptNode from '../nodes/PromptNode';
import AITextNode from '../nodes/AITextNode';
import AIImageNode from '../nodes/AIImageNode';
import ResultNode from '../nodes/ResultNode';
import { BuilderNodeData } from '../types';

const nodeTypes = {
  start: StartNode,
  prompt: PromptNode,
  ai_text: AITextNode,
  ai_image: AIImageNode,
  result: ResultNode,
};

const Canvas: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectNode,
    selectEdge,
    addNode,
  } = useBuilderContext();
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) {
        return;
      }

      const bounds = event.currentTarget.getBoundingClientRect();
      const position = reactFlowInstance
        ? reactFlowInstance.project({
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top,
          })
        : { x: event.clientX - bounds.left, y: event.clientY - bounds.top };

      const nodeDataByType: Record<string, BuilderNodeData> = {
        ai_text: {
          kind: 'ai_text',
          provider: 'openai',
          model: 'gpt-4o-mini',
        },
        ai_image: {
          kind: 'ai_image',
          provider: 'openai',
          model: 'gpt-image-1',
          size: '1024x1024',
        },
      };

      const node: Node<BuilderNodeData> = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: nodeDataByType[type] ?? nodeDataByType.ai_text,
      };

      addNode(node);
    },
    [addNode, reactFlowInstance]
  );

  const onSelectionChange = useCallback(
    (params: OnSelectionChangeParams) => {
      const selectedNode = params.nodes[0];
      const selectedEdge = params.edges[0];
      selectNode(selectedNode ? selectedNode.id : null);
      selectEdge(selectedEdge ? selectedEdge.id : null);
    },
    [selectEdge, selectNode]
  );

  return (
    <div style={{ flex: 1, height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
      >
        <Background gap={18} size={1} color="#e2e8f0" variant="dots" />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Canvas;
