import { Outlet } from "react-router-dom";
import { ToDoPinProvider } from "./context/to-do-pin-provider";

function Layout() {
  return (
    <ToDoPinProvider>
      <Outlet />
    </ToDoPinProvider>
  );
}

export default Layout;
