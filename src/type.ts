export type TodoTask = {
  text: string;
  checked: boolean;
};

export type TodoItem = {
  id: string;
  x: number;
  y: number;
  url: string;
  todos: TodoTask[];
  title?: string;
  description?: string;
};
