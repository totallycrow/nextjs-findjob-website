import React, { useEffect, useState } from "react";

export const useDebounce = (inputValue: string, timeOutValue: number) => {
  const [debouncedTerm, setDebouncedTerm] = useState<string | undefined>(
    inputValue
  );

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedTerm(inputValue);
      }, timeOutValue);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [inputValue, timeOutValue] // Only re-call effect if value or delay changes
  );

  return debouncedTerm;
};
