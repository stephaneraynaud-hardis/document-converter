import {
  FormEventHandler,
  PropsWithChildren,
  TextareaHTMLAttributes,
  useCallback,
  useRef,
} from "react";

export default function Textarea({
  children,
  ...props
}: PropsWithChildren<TextareaHTMLAttributes<HTMLTextAreaElement>>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = useCallback(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";

    const computedStyle = textareaRef.current.computedStyleMap();
    const padding =
      (computedStyle.get("padding-top") as CSSUnitValue).value +
      (computedStyle.get("padding-bottom") as CSSUnitValue).value;

    textareaRef.current.style.height =
      textareaRef.current.scrollHeight - padding + "px";
  }, [textareaRef]);

  const handleInput: FormEventHandler<HTMLTextAreaElement> = useCallback(
    (...passedProps) => {
      props.onInput?.(...passedProps);
      resizeTextarea();
    },
    [resizeTextarea, props]
  );

  return (
    <textarea ref={textareaRef} {...props} onInput={handleInput}>
      {children}
    </textarea>
  );
}
