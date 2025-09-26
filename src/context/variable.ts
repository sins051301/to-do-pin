export const gitUrl =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_GITHUB_URL) ||
  (typeof process !== "undefined" ? process.env.NEXT_PUBLIC_GITHUB_URL : "") ||
  "";

export const gitToken =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_GITHUB_TOKEN) ||
  (typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_GITHUB_TOKEN
    : "") ||
  "";

export const devEnv =
  (typeof import.meta !== "undefined" && import.meta.env?.MODE) ||
  (typeof process !== "undefined" ? process.env.NODE_ENV : "") ||
  "";
