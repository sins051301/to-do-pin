import { useEffect, useReducer, useState } from "react";
import type { TodoTask } from "../type";
import { useToDoPin } from "./useTodoPin";
import handleCloseIssue from "../api/handle-close-issue";
import handleUpdateIssue from "../api/handle-update-issue";

interface HandlePinProps {
  id: string;
  title?: string;
  description?: string;
  x: number;
  y: number;
  todos: TodoTask[];
  issueNumber: number;
}

type DraftState = {
  title: string;
  desc: string;
  todos: TodoTask[];
  newTodo: string;
};

type DraftAction =
  | { type: "SET_TITLE"; payload: string }
  | { type: "SET_DESC"; payload: string }
  | { type: "SET_NEW_TODO"; payload: string }
  | { type: "ADD_TODO" }
  | { type: "REMOVE_TODO"; index: number }
  | { type: "TOGGLE_TODO"; index: number }
  | { type: "CHANGE_TODO"; index: number; payload: string }
  | { type: "RESET"; payload: DraftState };

function draftReducer(state: DraftState, action: DraftAction): DraftState {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, title: action.payload };
    case "SET_DESC":
      return { ...state, desc: action.payload };
    case "SET_NEW_TODO":
      return { ...state, newTodo: action.payload };
    case "ADD_TODO":
      if (!state.newTodo.trim()) return state;
      return {
        ...state,
        todos: [...state.todos, { text: state.newTodo.trim(), checked: false }],
        newTodo: "",
      };
    case "REMOVE_TODO":
      return {
        ...state,
        todos: state.todos.filter((_, i) => i !== action.index),
      };
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((t, i) =>
          i === action.index ? { ...t, checked: !t.checked } : t
        ),
      };
    case "CHANGE_TODO":
      return {
        ...state,
        todos: state.todos.map((t, i) =>
          i === action.index ? { ...t, text: action.payload } : t
        ),
      };
    case "RESET":
      return action.payload;
    default:
      return state;
  }
}

function useHandlePin({
  id,
  title,
  description,
  x,
  y,
  todos,
  issueNumber,
}: HandlePinProps) {
  const { register, remove, git } = useToDoPin();
  const [isEditing, setIsEditing] = useState(false);
  const [hovered, setHovered] = useState(false);

  const [draft, dispatch] = useReducer(draftReducer, {
    title: title || "",
    desc: description || "",
    todos: todos || [],
    newTodo: "",
  });

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

  const handleHovering = () => setHovered(true);
  const handleLeaving = () => setHovered(false);

  const handleEditing = () => setIsEditing(true);
  const handleCanceling = () => {
    setIsEditing(false);
    dispatch({
      type: "RESET",
      payload: {
        title: title || "",
        desc: description || "",
        todos: todos || [],
        newTodo: "",
      },
    });
  };

  const handleSave = () => {
    const updated = {
      id,
      x,
      y,
      url: window.location.pathname,
      title: draft.title,
      description: draft.desc,
      todos: draft.todos,
      issueNumber,
    };
    register(updated);
    setIsEditing(false);

    if (git && issueNumber) {
      handleUpdateIssue(issueNumber, draft.title, draft.desc, draft.todos);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this pin?")) {
      remove(id);
      if (git && issueNumber) {
        handleCloseIssue(issueNumber);
      }
    }
  };

  return {
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
  };
}

export default useHandlePin;
