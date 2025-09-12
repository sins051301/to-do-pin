import {
  useState,
  type ReactNode,
  useCallback,
  useMemo,
  useEffect,
} from "react";

import ToDoTracker from "../ui/to-do-tracker";
import DevPinGlobalClient from "../ui/to-do-pin-global-client";
import TodoPinList from "../ui/to-do-pin-list";
import { ToDoPinContext } from "./useTodoPin";

type TodoTask = {
  text: string;
  checked: boolean;
};

type TodoItem = {
  id: string;
  x: number;
  y: number;
  url: string;
  todos: TodoTask[];
  title?: string;
  description?: string;
};

export type ToDoPinContextType = {
  todos: TodoItem[];
  visible: boolean;
  toggleVisible: () => void;
  register: (item: TodoItem) => void;
  remove: (id: string) => void;
};

export function ToDoPinProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [visible, setVisible] = useState(true);

  const toggleVisible = useCallback(() => {
    setVisible((prev) => !prev);
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem("toDoPins");
    if (raw) {
      try {
        setTodos(JSON.parse(raw));
      } catch {
        console.warn("⚠️ toDoPins 파싱 실패");
      }
    }
  }, []);

  const register = useCallback((item: TodoItem) => {
    setTodos((prev) => {
      const exists = prev.find((t) => t.id === item.id);
      const next = exists
        ? prev.map((t) => (t.id === item.id ? item : t))
        : [...prev, item];
      localStorage.setItem("toDoPins", JSON.stringify(next));
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setTodos((prev) => {
      const next = prev.filter((t) => t.id !== id);
      localStorage.setItem("toDoPins", JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ todos, register, remove, visible, toggleVisible }),
    [todos, register, remove, visible, toggleVisible]
  );
  const devEnv =
    (typeof import.meta !== "undefined" &&
      (import.meta as { env: Record<string, string> }).env
        ?.VITE_TO_DO_PIN_ENV) ||
    process.env.VITE_TO_DO_PIN_ENV;

  return (
    <ToDoPinContext.Provider value={value}>
      {devEnv === "development" && (
        <>
          <ToDoTracker />
          <DevPinGlobalClient />
          <TodoPinList />
        </>
      )}
      {children}
    </ToDoPinContext.Provider>
  );
}
