import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import { DebouncedSearch } from "../components/debouncedSearchInput/DebouncedSearch";
import { request, gql } from "graphql-request";
import { useState } from "react";
import { JobList } from "../components/JobList/JobList";
import { endpoint, CITIES, ALL_JOBS } from "../services/queries";

// {
//     jobs {
//       id
//       title
//       tags {
//         name
//       }
//       slug
//       company {
//         slug
//         name
//       }
//       cities {
//         name
//       }
//     }
//   }
// `;

export interface INameSlug {
  name: string;
  slug: string;
}

export interface ICityData {
  cities: Array<INameSlug>;
}

export interface ICitiesQuery {
  data: ICityData;
  error: Error;
  isError: boolean;
  isLoading: boolean;
}

export const useGetCities = (citiesKey: string) => {
  const citiesData = useQuery<ICitiesQuery | Error>({
    queryKey: [citiesKey],
    queryFn: () => {
      return request(endpoint, CITIES);
    },
  });
  return citiesData;
};
