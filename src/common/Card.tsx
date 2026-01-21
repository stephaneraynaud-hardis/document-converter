import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import styles from "./Card.module.css";
import classNames from "@/utils/classNames";

export default function Card({
  children,
  className,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={classNames(className, styles.card)} {...props}>
      {children}
    </div>
  );
}
