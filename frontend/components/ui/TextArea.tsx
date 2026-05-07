import { TextareaHTMLAttributes } from "react";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextArea(props: TextAreaProps) {
  return (
    <textarea
      {...props}
      className={`textarea input-primary min-h-32 max-h-32 w-full ${props.className ?? ""}`}
    />
  );
}
