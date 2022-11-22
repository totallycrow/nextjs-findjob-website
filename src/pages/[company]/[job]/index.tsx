import { dehydrate, QueryClient } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import React from "react";
import {
  ALL_JOBS,
  CITIES,
  CITIES_KEY,
  JOBS_KEY,
  endpoint,
} from "../../../services/queries";
import { IJobsData } from "../../../services/useGetJobs";

export const index = (props: any) => {
  console.log("************************************** component");
  console.log(props.data);
  const data = props.data;
  return <div>{data[0].slug}</div>;
};
export default index;

export async function getStaticProps(context: any) {
  const queryClient = new QueryClient();
  const params = context.params!;
  const { company } = params;
  const jobSlug = params.job;

  await queryClient.prefetchQuery([JOBS_KEY], () => {
    return request(endpoint, ALL_JOBS);
  });
  console.log("///////////////////////////////////////////");
  console.log(jobSlug);
  console.log(params);
  console.log(company);

  console.log(queryClient);
  const jobsData = queryClient.getQueryData<IJobsData>([JOBS_KEY]);
  console.log(jobsData);

  if (!jobsData) return;
  const filteredData = jobsData.jobs.filter((job) => {
    if (job.company.slug === company && job.slug === jobSlug) {
      return true;
    } else {
      return false;
    }
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      data: filteredData,
    },
  };
}

export async function getStaticPaths() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery([JOBS_KEY], () => {
    return request(endpoint, ALL_JOBS);
  });
  await queryClient.prefetchQuery([CITIES_KEY], () => {
    return request(endpoint, CITIES);
  });

  const jobsData = queryClient.getQueryData<IJobsData>([JOBS_KEY]);
  if (!jobsData) return;

  const paths = jobsData.jobs.map((city) => {
    return {
      params: {
        company: city.company.slug,
        job: city.slug,
      },
    };
  });

  console.log(paths);

  return {
    paths: paths,
    fallback: false,
  };
}
