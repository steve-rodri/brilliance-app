import { useState, useEffect } from "react";
export * from "./stateHooks";

export const usePromise = (promiseOrFunction, defaultValue) => {
  const [state, setState] = useState({
    value: defaultValue,
    error: null,
    isPending: true
  });

  useEffect(() => {
    let isSubscribed = true;
    try {
      const value =
        typeof promiseOrFunction === "function"
          ? promiseOrFunction()
          : promiseOrFunction;
      if (isSubscribed)
        setState(prevState => ({ ...prevState, value, isPending: false }));
    } catch (error) {
      if (isSubscribed)
        setState(prevState => ({ ...prevState, error, isPending: false }));
    }
    return () => (isSubscribed = false);
  }, [promiseOrFunction]);

  const { value, error, isPending } = state;
  return [value, error, isPending];
};
