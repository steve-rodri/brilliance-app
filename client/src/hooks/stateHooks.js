import { useState, useRef, useEffect } from "react";

export const usePreviousValue = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const useTraceableState = initialValue => {
  const [value, setValue] = useState(initialValue);
  const prevValue = usePreviousValue(value);
  return [value, setValue, prevValue];
};
