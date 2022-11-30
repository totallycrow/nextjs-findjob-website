import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import { DebouncedSearch } from "../components/debouncedSearchInput/DebouncedSearch";
import { request, gql } from "graphql-request";
import { useState } from "react";
import { JobList } from "../components/JobList/JobList";
import { endpoint, CITIES, ALL_JOBS } from "../services/queries";
import { IJob } from "./useGetJobs";

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

export const JOBS_KEY = "jobs";

export interface INameSlug {
  name: string;
  slug: string;
}

export interface IName {
  name: string;
}

export interface IJobDetailedQuery {
  job: IJobDetailed;
}

export interface IJobDetailed {
  id: string;
  title: string;
  slug: string;
  company: INameSlug;
  cities: Array<INameSlug>;
  tags: Array<IName>;
  description: string;
}

export interface IJobsData {
  jobs: Array<IJob>;
}

export type TJobsQuery = Array<IJob>;

// gql

// fetcher

const getJob = (companySlug: string, jobSlug: string) => {
  const JOB = gql`
    {
      job(
        input: {
          companySlug: ${companySlug}
          jobSlug: ${jobSlug}
        }
      ) {
        id
      }
    }
  `;

  request(endpoint, JOB) as Promise<TJobsQuery>;
};

// export interface IJobDetailed {
//     id: string;
//     title: string;
//     slug: string;
//     company: INameSlug;
//     cities: Array<INameSlug>;
//     tags: Array<IName>;
//     description: string;
//   }

export const buildJobQuery = (companySlug: string, jobSlug: string) => {
  const query = gql`
    {
      job(
        input: {
          companySlug: "${companySlug}"
          jobSlug: "${jobSlug}"
        }
      ) {
        id,
        title,
        slug,
        company {
          name
          slug
        }
        cities {
          name
          slug
        }
        tags {
          name,
          slug
        }
        description
      }
    }
  `;
  return query;
};

// useGetJobs

export const useGetJob = (
  jobsKey: string,
  companySlug: string,
  jobSlug: string
) => {
  const job = useQuery({
    queryKey: [jobsKey],
    queryFn: () => {
      return getJob(companySlug, jobSlug);
    },
  });
  return job;
};
