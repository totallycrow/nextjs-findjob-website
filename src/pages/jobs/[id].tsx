import React from "react";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { request, gql } from "graphql-request";

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

export const Job = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, error } = useQuery({
    queryKey: ["launches"],
    queryFn: () => {
      return request(endpoint, FILMS_QUERY);
    },
  });

  console.log(data);

  if (!id || Array.isArray(id)) return;

  const filteredData = data.jobs.filter((job: any) => {
    if (job.id === undefined) return false;

    return job.id === id;
  });

  console.log(filteredData);

  return (
    <div>
      <h2>{id}</h2>

      <div>
        {" "}
        {filteredData.map((job) => (
          <li key={job.id}>
            {job.title} | {job.company.name}
          </li>
        ))}
      </div>
    </div>
  );
};

export default Job;

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

export async function getStaticPaths() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["launches"], () => {
    return request(endpoint, FILMS_QUERY);
  });
  const data = queryClient.getQueryData(["launches"]);

  console.log("static paths");
  console.log(data.cities);

  const paths = data.jobs.map((job: any) => {
    return {
      params: {
        id: job.id,
      },
    };
  });

  console.log(paths);

  return {
    paths: paths,
    fallback: false,
  };
}
