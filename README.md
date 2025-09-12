# To-Do Pin 📌

[English](#english) | [한국어](#korean)

---

![npm 홍보](https://github.com/user-attachments/assets/761ba05a-ff07-4d2a-9ce2-81b0d89b959a)


## English

### Overview
**To-Do Pin** is an npm library that allows you to store your tasks in **localStorage** and display them as a simple UI overlay.  
- Create new to-do pins with **Alt+Click** anywhere on the page.
- On MacBook, you can create a new task anywhere on the page with Option+Click.
- Track all tasks across pages using the **To-Do Tracker**.  
- Delete tasks when no longer needed.  
- Export and import tasks as JSON to **backup or restore** when localStorage is cleared.  

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
To enable development mode features (tracker overlay, global pin client, etc.), set the environment variable:

- **Vite / CRA**
```env
VITE_TO_DO_PIN_ENV=development
```

- **Next.js**
```env
NEXT_PUBLIC_TO_DO_PIN_ENV=development
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
개발 모드 기능(트래커, 글로벌 핀 생성기 등)을 활성화하려면 환경 변수를 설정해야 합니다.

- **Vite / CRA**
```env
VITE_TO_DO_PIN_ENV=development
```

- **Next.js**
```env
NEXT_PUBLIC_TO_DO_PIN_ENV=development
```

---

## License
MIT
