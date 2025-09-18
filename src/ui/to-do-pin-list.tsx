import { useToDoPin } from "../context/useTodoPin";
import TodoPin from "./to-do-pin";
import usePathname from "../context/usePathName";

export default function TodoPinList() {
  const { todos, visible } = useToDoPin();
  const pathname = usePathname();

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
