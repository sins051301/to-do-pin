import { useCallback, useEffect, useState } from "react";
import type { TodoTask } from "../type";
import { useToDoPin } from "./useTodoPin";
import { gitToken, gitUrl } from "./variable";

export default function useHandleGlobalPin() {
  const [open, setOpen] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState<TodoTask[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const { register, git } = useToDoPin();

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!e.altKey) return;
      e.preventDefault();
      setX(e.pageX);
      setY(e.pageY);
      setOpen(true);
    };

    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  const addTodo = () => {
    const t = newTodo.trim();
    if (!t) return;
    if (todos.some((todo) => todo.text === t)) {
      setNewTodo("");
      return;
    }
    setTodos((prev) => [...prev, { text: t, checked: false }]);
    setNewTodo("");
  };

  const removeTodo = (idx: number) => {
    setTodos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const props = {
      id: crypto.randomUUID(),
      url: window.location.pathname,
      title,
      description,
      todos,
      x,
      y,
      createdAt: Date.now(),
      issueNumber: 0,
    };

    try {
      if (git && gitUrl && gitToken) {
        const issueBody = [
          "## What is the task?",
          "",
          (description && description.trim()) || "Briefly describe the task.",
          "",
          "## Task details",
          "",
          ...(todos.length
            ? todos.map((t) => `- [ ] ${t.text}`)
            : ["- [ ] TODO"]),
        ].join("\n");

        const res = await fetch(
          `https://api.github.com/repos/${gitUrl}/issues`,
          {
            method: "POST",
            headers: {
              Authorization: `token ${gitToken}`,
              Accept: "application/vnd.github+json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              body: issueBody,
            }),
          }
        );

        if (!res.ok) {
          console.error("❌ GitHub Issue creation failed:", await res.text());
        } else {
          const data = await res.json();
          props.issueNumber = Number(data.number);
        }
      }
      register(props);

      setOpen(false);
      setTitle("");
      setDescription("");
      setTodos([]);
      setNewTodo("");
    } catch (err) {
      console.error("❌ Save failed", err);
    }
  };

  return {
    handleClose,
    handleSubmit,
    addTodo,
    removeTodo,
    open,
    x,
    y,
    title,
    description,
    todos,
    newTodo,
    setTitle,
    setDescription,
    setTodos,
    setNewTodo,
  };
}
