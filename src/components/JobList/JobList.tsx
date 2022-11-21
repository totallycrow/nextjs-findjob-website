import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import Link from "next/link";
import React from "react";
import {
  endpoint,
  CITIES,
  ALL_JOBS,
  JOBS_KEY,
  CITIES_KEY,
} from "../../services/queries";
import { useGetJobs } from "../../services/useGetJobs";
import { IJob } from "../../services/useGetJobs";

interface IJobListOptions {
  tag: string;
  city: string;
}

export const JobList = ({ filter }: { filter: string }) => {
  const queryData = useGetJobs(JOBS_KEY);

  // const { data, isLoading, error } = useQuery({
  //   queryKey: ["featured"],
  //   queryFn: () => {
  //     return request(endpoint, FILMS_QUERY);
  //   },
  // });

  if (!queryData.data) return <div>Error fetching data</div>;

  const filteredData = queryData.data.jobs.filter((job: IJob) => {
    return job.tags.some((element) => {
      return element.name === filter;
    });
  });

  console.log("FILTERED DATA");
  console.log(filteredData);

  if (filter === "recent") {
    const featuredJobs = queryData.data.jobs.slice(0, 5);
    return (
      <div>
        <ul>
          {featuredJobs.map((job: IJob) => (
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
      {filteredData.map((item: IJob) => (
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
