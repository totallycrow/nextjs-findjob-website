import React, { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";
import { request, gql } from "graphql-request";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";

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

export const DebouncedSearch = ({}) => {
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const { debouncedTerm, isLoading } = useDebounce(searchTerm, 1000);

  const { data } = useQuery({
    queryKey: ["launches"],
    queryFn: () => {
      return request(endpoint, FILMS_QUERY);
    },
  });

  const cities = data.cities.filter((city: string) => {
    return city.name.toLowerCase().includes(debouncedTerm);
  });

  //   when debouncedTerm changes, call API
  //   useEffect(() => {
  //     if (!debouncedTerm) return;
  //     console.log("debounced term change!");
  //   }, [debouncedTerm]);

  console.log("SEARCH TERM");
  console.log(searchTerm);

  //
  useEffect(() => {
    console.log("Use Effect");
    console.log(debouncedTerm);
    console.log(isLoading);
    console.log(data);
  }, [searchTerm, debouncedTerm, isLoading]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div>
        {debouncedTerm &&
          data &&
          cities.map((city: any) => <div key={city.name}>{city.name}</div>)}
      </div>

      <div>{isLoading === true ? <div>Loading</div> : debouncedTerm}</div>
      <div>Latest</div>
    </div>
  );
};

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
