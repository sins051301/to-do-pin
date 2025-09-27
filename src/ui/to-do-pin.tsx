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
                  onClick={handleEditing}
                  className="devpin-edit-btn"
                  aria-label="Edit note"
                >
                  edit
                </button>
                <button
                  onClick={handleDelete}
                  className="devpin-delete-btn"
                  aria-label="Delete note"
                >
                  delete
                </button>
              </div>
            ) : (
              <div className="devpin-actions">
                <button
                  onClick={handleSave}
                  className="devpin-save-btn"
                  aria-label="Save note"
                >
                  save
                </button>
                <button
                  onClick={handleCanceling}
                  className="devpin-cancel-btn"
                  aria-label="Cancel editing"
                >
                  cancel
                </button>
              </div>
            )}
          </div>

          <div className="devpin-body">
            {!isEditing ? (
              <>
                <p role="heading" aria-level={3} className="devpin-section-title">
                  {title || "no title"}
                </p>
                <p className="devpin-description">
                  {description || "no description"}
                </p>
              </>
            ) : (
              <>
                <label htmlFor={`title-${id}`} className="sr-only">
                  Title
                </label>
                <input
                  id={`title-${id}`}
                  value={draft.title}
                  onChange={(e) =>
                    dispatch({ type: "SET_TITLE", payload: e.target.value })
                  }
                  className="devpin-input"
                  placeholder="title"
                />
                <label htmlFor={`desc-${id}`} className="sr-only">
                  Description
                </label>
                <textarea
                  id={`desc-${id}`}
                  value={draft.desc}
                  onChange={(e) =>
                    dispatch({ type: "SET_DESC", payload: e.target.value })
                  }
                  className="devpin-textarea"
                  placeholder="description"
                />
              </>
            )}

            <p role="heading" aria-level={4} className="devpin-section-title">
              Todo
            </p>
            <ul className="devpin-todo-list">
              {draft.todos.map((t, idx) => (
                <li key={idx} className="devpin-todo-item">
                  {isEditing ? (
                    <>
                      <label htmlFor={`todo-${id}-${idx}`} className="sr-only">
                        Todo item {idx + 1}
                      </label>
                      <input
                        id={`todo-${id}-${idx}`}
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
                        aria-label={`Remove todo: ${t.text}`}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        id={`todo-check-${id}-${idx}`}
                        type="checkbox"
                        checked={t.checked}
                        onChange={() =>
                          dispatch({ type: "TOGGLE_TODO", index: idx })
                        }
                      />
                      <label htmlFor={`todo-check-${id}-${idx}`}>
                        <span className={t.checked ? "checked" : ""}>
                          {t.text}
                        </span>
                      </label>
                    </>
                  )}
                </li>
              ))}
            </ul>

            {isEditing && (
              <div className="todo-add-wrapper">
                <label htmlFor={`new-todo-${id}`} className="sr-only">
                  New todo
                </label>
                <input
                  id={`new-todo-${id}`}
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
                  aria-label="Add todo"
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
