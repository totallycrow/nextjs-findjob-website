import React, { useState } from "react";

export const useFilter = () => {
  const [filter, setFilter] = useState("recent");

  const handleFilterChange = (filter: string) => {
    console.log(filter);
    setFilter(filter);
  };

  return { filter, handleFilterChange };
};
