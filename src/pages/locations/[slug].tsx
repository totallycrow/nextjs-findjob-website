import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React from "react";
import { request, gql } from "graphql-request";
import Link from "next/link";

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
        slug
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

const City = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { data, isLoading, error } = useQuery({
    queryKey: ["launches"],
    queryFn: () => {
      return request(endpoint, FILMS_QUERY);
    },
  });

  console.log(data);

  if (!slug || Array.isArray(slug)) return;
  console.log(slug.toLowerCase());
  console.log(data.jobs[1].cities[0].name.toLowerCase());

  const filteredData = data.jobs.filter((job: any) => {
    if (job.cities[0] === undefined) return false;

    return job.cities[0].name.toLowerCase() === slug.toLowerCase();
  });

  console.log(filteredData);

  return (
    <div>
      <h2>{slug}</h2>

      <div>
        {" "}
        {filteredData.map((job) => (
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

export default City;

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
  await queryClient.prefetchQuery(["launches"], () => {
    return request(endpoint, FILMS_QUERY);
  });
  const data = queryClient.getQueryData(["launches"]);

  console.log("static paths");
  console.log(data.cities);

  const paths = data.cities.map((city: any) => {
    return {
      params: {
        slug: city.slug,
      },
    };
  });

  console.log(paths);

  return {
    paths: paths,
    fallback: false,
  };
}
