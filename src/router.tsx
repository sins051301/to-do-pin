import { createBrowserRouter } from "react-router-dom";
import DummyPage from "./ui/dummy-page";
import Layout from "./layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <DummyPage title="Home" />,
      },
      {
        path: "about",
        element: <DummyPage title="About" />,
      },
      {
        path: "todo",
        element: <DummyPage title="Todo" />,
      },
    ],
  },
]);
