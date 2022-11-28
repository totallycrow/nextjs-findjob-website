import { dehydrate, DehydratedState, QueryClient } from "@tanstack/react-query";
import React from "react";
import { request } from "graphql-request";
import Link from "next/link";
import {
  endpoint,
  CITIES,
  ALL_JOBS,
  JOBS_KEY,
  CITIES_KEY,
} from "../../services/queries";
import { IJobsData, IJob } from "../../services/useGetJobs";
import { ICityData } from "../../services/useGetCities";
import { GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { useGetJob } from "../../services/useGetJob";

const City: React.FC<Props> = (props) => {
  const filteredData = props.jobsInCity;
  const slug = props.slug;

  if (!filteredData) return <div>No Jobs Found</div>;

  return (
    <div>
      <h2>{slug}</h2>

      <div>
        {" "}
        {filteredData.map((job: any) => (
          <li key={job.id}>
            <Link href={`/${job.company.slug}/${job.slug}`}>
              {" "}
              {job.title} | {job.company.name}
            </Link>
          </li>
        ))}
      </div>
    </div>
  );
};

interface Props {
  slug: string;
  jobsInCity: IJob[];
  dehydratedState: DehydratedState;
}

interface Params extends ParsedUrlQuery {
  slug: string;
}

export default City;

// ****************** STATIC PROPS ******************
export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const queryClient = new QueryClient();
  const params = context.params!;
  const { slug } = params;

  await queryClient.prefetchQuery([JOBS_KEY], () => {
    return request(endpoint, ALL_JOBS);
  });
  await queryClient.prefetchQuery([CITIES_KEY], () => {
    return request(endpoint, CITIES);
  });
  const jobsData = queryClient.getQueryData<IJobsData>([JOBS_KEY]);
  if (!jobsData) return;

  const filteredData = jobsData.jobs.filter((job) => {
    if (job.cities[0] === undefined) return false;

    return job.cities[0].name.toLowerCase() === slug.toLowerCase();
  });

  return {
    props: {
      jobsInCity: filteredData,
      slug: slug,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

// ****************** STATIC PATHS ******************
export async function getStaticPaths() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([CITIES_KEY], () => {
    return request(endpoint, CITIES);
  });
  const data = queryClient.getQueryData<ICityData>([CITIES_KEY]);

  if (!data) return;

  const paths = data.cities.map((city) => {
    return {
      params: {
        slug: city.slug,
      },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
}
