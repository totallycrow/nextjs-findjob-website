import React, { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";

export const DebouncedSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

  const { debouncedTerm, isLoading } = useDebounce(searchTerm, 1000);
  const [cities, setCities] = useState([""]);

  //   when debouncedTerm changes, call API
  //   useEffect(() => {
  //     if (!debouncedTerm) return;
  //     console.log("debounced term change!");
  //   }, [debouncedTerm]);

  console.log("SEARCH TERM");
  console.log(searchTerm);

  //
  useEffect(() => {
    console.log(debouncedTerm);
    console.log(isLoading);
  }, [searchTerm, debouncedTerm, isLoading]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div>{isLoading === true ? <div>Loading</div> : debouncedTerm}</div>
    </div>
  );
};
