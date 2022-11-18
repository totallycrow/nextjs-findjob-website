import { dehydrate, QueryClient } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import React from "react";

const endpoint = "https://api.graphql.jobs/";
const FILMS_QUERY = gql`
  {
    companies {
      slug
    }
    jobs {
      slug
      company {
        slug
      }
    }
  }
`;

export const index = () => {
  return <div>index</div>;
};
export default index;

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["pages"], () => {
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
  await queryClient.prefetchQuery(["pages"], () => {
    return request(endpoint, FILMS_QUERY);
  });
  const data = queryClient.getQueryData(["pages"]);
  console.log(data);

  console.log("static paths");
  console.log(data.companies);

  const paths = data.jobs.map((city: any) => {
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
