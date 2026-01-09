import React from "react";
import { BuilderProvider } from "./features/builder/context/BuilderContext";
import { ExecutionProvider } from "./features/builder/context/ExecutionContext";
import { ToolProvider } from "./features/builder/context/ToolContext";
import BuilderPage from "./features/builder/BuilderPage";

const App: React.FC = () => {
  return (
    <ToolProvider>
      <ExecutionProvider>
        <BuilderProvider>
          <BuilderPage />
        </BuilderProvider>
      </ExecutionProvider>
    </ToolProvider>
  );
};

export default App;
