import type { ReactNode } from "react";

function DummyPage({
  title,
  children,
  style,
}: {
  title: string;
  children?: ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <h2 style={style}>
      {title}
      {children}
    </h2>
  );
}
export default DummyPage;
