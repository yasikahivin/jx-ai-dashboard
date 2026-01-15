import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ExecutionState, ExecutionStatus } from "../types";

interface ExecutionContextValue extends ExecutionState {
  setStatus: (status: ExecutionStatus) => void;
  addLog: (message: string) => void;
  setResult: (result: string | null) => void;
  reset: () => void;
}

const ExecutionContext = createContext<ExecutionContextValue | undefined>(undefined);

const initialState: ExecutionState = {
  status: "idle",
  logs: [],
  result: null,
};

export const ExecutionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ExecutionState>(initialState);

  const setStatus = useCallback((status: ExecutionStatus) => {
    setState((current) => ({ ...current, status }));
  }, []);

  const addLog = useCallback((message: string) => {
    setState((current) => ({ ...current, logs: [...current.logs, message] }));
  }, []);

  const setResult = useCallback((result: string | null) => {
    setState((current) => ({ ...current, result }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      setStatus,
      addLog,
      setResult,
      reset,
    }),
    [state, setStatus, addLog, setResult, reset]
  );

  return <ExecutionContext.Provider value={value}>{children}</ExecutionContext.Provider>;
};

export const useExecutionContext = (): ExecutionContextValue => {
  const context = useContext(ExecutionContext);
  if (!context) {
    throw new Error("useExecutionContext must be used within ExecutionProvider");
  }
  return context;
};
