"use client";

import { useLocation } from "react-router-dom";
import { useToDoPin } from "../context/useTodoPin";
import TodoPin from "./to-do-pin";

export default function TodoPinList() {
  const { pathname } = useLocation();
  const { todos, visible } = useToDoPin();

  if (!visible) return null;

  const pins = todos.filter((pin) => pin.url === pathname);

  if (pins.length === 0) return null;

  return (
    <>
      {pins.map((pin) => (
        <TodoPin key={pin.id} {...pin} />
      ))}
    </>
  );
}
