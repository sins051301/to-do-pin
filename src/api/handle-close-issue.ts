const handleCloseIssue = async (issueNumber: number) => {
  const gitUrl =
    import.meta.env.VITE_GITHUB_URL || process.env.NEXT_PUBLIC_GITHUB_URL;
  const gitToken =
    import.meta.env.VITE_GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;

  if (!gitUrl || !gitToken) {
    console.error("❌ GitHub URL 또는 Token 없음");
    return;
  }

  const res = await fetch(`${gitUrl}/${issueNumber}`, {
    method: "PATCH",
    headers: {
      Authorization: `token ${gitToken}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      state: "closed",
    }),
  });

  if (!res.ok) {
    console.error("❌ GitHub Issue 닫기 실패:", await res.text());
  } else {
    console.log("✅ GitHub Issue 닫힘");
  }
};

export default handleCloseIssue;
