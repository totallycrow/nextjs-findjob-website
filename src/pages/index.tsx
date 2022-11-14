import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { DebouncedSearchInput } from "../components/debouncedSearchInput/DebouncedSearchInput";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const { data } = useQuery({ queryKey: ["posts"], queryFn: getPosts });

  return (
    <div>
      <h1>Home</h1>

      <div>
        <DebouncedSearchInput />
      </div>
    </div>
  );
};

export default Home;

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["posts"], getPosts);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
