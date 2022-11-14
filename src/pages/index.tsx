import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { DebouncedSearch } from "../components/debouncedSearchInput/DebouncedSearch";
import styles from "../styles/Home.module.css";
import { request, gql } from "graphql-request";

const endpoint = "https://api.graphql.jobs/";
const FILMS_QUERY = gql`
  {
    cities {
      name
    }
    jobs {
      id
      title
      company {
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

  const { data, isLoading, error } = useQuery({
    queryKey: ["launches"],
    queryFn: () => {
      return request(endpoint, FILMS_QUERY);
    },
  });

  console.log(data);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <pre>{error.message}</pre>;

  return (
    <div>
      <h1>Location</h1>

      <div>
        <DebouncedSearch data={data} />
      </div>
      <div>
        <h1>Test</h1>
        <ul>
          {data.cities.map((launch) => (
            <li key={launch.name}>{launch.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["launches"], () => {
    return request(endpoint, FILMS_QUERY);
  });

  console.log(queryClient);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
