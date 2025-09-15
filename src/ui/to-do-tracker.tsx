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

type TodoTask = {
  text: string;
  checked: boolean;
};

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
  const [open, setOpen] = useState(true);
  const [pos, setPos] = useState({ x: 5, y: 5 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 체크 토글
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

  // JSON 내보내기
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

  // JSON 불러오기
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data: PinItem[] = JSON.parse(event.target?.result as string);
        localStorage.setItem("toDoPins", JSON.stringify(data));
        data.forEach((pin) => register(pin));
        alert("✅ TodoPins 복구 완료");
      } catch {
        alert("❌ JSON 파싱 실패");
      }
    };
    reader.readAsText(file);
  };

  // 드래그 이동
  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: pos.x,
      originY: pos.y,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPos({
      x: dragRef.current.originX + dx,
      y: dragRef.current.originY + dy,
    });
  };
  const handleMouseUp = () => {
    dragRef.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // url별 그룹핑
  const groupedPins = pins.reduce<Record<string, PinItem[]>>((acc, pin) => {
    if (!acc[pin.url]) acc[pin.url] = [];
    acc[pin.url].push(pin);
    return acc;
  }, {});

  return (
    <div className="devpin-tracker" style={{ top: pos.y, left: pos.x }}>
      <div
        className="tracker-header"
        onMouseDown={handleMouseDown}
        role="button"
        tabIndex={0}
      >
        <h2 className="tracker-title">Todo Tracker</h2>
        <div className="tracker-actions">
          <button
            className={`tracker-btn github-btn ${git ? "linked" : "unlinked"}`}
            onClick={() => setGit(!git)}
            title={git ? "GitHub 연동됨" : "GitHub 연동 안됨"}
          >
            {git ? "GitHub ✓" : "GitHub X"}
          </button>
          <button onClick={toggleVisible} className="tracker-btn">
            {visible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button
            onClick={handleExport}
            className="tracker-btn"
            title="내보내기"
          >
            <Download size={16} />
          </button>

          {/* 불러오기 */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="tracker-btn"
            title="불러오기"
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

          {/* Hint */}
          <div className="tracker-hint-wrapper">
            <button className="tracker-btn" title="도움말">
              <HelpCircle size={16} />
            </button>
            <div className="tracker-hint">
              ⚠️ 로컬스토리지가 초기화되면 데이터가 사라질 수 있습니다.
              <br />
              <strong>⬇ 내보내기</strong> 버튼으로 백업 파일을 저장하고,
              <br />
              <strong>⬆ 불러오기</strong> 버튼으로 복구할 수 있습니다.
            </div>
          </div>

          {/* 열고닫기 */}
          <button
            onClick={() => setOpen(!open)}
            className="tracker-toggle"
            aria-label="Toggle list"
          >
            {open ? "▾" : "▸"}
          </button>
        </div>
      </div>

      {open && (
        <ul className="tracker-list">
          {Object.keys(groupedPins).length === 0 ? (
            <li className="tracker-empty">
              <Inbox size={16} style={{ marginRight: "4px" }} />할 일이
              없습니다.
            </li>
          ) : (
            Object.entries(groupedPins).map(([url, pins]) => (
              <li key={url} className="tracker-item">
                <div className="tracker-group">
                  <div className="tracker-url">위치: {url}</div>
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
                      >
                        <div className="tracker-url">
                          {pin.title || "(제목 없음)"}
                        </div>
                        <div className="todo-control">
                          <span className="tracker-arrow">
                            {collapsed[pin.id] ? "▸" : "▾"}
                          </span>

                          <button
                            className="todo-delete-btn"
                            onClick={() => {
                              if (
                                window.confirm("정말 이 핀을 삭제하시겠습니까?")
                              ) {
                                remove(pin.id);
                              }
                            }}
                            title="핀 삭제"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      {!collapsed[pin.id] && (
                        <ul className="todo-sublist">
                          {pin.todos.map((todo) => (
                            <li
                              key={`${pin.id}-${todo.text}`}
                              className="todo-item"
                            >
                              <input
                                type="checkbox"
                                checked={todo.checked}
                                onChange={() => toggleCheck(pin.id, todo.text)}
                              />
                              <span className={todo.checked ? "checked" : ""}>
                                {todo.text}
                              </span>
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
      )}
    </div>
  );
}

export default TodoTracker;
