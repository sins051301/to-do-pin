import { useContext, createContext } from "react";
import type { ToDoPinContextType } from "./to-do-pin-provider";

export const ToDoPinContext = createContext<ToDoPinContextType | undefined>(
  undefined
);

export function useToDoPin() {
  const context = useContext(ToDoPinContext);
  if (!context) {
    throw new Error("useToDoPin must be used within ToDoPinProvider");
  }
  return context;
}
