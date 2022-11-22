import React, { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";
import { request, gql } from "graphql-request";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  endpoint,
  CITIES,
  ALL_JOBS,
  JOBS_KEY,
  CITIES_KEY,
} from "../../services/queries";
import { IName, INameSlug, useGetJobs } from "../../services/useGetJobs";
import { ICityData, useGetCities } from "../../services/useGetCities";
import { useFilter } from "../../hooks/useFilter";

export const DebouncedSearch = ({}) => {
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const { debouncedTerm, isLoading } = useDebounce(searchTerm, 1000);

  const queryData = useGetCities(CITIES_KEY);
  //
  // useEffect(() => {
  //   console.log("Use Effect");
  //   console.log(debouncedTerm);
  //   console.log(isLoading);
  //   console.log(data);
  // }, [searchTerm, debouncedTerm, isLoading]);

  console.log(queryData.data);

  if (queryData.error instanceof Error)
    return <pre>{queryData.error.message}</pre>;
  if (queryData.data instanceof Error) return <div>Error fetching data</div>;
  if (!queryData.data) return <div>Error fetching data</div>;

  const cities: INameSlug[] = queryData.data.cities;

  console.log("CITIES");
  console.log(cities);

  const filteredCities = cities.filter((city: INameSlug) => {
    if (!debouncedTerm) return false;
    return city.name.toLowerCase().includes(debouncedTerm);
  });

  //   when debouncedTerm changes, call API
  //   useEffect(() => {
  //     if (!debouncedTerm) return;
  //     console.log("debounced term change!");
  //   }, [debouncedTerm]);

  console.log("SEARCH TERM");
  console.log(searchTerm);

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

      <div>{isLoading === true ? <div>Loading</div> : debouncedTerm}</div>
      <div>Latest</div>
    </div>
  );
};

// export async function getStaticProps() {
//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery(["launches"], () => {
//     return request(endpoint, FILMS_QUERY);
//   });

//   console.log(queryClient);

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   };
// }
