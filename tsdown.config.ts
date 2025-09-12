import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: ["src/index.ts"], // 반드시 ToDoPinProvider 등 export
    format: ["cjs", "esm"], // CJS + ESM 동시 빌드
    dts: true, // 타입 선언 파일 생성
    clean: true, // 빌드 시 dist 삭제
    tsconfig: "tsconfig.build.json", // 빌드용 tsconfig
    external: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react-router-dom",
      "lucide-react",
    ],
    outDir: "dist", // 출력 경로
  },
]);
