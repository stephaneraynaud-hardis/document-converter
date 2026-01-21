"use client";
import { createContext, Provider, useContext } from "react";

/**
 * Creates a non-null context provider and hook.
 */
export function createRequiredContext<T>(): [Provider<T>, () => T] {
  // Context, initialized with null
  const context = createContext<T | null>(null);

  // Provider with null excluded (only T values are allowed)
  const Provider = context.Provider as Provider<T>;

  // Hook that throws an error if the value is null
  const useStrictContext = () => {
    const value = useContext(context);
    if (value !== null) return value;
    throw new Error("Missing context provider");
  };

  return [Provider, useStrictContext];
}
