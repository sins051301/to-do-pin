// api/handle-update-issue.ts
export default async function handleUpdateIssue(
  issueNumber: number,
  title: string,
  description: string,
  todos: { text: string; checked: boolean }[]
) {
  const gitUrl =
    import.meta.env.VITE_GITHUB_URL || process.env.NEXT_PUBLIC_GITHUB_URL;
  const gitToken =
    import.meta.env.VITE_GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;

  if (!gitUrl || !gitToken) {
    console.error("❌ GitHub URL 또는 Token 없음");
    return;
  }

  const issueBody = [
    "## 어떤 작업인가요?",
    "",
    description || "할 작업에 대해 간결하게 설명해 주세요",
    "",
    "## 작업 상세 내용",
    "",
    ...(todos.length
      ? todos.map((t) => `- [${t.checked ? "x" : " "}] ${t.text}`)
      : ["- [ ] TODO"]),
  ].join("\n");

  const res = await fetch(`${gitUrl}/${issueNumber}`, {
    method: "PATCH",
    headers: {
      Authorization: `token ${gitToken}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, body: issueBody }),
  });

  if (!res.ok) {
    console.error("❌ GitHub Issue 수정 실패:", await res.text());
    return null;
  }
  return res.json();
}
