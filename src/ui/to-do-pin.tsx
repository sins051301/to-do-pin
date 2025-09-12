import { useEffect, useState } from "react";
import { useToDoPin } from "../context/useTodoPin";
import type { TodoTask } from "../type";
import "./to-do-pin.css";

interface TodoPinProps {
  id: string;
  profileImg?: string;
  title?: string;
  description?: string;
  x?: number;
  y?: number;
  todos: TodoTask[];
}

function TodoPin({
  id,
  profileImg,
  title,
  description,
  x = 20,
  y = 20,
  todos,
}: TodoPinProps) {
  const [todoOpen, setTodoOpen] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { register, remove } = useToDoPin();

  const toggleCheck = (todoText: string) => {
    const updatedTodos = todos.map((t) =>
      t.text === todoText ? { ...t, checked: !t.checked } : t
    );
    register({
      id,
      x,
      y,
      url: window.location.pathname,
      title,
      description,
      todos: updatedTodos,
    });
  };

  useEffect(() => {
    register({
      id,
      x,
      y,
      url: window.location.pathname,
      title,
      description,
      todos,
    });
  }, []);

  const handleDelete = () => {
    if (deleting) return;
    setDeleting(true);
    try {
      remove(id);
      setRemoved(true);
    } catch (err) {
      console.error("❌ 삭제 실패", err);
    } finally {
      setDeleting(false);
    }
  };

  if (removed) return null;

  return (
    <div
      className="devpin-container"
      style={{ top: y, left: x }}
      onMouseEnter={() => setTodoOpen(true)}
      onMouseLeave={() => setTodoOpen(false)}
    >
      {todoOpen ? (
        <>
          <div className="devpin-header">
            <img
              src="https://api.dicebear.com/7.x/notionists/png?size=40"
              alt="프로필 이미지"
              width={20}
              height={20}
            />
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="devpin-delete-btn"
              title="이 DevPin 삭제"
            >
              {deleting ? "삭제중…" : "삭제"}
            </button>
          </div>

          <div className="devpin-body">
            <h2 className="devpin-section-title">{title || "제목 없음"}</h2>
            {description && (
              <p className="devpin-description">{description || "설명 없음"}</p>
            )}
            <h3 className="devpin-section-title">Todo</h3>
            <ul className="devpin-todo-list">
              {todos.map((t) => (
                <li key={t.text} className="devpin-todo-item">
                  <input
                    type="checkbox"
                    checked={t.checked}
                    onChange={() => toggleCheck(t.text)}
                  />
                  <span className={t.checked ? "checked" : ""}>{t.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="devpin-avatar-wrapper">
          <div className="devpin-avatar">
            <img
              src={
                profileImg ||
                "https://api.dicebear.com/7.x/notionists/png?size=40"
              }
              alt={title || "프로필 이미지"}
              width={20}
              height={20}
              className="avatar-img"
            />
            <div className="devpin-pointer" />
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoPin;
