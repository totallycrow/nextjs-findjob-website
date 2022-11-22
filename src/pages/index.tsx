import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import { DebouncedSearch } from "../components/debouncedSearchInput/DebouncedSearch";
import { request } from "graphql-request";
import { JobList } from "../components/JobList/JobList";
import {
  endpoint,
  CITIES,
  ALL_JOBS,
  JOBS_KEY,
  CITIES_KEY,
} from "../services/queries";
import { useGetJobs } from "../services/useGetJobs";
import { useFilter } from "../hooks/useFilter";

const Home: NextPage = () => {
  const jobs = useGetJobs(JOBS_KEY);
  const { filter, handleFilterChange } = useFilter();

  if (jobs.error instanceof Error) return <pre>{jobs.error.message}</pre>;
  console.log(jobs.data);

  return (
    <div>
      <h1>Location</h1>

      <div>
        <DebouncedSearch />{" "}
      </div>
      <div>
        <h1>Test</h1>
        <div>
          <button onClick={() => handleFilterChange("recent")}>Recent</button>
          <button onClick={() => handleFilterChange("React")}>React</button>
          <button onClick={() => handleFilterChange("TypeScript")}>
            TypeScript
          </button>
        </div>
      </div>
      <JobList filter={filter} />
    </div>
  );
};

export default Home;

// ****************** STATIC PROPS ******************

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery([JOBS_KEY], () => {
    return request(endpoint, ALL_JOBS);
  });
  await queryClient.prefetchQuery([CITIES_KEY], () => {
    return request(endpoint, CITIES);
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
