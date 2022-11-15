import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
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

export const JobList = ({ filter }: { filter: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["launches"],
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
              {job.title} | {job.company.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return <div>{filteredData.map((item: any) => item.title)}</div>;
};
