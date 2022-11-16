import { dehydrate, QueryClient } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import React from "react";

const endpoint = "https://api.graphql.jobs/";
const FILMS_QUERY = gql`
  {
    companies {
      slug
    }
  }
`;

export const index = () => {
  return <div>index</div>;
};
export default index;

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

export async function getStaticPaths() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["companies"], () => {
    return request(endpoint, FILMS_QUERY);
  });
  const data = queryClient.getQueryData(["companies"]);

  console.log("static paths");
  console.log(data.companies);

  const paths = data.companies.map((city: any) => {
    return {
      params: {
        company: city.slug,
      },
    };
  });

  console.log(paths);

  return {
    paths: paths,
    fallback: false,
  };
}
