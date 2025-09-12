import { useToDoPin } from "../context/useTodoPin";
import TodoPin from "./to-do-pin";

export default function TodoPinList() {
  const { todos, visible } = useToDoPin();

  if (!visible) return null;

  const pins = todos.filter((pin) => pin.url === window.location.pathname);

  if (pins.length === 0) return null;

  return (
    <>
      {pins.map((pin) => (
        <TodoPin key={pin.id} {...pin} />
      ))}
    </>
  );
}
