import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { DebouncedSearchInput } from "../components/debouncedSearchInput/DebouncedSearchInput";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
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
