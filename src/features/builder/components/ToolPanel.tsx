import React from "react";
import { useToolContext } from "../context/ToolContext";

const ToolPanel: React.FC = () => {
  const { tools } = useToolContext();

  return (
    <div style={{ padding: 16, borderBottom: "1px solid #e2e8f0" }}>
      <div style={{ fontWeight: 600, marginBottom: 12 }}>AI Tools</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {tools.map((tool) => (
          <div
            key={tool.id}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData("application/reactflow", tool.nodeType);
              event.dataTransfer.effectAllowed = "move";
            }}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #cbd5f5",
              background: "#eef2ff",
              cursor: "grab",
            }}
          >
            {tool.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolPanel;
