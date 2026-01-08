import React from "react";
import { useExecutionContext } from "../context/ExecutionContext";

const ResultPanel: React.FC = () => {
  const { status, result, logs } = useExecutionContext();

  return (
    <div style={{ padding: 16, borderTop: "1px solid #e2e8f0" }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Execution</div>
      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Status: {status}</div>
      <div style={{ fontSize: 13, color: "#0f172a", marginBottom: 12 }}>{result || "No output yet."}</div>
      {logs.length > 0 && (
        <div style={{ fontSize: 12, color: "#475569" }}>
          {logs.map((log, index) => (
            <div key={`${log}-${index}`}>{log}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultPanel;
