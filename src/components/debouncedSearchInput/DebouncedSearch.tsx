import React, { useState } from "react";
import { useDebounce } from "./useDebounce";
import Link from "next/link";
import { CITIES_KEY } from "../../services/queries";
import { INameSlug } from "../../services/useGetJobs";
import { useGetCities } from "../../services/useGetCities";

export const DebouncedSearch = ({}) => {
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const { debouncedTerm, isLoading } = useDebounce(searchTerm, 1000);
  const queryData = useGetCities(CITIES_KEY);

  if (queryData.error instanceof Error)
    return <div>{queryData.error.message}</div>;
  if (queryData.data instanceof Error) return <div>Error fetching data</div>;
  if (!queryData.data) return <div>Error fetching data</div>;

  const cities: INameSlug[] = queryData.data.cities;

  const filteredCities = cities.filter((city: INameSlug) => {
    if (!debouncedTerm) return false;
    return city.name.toLowerCase().includes(debouncedTerm);
  });

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div>
        {debouncedTerm &&
          queryData &&
          filteredCities.map((city: INameSlug) => (
            <div key={city.name}>
              <Link href={`/locations/${city.slug}`}>{city.name} </Link>
            </div>
          ))}
      </div>

      <div>{isLoading ? <div>Loading</div> : debouncedTerm}</div>
      <div>Latest</div>
    </div>
  );
};
