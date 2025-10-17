import { useState, useRef } from "react";
import { useToDoPin } from "../context/useTodoPin";
import {
  Eye,
  EyeOff,
  Download,
  Upload,
  HelpCircle,
  Inbox,
  Trash2,
} from "lucide-react";
import "./to-do-tracker.css";
import { gitUrl, gitToken } from "../context/variable";

type TodoTask = { text: string; checked: boolean };
type PinItem = {
  id: string;
  x: number;
  y: number;
  url: string;
  todos: TodoTask[];
  title?: string;
  description?: string;
  issueNumber: number;
};

function TodoTracker() {
  const {
    todos: pins,
    register,
    remove,
    visible,
    toggleVisible,
    git,
    setGit,
  } = useToDoPin();

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 5, y: 5 });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleCheck = (pinId: string, todoText: string) => {
    const updatedPins = pins.map((pin) =>
      pin.id === pinId
        ? {
            ...pin,
            todos: pin.todos.map((t) =>
              t.text === todoText ? { ...t, checked: !t.checked } : t
            ),
          }
        : pin
    );
    const updatedPin = updatedPins.find((p) => p.id === pinId);
    if (updatedPin) register(updatedPin);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(pins, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "toDoPins-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data: PinItem[] = JSON.parse(event.target?.result as string);
        localStorage.setItem("toDoPins", JSON.stringify(data));
        data.forEach((pin) => register(pin));
        alert("✅ TodoPin restored");
      } catch {
        alert("❌ JSON parsing failed");
      }
    };
    reader.readAsText(file);
  };

  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);

  const beginDrag = (clientX: number, clientY: number) => {
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      originX: pos.x,
      originY: pos.y,
      moved: false,
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", endDrag);
  };

  const onMove = (e: MouseEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragRef.current.moved = true;
      setIsDragging(true);
    }

    if (dragRef.current.moved) {
      setPos({
        x: dragRef.current.originX + dx,
        y: dragRef.current.originY + dy,
      });
    }
  };

  const endDrag = () => {
    if (dragRef.current?.moved) {
      setIsDragging(true);
      setTimeout(() => setIsDragging(false), 50); // 클릭 이벤트 지나간 뒤 해제
    } else {
      setIsDragging(false);
    }

    dragRef.current = null;
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", endDrag);
  };

  const onMouseDownHeader = (e: React.MouseEvent) => {
    beginDrag(e.clientX, e.clientY);
  };

  const onMouseDownFab = (e: React.MouseEvent) => {
    beginDrag(e.clientX, e.clientY);
  };

  const groupedPins = pins.reduce<Record<string, PinItem[]>>((acc, pin) => {
    if (!acc[pin.url]) acc[pin.url] = [];
    acc[pin.url].push(pin);
    return acc;
  }, {});

  return (
    <div
      className={`devpin-tracker ${open ? "is-open" : "is-closed"}`}
      style={{ top: pos.y, left: pos.x }}
    >
      <button
        className="tracker-fab"
        aria-label={open ? "Close Todo Tracker" : "Open Todo Tracker"}
        onClick={() => {
          if (isDragging) return;
          setOpen((v) => !v);
        }}
        onMouseDown={onMouseDownFab}
        type="button"
      >
        📝
      </button>

      {open && (
        <div className="tracker-panel">
          <div
            className="tracker-header"
            onMouseDown={onMouseDownHeader}
            role="button"
            tabIndex={0}
          >
            <h2 className="tracker-title">Todo Tracker</h2>
            <div className="tracker-actions">
              <button
                className={`tracker-btn github-btn ${
                  git ? "linked" : "unlinked"
                }`}
                onClick={() => {
                  if (!git && (!gitUrl || !gitToken)) {
                    window.alert("GitHub URL or GitHub Token not found");
                    return;
                  }
                  setGit(!git);
                }}
                aria-label={git ? "Disconnect GitHub" : "Connect GitHub"}
                type="button"
              >
                {git ? "GitHub ✓" : "GitHub X"}
              </button>

              <button
                onClick={toggleVisible}
                className="tracker-btn"
                aria-label={visible ? "Hide pins" : "Show pins"}
                type="button"
              >
                {visible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>

              <button
                onClick={handleExport}
                className="tracker-btn"
                aria-label="Export tasks"
                type="button"
              >
                <Download size={16} />
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="tracker-btn"
                aria-label="Import tasks"
                type="button"
              >
                <Upload size={16} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="application/json"
                onChange={handleImport}
              />

              <div className="tracker-hint-wrapper">
                <button
                  className="tracker-btn"
                  aria-label="Help"
                  aria-describedby="tracker-hint"
                  type="button"
                >
                  <HelpCircle size={16} aria-hidden="true" />
                </button>
                <div id="tracker-hint" role="tooltip" className="tracker-hint">
                  ⚠️ Local storage is cleared when the page is refreshed.
                  <br />
                  <strong>⬇ export</strong> button to save backup file,
                  <br />
                  <strong>⬆ import</strong> button to restore.
                </div>
              </div>
            </div>
          </div>

          <ul className="tracker-list">
            {Object.keys(groupedPins).length === 0 ? (
              <li className="tracker-empty">
                <Inbox
                  size={16}
                  aria-hidden="true"
                  style={{ marginRight: 4 }}
                />
                No tasks.
              </li>
            ) : (
              Object.entries(groupedPins).map(([url, pins]) => (
                <li key={url} className="tracker-item">
                  <div className="tracker-group">
                    <span className="tracker-url">Page: {url}</span>
                  </div>
                  <ul className="todo-sublist">
                    {pins.map((pin) => (
                      <li key={pin.id} className="tracker-item">
                        <div
                          className="tracker-group"
                          onClick={() =>
                            setCollapsed((prev) => ({
                              ...prev,
                              [pin.id]: !prev[pin.id],
                            }))
                          }
                          role="button"
                          tabIndex={0}
                          aria-expanded={!collapsed[pin.id]}
                          aria-controls={`todos-${pin.id}`}
                        >
                          <div className="tracker-url-title">
                            {pin.title || "no title"}
                          </div>
                          <div className="todo-control">
                            <span className="tracker-arrow">
                              {collapsed[pin.id] ? "▸" : "▾"}
                            </span>
                            <button
                              className="todo-delete-btn"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to delete this pin?"
                                  )
                                ) {
                                  remove(pin.id);
                                }
                              }}
                              aria-label="Delete pin"
                              type="button"
                            >
                              <Trash2 size={14} aria-hidden="true" />
                            </button>
                          </div>
                        </div>

                        {!collapsed[pin.id] && (
                          <ul
                            className="todo-sublist"
                            id={`todos-${pin.id}`}
                            aria-label={`Todos for ${pin.title || "pin"}`}
                          >
                            {pin.todos.map((todo, idx) => (
                              <li
                                key={`${pin.id}-${todo.text}`}
                                className="todo-item"
                              >
                                <input
                                  id={`todo-${pin.id}-${idx}`}
                                  type="checkbox"
                                  checked={todo.checked}
                                  onChange={() =>
                                    toggleCheck(pin.id, todo.text)
                                  }
                                />
                                <label htmlFor={`todo-${pin.id}-${idx}`}>
                                  <span
                                    className={todo.checked ? "checked" : ""}
                                  >
                                    {todo.text}
                                  </span>
                                </label>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TodoTracker;
