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

export type TJobsQuery = Array<IJob>;

// gql

// fetcher

const getAllJobs = () => request(endpoint, ALL_JOBS) as Promise<TJobsQuery>;

// useGetJobs

export const useGetJobs = (jobsKey: string) => {
  const jobs = useQuery<TJobsQuery>({
    queryKey: [jobsKey],
    queryFn: () => {
      return getAllJobs();
    },
  });
  return jobs;
};
