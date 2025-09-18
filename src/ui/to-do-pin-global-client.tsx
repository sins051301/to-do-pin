import SafeDevForm from "./dev-safe-form";
import "./to-do-pin-global.css";
import { createPortal } from "react-dom";
import useHandleGlobalPin from "../context/useHandleGlobalPin";

export default function ToDoPinGlobalClient() {
  const {
    open,
    handleClose,
    handleSubmit,
    addTodo,
    removeTodo,
    x,
    y,
    title,
    description,
    todos,
    newTodo,
    setTitle,
    setDescription,
    setNewTodo,
  } = useHandleGlobalPin();

  if (!open) return null;

  return createPortal(
    <SafeDevForm
      title="Save"
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
          placeholder="Title"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className="form-label">Description</label>
        <input
          type="text"
          placeholder="Description"
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
              placeholder="Enter todo and +"
              className="form-input"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <button
              type="button"
              onClick={addTodo}
              className="btn-add"
              aria-label="Add todo"
              title="Add todo"
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
                  title="Remove"
                >
                  Remove
                </button>
              </li>
            ))}
            {todos.length === 0 && (
              <li className="todo-placeholder">Add a todo.</li>
            )}
          </ul>
        </div>
      </div>
    </SafeDevForm>,
    document.body
  );
}
