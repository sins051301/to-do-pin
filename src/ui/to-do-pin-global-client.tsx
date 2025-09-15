import { useCallback, useEffect, useState } from "react";
import { useToDoPin } from "../context/useTodoPin";
import type { TodoTask } from "../type";
import SafeDevForm from "./dev-safe-form";
import "./to-do-pin-global.css";

export default function ToDoPinGlobalClient() {
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
      setX(e.clientX);
      setY(e.clientY);
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
      const gitUrl =
        typeof import.meta !== "undefined" && import.meta.env?.VITE_GITHUB_URL
          ? import.meta.env.VITE_GITHUB_URL
          : process.env.NEXT_PUBLIC_GITHUB_URL;

      const gitToken =
        typeof import.meta !== "undefined" && import.meta.env?.VITE_GITHUB_TOKEN
          ? import.meta.env.VITE_GITHUB_TOKEN
          : process.env.NEXT_PUBLIC_GITHUB_TOKEN;

      if (git && gitUrl && gitToken) {
        const issueBody = [
          "## 어떤 작업인가요?",
          "",
          (description && description.trim()) ||
            "할 작업에 대해 간결하게 설명해 주세요",
          "",
          "## 작업 상세 내용",
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
          console.error("❌ GitHub Issue 생성 실패:", await res.text());
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
      console.error("❌ 저장 실패", err);
    }
  };
  if (!open) return null;

  return (
    <SafeDevForm
      title="저장"
      buttonClassName="btn-save"
      onSubmit={handleSubmit}
      handleClose={handleClose}
      style={{
        position: "absolute",
        top: Math.max(y, 200),
        left: x,
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
      }}
      formClassName="form-container"
    >
      <div className="form-header">
        <h2>Todo</h2>
      </div>

      <div className="form-body">
        <label className="form-label">Title</label>
        <input
          type="text"
          placeholder="제목"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className="form-label">Description</label>
        <input
          type="text"
          placeholder="설명"
          className="form-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="todo-section">
          <label className="form-label">Todo</label>
          <div className="todo-input-wrapper">
            <input
              id="todo-input"
              type="text"
              placeholder="해야 할 일 입력 후 +"
              className="form-input"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <button
              type="button"
              onClick={addTodo}
              className="btn-add"
              aria-label="Add todo"
              title="할 일 추가"
            >
              +
            </button>
          </div>

          <ul className="todo-list">
            {todos.map((t, idx) => (
              <li key={t.text} className="todo-item">
                <span className="todo-text">{t.text}</span>
                <button
                  type="button"
                  onClick={() => removeTodo(idx)}
                  className="btn-delete"
                  aria-label="remove"
                  title="삭제"
                >
                  삭제
                </button>
              </li>
            ))}
            {todos.length === 0 && (
              <li className="todo-placeholder">할 일을 추가해보세요.</li>
            )}
          </ul>
        </div>
      </div>
    </SafeDevForm>
  );
}
