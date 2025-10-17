# To-Do Pin 📌

[English](#english) | [한국어](#korean)

---

![녹음 2025-10-18 032828 (1)](https://github.com/user-attachments/assets/8480b4ce-d708-4dab-ace3-2f799c361f23)


## English

### Overview
**To-Do Pin** is an npm library that allows you to store your tasks in **localStorage** and display them as a simple UI overlay.  
- Create new to-do pins with **Alt+Click** anywhere on the page.
- On MacBook, you can create a new task anywhere on the page with Option+Click.
- Track all tasks across pages using the **To-Do Tracker**.  
- Delete tasks when no longer needed.  
- Export and import tasks as JSON to **backup or restore** when localStorage is cleared.  
- Git integration to **save tasks as GitHub issues**.

### Installation
```bash
npm install to-do-pin
```

### Usage
Wrap your app with the `ToDoPinProvider`:

```tsx
import { ToDoPinProvider } from "to-do-pin";
import "to-do-pin/index.css";

export default function App() {
  return (
    <ToDoPinProvider>
      <YourApp />
    </ToDoPinProvider>
  );
}
```

### Environment Variables
To enable git integration, set the environment variable(`VITE_GITHUB_URL` and `VITE_GITHUB_TOKEN`).
VITE_GITHUB_URL should be set to your repository URL without `https://api.github.com`.
VITE_GITHUB_TOKEN should be set to your GitHub personal access token.

### Github Setting
![발급진](https://github.com/user-attachments/assets/9d21b24f-6ce7-4db5-9c9c-00afd88099de)

- **Vite / CRA**
```env
VITE_GITHUB_URL=https://api.github.com
VITE_GITHUB_TOKEN=ghp_...
```

- **Next.js**
```env
NEXT_PUBLIC_GITHUB_URL=https://api.github.com
NEXT_PUBLIC_GITHUB_TOKEN=ghp_...
```

---

## 한국어

### 개요
**To-Do Pin**은 **localStorage**에 할 일을 저장하고, 이를 간단한 UI로 표시하는 npm 라이브러리입니다.  
- **Alt+Click**으로 페이지 어디서든 새로운 할 일을 생성할 수 있습니다.
- 맥북의 경우 Option+Click으로 페이지 어디서든 새로운 할 일을 생성할 수 있습니다.
- **To-Do Tracker**를 통해 모든 페이지의 할 일을 추적할 수 있습니다.  
- 필요 없는 할 일은 삭제할 수 있습니다.  
- JSON 파일로 내보내기/불러오기를 통해 **백업 및 복구**가 가능합니다.
- 깃허브 연동을 통해 할 일을 **깃허브 이슈로 저장**할 수 있습니다.

### 설치
```bash
npm install to-do-pin
```

### 사용법
앱의 최상단에 `ToDoPinProvider`를 감싸주세요:

```tsx
import { ToDoPinProvider } from "to-do-pin";
import "to-do-pin/index.css";

export default function App() {
  return (
    <ToDoPinProvider>
      <YourApp />
    </ToDoPinProvider>
  );
}
```

### 환경 변수 설정
깃허브 연동을 위해서는 `VITE_GITHUB_URL`과 `VITE_GITHUB_TOKEN` 환경 변수를 설정해야 합니다.
VITE_GITHUB_URL은 github.com을 제외한 자신의 레포지토리 주소,
VITE_GITHUB_TOKEN은 깃허브의 토큰입니다.


### 깃허브 설정 방법
![발급진](https://github.com/user-attachments/assets/87e17ed4-fd33-4f3f-a425-a5a3bed7cd53)


- **Vite / CRA**
```env
VITE_GITHUB_URL=https://api.github.com
VITE_GITHUB_TOKEN=ghp_...
```

- **Next.js**
```env
NEXT_PUBLIC_GITHUB_URL=https://api.github.com
NEXT_PUBLIC_GITHUB_TOKEN=ghp_...
```

---

## License
MIT
