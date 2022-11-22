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

export interface IName {
  name: string;
}

export interface IJob {
  id: string;
  title: string;
  slug: string;
  company: INameSlug;
  cities: Array<INameSlug>;
  tags: Array<IName>;
}

export interface IJobsData {
  jobs: Array<IJob>;
}

export interface IJobsQuery {
  data: {
    jobs: Array<IJob>;
  };

  error: Error;
  isError: boolean;
  isLoading: boolean;
}

export const useGetJobs = (jobsKey: string) => {
  const jobs = useQuery<IJobsQuery | Error>({
    queryKey: [jobsKey],
    queryFn: () => {
      return request(endpoint, ALL_JOBS);
    },
  });
  return jobs;
};
