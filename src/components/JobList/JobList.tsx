import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import Link from "next/link";
import React from "react";

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

interface IJobListOptions {
  tag: string;
  city: string;
}

export const JobList = ({ filter }: { filter: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["featured"],
    queryFn: () => {
      return request(endpoint, FILMS_QUERY);
    },
  });

  const filteredData = data.jobs.filter((job: any) => {
    return job.tags.some((element: any) => {
      console.log(element.name);
      console.log(filter);
      return element.name === filter;
    });
  });

  console.log("FILTERED DATA");
  console.log(filteredData);

  if (filter === "recent") {
    const featuredJobs = data.jobs.slice(0, 5);
    return (
      <div>
        <ul>
          {featuredJobs.map((job) => (
            <li key={job.id}>
              {" "}
              <Link href={`/${job.company.slug}/${job.slug}`}>
                {" "}
                {job.title} | {job.company.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      {filteredData.map((item: any) => (
        <li key={item.id}>
          {" "}
          <Link href={`/jobs/${item.id}`}>
            {" "}
            {item.title} | {item.company.name}
          </Link>
        </li>
      ))}
    </div>
  );
};
