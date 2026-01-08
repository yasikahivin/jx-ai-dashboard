import React, { createContext, useContext, useMemo } from "react";
import { BuilderTool } from "../types";

interface ToolContextValue {
  tools: BuilderTool[];
}

const ToolContext = createContext<ToolContextValue | undefined>(undefined);

const tools: BuilderTool[] = [
  { id: "tool-ai-text", label: "AI Text", nodeType: "ai_text" },
  { id: "tool-ai-image", label: "AI Image", nodeType: "ai_image" },
];

export const ToolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useMemo(() => ({ tools }), []);
  return <ToolContext.Provider value={value}>{children}</ToolContext.Provider>;
};

export const useToolContext = (): ToolContextValue => {
  const context = useContext(ToolContext);
  if (!context) {
    throw new Error("useToolContext must be used within ToolProvider");
  }
  return context;
};
