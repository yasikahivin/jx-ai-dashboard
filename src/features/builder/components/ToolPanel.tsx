import React from "react";
import { useToolContext } from "../context/ToolContext";

const ToolPanel: React.FC = () => {
  const { tools } = useToolContext();

  return (
    <div className="panel-section">
      <div className="panel-title">AI Tools</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="tool-card"
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData("application/reactflow", tool.nodeType);
              event.dataTransfer.effectAllowed = "move";
            }}
            style={{ cursor: "grab" }}
          >
            <div>
              <strong>{tool.label}</strong>
              <span>Tool: {tool.nodeType === "ai_image" ? "Image" : "Text"}</span>
            </div>
            <span>+</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolPanel;
