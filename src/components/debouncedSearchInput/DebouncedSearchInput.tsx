import React, { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";

export const DebouncedSearchInput = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedTerm = useDebounce(searchTerm, 1000);

  //   when debouncedTerm changes, call API
  //   useEffect(() => {
  //     if (!debouncedTerm) return;
  //     console.log("debounced term change!");
  //   }, [debouncedTerm]);

  return (
    <div>
      <div>{debouncedTerm}</div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};
