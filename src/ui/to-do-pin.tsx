import type { TodoTask } from "../type";
import { Trash2 } from "lucide-react";
import "./to-do-pin.css";
import useHandlePin from "../context/useHandlePin";

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
  const {
    draft,
    dispatch,
    isEditing,
    hovered,
    handleHovering,
    handleLeaving,
    handleEditing,
    handleCanceling,
    handleSave,
    handleDelete,
  } = useHandlePin({
    id,
    title,
    description,
    x,
    y,
    todos,
    issueNumber,
  });
  return (
    <div
      className="devpin-container"
      style={{ top: y, left: x }}
      onMouseEnter={handleHovering}
      onMouseLeave={handleLeaving}
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
                <button onClick={handleEditing} className="devpin-edit-btn">
                  edit
                </button>
                <button onClick={handleDelete} className="devpin-delete-btn">
                  delete
                </button>
              </div>
            ) : (
              <div className="devpin-actions">
                <button onClick={handleSave} className="devpin-save-btn">
                  save
                </button>
                <button onClick={handleCanceling} className="devpin-cancel-btn">
                  cancel
                </button>
              </div>
            )}
          </div>

          <div className="devpin-body">
            {!isEditing ? (
              <>
                <h2 className="devpin-section-title">{title || "no title"}</h2>
                <p className="devpin-description">
                  {description || "no description"}
                </p>
              </>
            ) : (
              <>
                <input
                  value={draft.title}
                  onChange={(e) =>
                    dispatch({ type: "SET_TITLE", payload: e.target.value })
                  }
                  className="devpin-input"
                  placeholder="title"
                />
                <textarea
                  value={draft.desc}
                  onChange={(e) =>
                    dispatch({ type: "SET_DESC", payload: e.target.value })
                  }
                  className="devpin-textarea"
                  placeholder="description"
                />
              </>
            )}

            <h3 className="devpin-section-title">Todo</h3>
            <ul className="devpin-todo-list">
              {draft.todos.map((t, idx) => (
                <li key={idx} className="devpin-todo-item">
                  {isEditing ? (
                    <>
                      <input
                        value={t.text}
                        onChange={(e) =>
                          dispatch({
                            type: "CHANGE_TODO",
                            index: idx,
                            payload: e.target.value,
                          })
                        }
                        className="devpin-input2"
                      />
                      <button
                        onClick={() =>
                          dispatch({ type: "REMOVE_TODO", index: idx })
                        }
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
                        onChange={() =>
                          dispatch({ type: "TOGGLE_TODO", index: idx })
                        }
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
                  placeholder="add todo"
                  value={draft.newTodo}
                  onChange={(e) =>
                    dispatch({ type: "SET_NEW_TODO", payload: e.target.value })
                  }
                  className="devpin-input2"
                />
                <button
                  onClick={() => dispatch({ type: "ADD_TODO" })}
                  className="devpin-save-btn"
                >
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
