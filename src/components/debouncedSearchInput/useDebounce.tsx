import { useEffect, useState, useDeferredValue } from "react";

export const useDebounce = (
  inputValue: string | undefined,
  timeOutValue: number
) => {
  const [debouncedTerm, setDebouncedTerm] = useState<string | undefined>(
    inputValue
  );
  const [isLoading, setIsLoading] = useState(false);
  console.log(inputValue);

  useEffect(
    () => {
      if (inputValue === undefined) {
        setIsLoading(false);
      } else setIsLoading(true);
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedTerm(inputValue);
        setIsLoading(false);
      }, timeOutValue);

      // Cancel the timeout if value changes (also on delay change or unmount)
      return () => {
        clearTimeout(handler);
      };
    },
    [inputValue, timeOutValue] // Only re-call effect if value or delay changes
  );

  return { debouncedTerm, isLoading };
};
