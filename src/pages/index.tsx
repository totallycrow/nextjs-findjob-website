import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { DebouncedSearch } from "../components/debouncedSearchInput/DebouncedSearch";
import styles from "../styles/Home.module.css";
import { request, gql } from "graphql-request";
import { useState } from "react";
import { JobList } from "../components/JobList/JobList";

const endpoint = "https://api.graphql.jobs/";
const FILMS_QUERY = gql`
  {
    cities {
      name
      slug
    }
    jobs {
      id
      title
      company {
        name
      }
      tags {
        name
      }
      postedAt
      slug
      cities {
        name
      }
      countries {
        name
      }
    }
  }
`;

const Home: NextPage = () => {
  // const { data } = useQuery({ queryKey: ["posts"], queryFn: getPosts });
  const [filter, setFilter] = useState("recent");

  const { data, isLoading, error } = useQuery({
    queryKey: ["launches"],
    queryFn: () => {
      return request(endpoint, FILMS_QUERY);
    },
  });

  console.log(data);
  console.log(filter);

  const handleFilterChange = (filter: string) => {
    console.log(filter);
    setFilter(filter);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <pre>{error.message}</pre>;

  const featuredJobs = data.jobs.slice(0, 5);

  return (
    <div>
      <h1>Location</h1>

      <div>
        <DebouncedSearch data={data} />
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

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["launches"], () => {
    return request(endpoint, FILMS_QUERY);
  });
  await queryClient.prefetchQuery(["launches-2"], () => {
    return request(endpoint, FILMS_QUERY);
  });

  console.log(queryClient);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
