import React, { useMemo } from 'react';
import { useBuilderContext } from '../context/BuilderContext';
import { AIImageNodeData, AITextNodeData, PromptNodeData } from '../types';

const NodeConfigDrawer: React.FC = () => {
  const { nodes, selectedNodeId, updateNodeData } = useBuilderContext();

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId]
  );

  if (!selectedNode) {
    return (
      <div className="panel-section">
        <div className="panel-title">Node Configuration</div>
        <div style={{ color: '#64748b', fontSize: 13 }}>
          Select a node to edit its settings.
        </div>
      </div>
    );
  }

  const data = selectedNode.data;

  return (
    <div className="panel-section">
      <div className="panel-title">Node Configuration</div>
      {data.kind === 'prompt' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 12, color: '#475569' }}>Prompt</label>
          <textarea
            value={(data as PromptNodeData).prompt}
            onChange={(event) =>
              updateNodeData(selectedNode.id, { prompt: event.target.value })
            }
            style={{
              minHeight: 80,
              padding: 8,
              borderRadius: 8,
              border: '1px solid #cbd5f5',
            }}
          />
        </div>
      )}
      {data.kind === 'ai_text' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ fontSize: 12, color: '#475569' }}>Provider</label>
          <select
            value={(data as AITextNodeData).provider}
            onChange={(event) =>
              updateNodeData(selectedNode.id, {
                provider: event.target.value as AITextNodeData['provider'],
              })
            }
            style={{ padding: 8, borderRadius: 8, border: '1px solid #cbd5f5' }}
          >
            <option value="openai">openai</option>
            <option value="gemini">gemini</option>
            <option value="mistral">mistral</option>
          </select>
          <label style={{ fontSize: 12, color: '#475569' }}>Model</label>
          <input
            value={(data as AITextNodeData).model}
            onChange={(event) =>
              updateNodeData(selectedNode.id, { model: event.target.value })
            }
            style={{ padding: 8, borderRadius: 8, border: '1px solid #cbd5f5' }}
          />
        </div>
      )}
      {data.kind === 'ai_image' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ fontSize: 12, color: '#475569' }}>Provider</label>
          <select
            value={(data as AIImageNodeData).provider}
            onChange={(event) =>
              updateNodeData(selectedNode.id, {
                provider: event.target.value as AIImageNodeData['provider'],
              })
            }
            style={{ padding: 8, borderRadius: 8, border: '1px solid #cbd5f5' }}
          >
            <option value="openai">openai</option>
            <option value="gemini">gemini</option>
            <option value="mistral">mistral</option>
          </select>
          <label style={{ fontSize: 12, color: '#475569' }}>Model</label>
          <input
            value={(data as AIImageNodeData).model}
            onChange={(event) =>
              updateNodeData(selectedNode.id, { model: event.target.value })
            }
            style={{ padding: 8, borderRadius: 8, border: '1px solid #cbd5f5' }}
          />
          <label style={{ fontSize: 12, color: '#475569' }}>Size</label>
          <input
            value={(data as AIImageNodeData).size}
            onChange={(event) =>
              updateNodeData(selectedNode.id, { size: event.target.value })
            }
            style={{ padding: 8, borderRadius: 8, border: '1px solid #cbd5f5' }}
          />
        </div>
      )}
    </div>
  );
};

export default NodeConfigDrawer;
