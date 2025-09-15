import { useEffect, useState } from "react";
import { useToDoPin } from "../context/useTodoPin";
import type { TodoTask } from "../type";
import { Trash2 } from "lucide-react";
import "./to-do-pin.css";
import handleCloseIssue from "../api/handle-close-issue";
import handleUpdateIssue from "../api/handle-update-issue";

interface TodoPinProps {
  id: string;
  title?: string;
  description?: string;
  x?: number;
  y?: number;
  todos: TodoTask[];
  issueNumber: number;
}

function TodoPin({
  id,
  title,
  description,
  x = 20,
  y = 20,
  todos,
  issueNumber,
}: TodoPinProps) {
  const { register, remove, git } = useToDoPin();

  const [isEditing, setIsEditing] = useState(false);
  const [hovered, setHovered] = useState(false);

  const [draftTitle, setDraftTitle] = useState(title || "");
  const [draftDesc, setDraftDesc] = useState(description || "");
  const [draftTodos, setDraftTodos] = useState<TodoTask[]>(todos);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    register({
      id,
      x,
      y,
      url: window.location.pathname,
      title,
      description,
      todos,
      issueNumber,
    });
  }, []);

  // 저장
  const handleSave = () => {
    const updated = {
      id,
      x,
      y,
      url: window.location.pathname,
      title: draftTitle,
      description: draftDesc,
      todos: draftTodos,
      issueNumber,
    };
    register(updated);
    setIsEditing(false);

    if (git && issueNumber) {
      handleUpdateIssue(issueNumber, draftTitle, draftDesc, draftTodos);
    }
  };

  // 삭제
  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      remove(id);
      if (git && issueNumber) {
        handleCloseIssue(issueNumber);
      }
    }
  };

  // Todo 관련 핸들러들
  const handleTodoChange = (index: number, text: string) => {
    setDraftTodos((prev) =>
      prev.map((t, i) => (i === index ? { ...t, text } : t))
    );
  };

  const toggleTodoCheck = (index: number) => {
    setDraftTodos((prev) =>
      prev.map((t, i) => (i === index ? { ...t, checked: !t.checked } : t))
    );
  };

  const removeTodo = (index: number) => {
    setDraftTodos((prev) => prev.filter((_, i) => i !== index));
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setDraftTodos((prev) => [
      ...prev,
      { text: newTodo.trim(), checked: false },
    ]);
    setNewTodo("");
  };

  return (
    <div
      className="devpin-container"
      style={{ top: y, left: x }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!hovered ? (
        // 기본 상태: 아바타만 보임
        <div className="devpin-avatar-wrapper">
          <div className="devpin-avatar">
            <img
              src="https://api.dicebear.com/7.x/notionists/png?size=40"
              alt="프로필 이미지"
              width={20}
              height={20}
              className="avatar-img"
            />
            <div className="devpin-pointer" />
          </div>
        </div>
      ) : (
        // Hover 시 세부 내용 표시
        <>
          <div className="devpin-header">
            <img
              src="https://api.dicebear.com/7.x/notionists/png?size=40"
              alt="프로필 이미지"
              width={20}
              height={20}
            />
            {!isEditing ? (
              <div className="devpin-actions">
                <button
                  onClick={() => setIsEditing(true)}
                  className="devpin-edit-btn"
                >
                  수정
                </button>
                <button onClick={handleDelete} className="devpin-delete-btn">
                  삭제
                </button>
              </div>
            ) : (
              <div className="devpin-actions">
                <button onClick={handleSave} className="devpin-save-btn">
                  확인
                </button>
                <button
                  onClick={() => {
                    setDraftTitle(title || "");
                    setDraftDesc(description || "");
                    setDraftTodos(todos);
                    setNewTodo("");
                    setIsEditing(false);
                  }}
                  className="devpin-cancel-btn"
                >
                  취소
                </button>
              </div>
            )}
          </div>

          <div className="devpin-body">
            {!isEditing ? (
              <>
                <h2 className="devpin-section-title">{title || "제목 없음"}</h2>
                <p className="devpin-description">
                  {description || "설명 없음"}
                </p>
              </>
            ) : (
              <>
                <input
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="devpin-input"
                  placeholder="제목"
                />
                <textarea
                  value={draftDesc}
                  onChange={(e) => setDraftDesc(e.target.value)}
                  className="devpin-textarea"
                  placeholder="설명"
                />
              </>
            )}

            <h3 className="devpin-section-title">Todo</h3>
            <ul className="devpin-todo-list">
              {draftTodos.map((t, idx) => (
                <li key={idx} className="devpin-todo-item">
                  {isEditing ? (
                    <>
                      <input
                        value={t.text}
                        onChange={(e) => handleTodoChange(idx, e.target.value)}
                        className="devpin-input2"
                      />
                      <button
                        onClick={() => removeTodo(idx)}
                        className="todo-delete-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        type="checkbox"
                        checked={t.checked}
                        onChange={() => toggleTodoCheck(idx)}
                      />
                      <span className={t.checked ? "checked" : ""}>
                        {t.text}
                      </span>
                    </>
                  )}
                </li>
              ))}
            </ul>

            {isEditing && (
              <div className="todo-add-wrapper">
                <input
                  type="text"
                  placeholder="할 일 추가"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  className="devpin-input2"
                />
                <button onClick={addTodo} className="devpin-save-btn">
                  +
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default TodoPin;
