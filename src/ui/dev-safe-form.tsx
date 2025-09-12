'use cl'

import { useRef, useState } from "react";
import "./safe-dev-form.css";

interface SafeFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  disabled?: boolean;
  buttonClassName?: string;
  formClassName?: string;
  style?: React.CSSProperties;
  handleClose?: () => void;
}

function SafeDevForm({
  children,
  onSubmit,
  title,
  disabled,
  buttonClassName = "",
  formClassName = "",
  style,
  handleClose,
}: SafeFormProps) {
  const isLoadingRef = useRef(false);
  const [, setReRender] = useState(false);

  return (
    <form
      style={style}
      className={`safe-form ${formClassName}`}
      onSubmit={async (e) => {
        if (isLoadingRef.current) {
          return;
        }
        isLoadingRef.current = true;
        setReRender((prev) => !prev);
        onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
        isLoadingRef.current = false;
        setReRender((prev) => !prev);
      }}
    >
      {children}
      <div className="safe-form__actions">
        <button
          type="button"
          onClick={handleClose}
          className="safe-form__button safe-form__button--cancel"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isLoadingRef.current || disabled}
          className={`safe-form__button safe-form__button--submit ${buttonClassName}`}
        >
          {isLoadingRef.current ? "로딩 중..." : title}
        </button>
      </div>
    </form>
  );
}

export default SafeDevForm;
