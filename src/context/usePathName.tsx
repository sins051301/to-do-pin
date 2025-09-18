import { useEffect, useState } from "react";

function usePathname() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const updatePath = () => {
      const newPath = window.location.pathname;
      if (newPath !== pathname) {
        queueMicrotask(() => setPathname(newPath));
      }
    };

    window.addEventListener("popstate", updatePath);

    const wrap = (method: "pushState" | "replaceState") => {
      const orig = history[method];
      history[method] = function (...args) {
        const result = orig.apply(this, args);
        window.dispatchEvent(new Event("locationchange"));
        return result;
      };
    };
    wrap("pushState");
    wrap("replaceState");

    window.addEventListener("locationchange", updatePath);

    return () => {
      window.removeEventListener("popstate", updatePath);
      window.removeEventListener("locationchange", updatePath);
    };
  }, [pathname]);

  return pathname;
}

export default usePathname;
