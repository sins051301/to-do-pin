import { createBrowserRouter } from "react-router-dom";
import DummyPage from "./ui/dummy-page";
import Layout from "./layout";

const route = [
  { url: "/club", label: "club" },
  {
    url: "/test",
    label: "/test",
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <DummyPage title="Home" style={{ height: "200vh" }}>
            {route.map((r) => (
              <a key={r.url} href={r.url}>
                {r.label}
              </a>
            ))}
          </DummyPage>
        ),
      },
      {
        path: "about",
        element: <DummyPage title="About" />,
      },
      {
        path: "todo",
        element: <DummyPage title="Todo" />,
      },
      {
        path: "todo/:id",
        element: <DummyPage title="Todo" />,
      },
      {
        path: "club",
        element: <DummyPage title="Club" />,
      },
      {
        path: "test",
        element: <DummyPage title="Test" />,
      },
    ],
  },
]);
