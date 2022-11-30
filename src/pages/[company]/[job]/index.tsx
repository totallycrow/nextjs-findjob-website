import { dehydrate, DehydratedState, QueryClient } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import React from "react";
import {
  ALL_JOBS,
  JOBS_KEY,
  endpoint,
  JOB_KEY,
} from "../../../services/queries";
import { IJobsData, IName } from "../../../services/useGetJobs";
import { buildJobQuery, IJobDetailedQuery } from "../../../services/useGetJob";
import { GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { JobItem } from "../../../components/JobItem/JobItem";

interface IJobPage {
  dehydratedState: DehydratedState;
  sharedData: {
    id: string;
    tags: Array<IName>;
    slug: string;
  };
  sectionHeading: {
    title: string;
    company: {
      name: string;
      slug: string;
    };
  };
  sectionBody: {
    description: string;
  };
}

interface Params extends ParsedUrlQuery {
  company: string;
  job: string;
}

export const JobPage = (props: IJobPage) => {
  return (
    <div>
      <JobItem
        heading={props.sectionHeading.title}
        companyName={props.sectionHeading.company.name}
        description={props.sectionBody.description}
      />
    </div>
  );
};
export default JobPage;

// ****************** STATIC PROPS ******************
export const getStaticProps: GetStaticProps<IJobPage, Params> = async (
  context
) => {
  const queryClient = new QueryClient();
  const params = context.params!;

  const jobSlug = params.job;
  const companySlug = params.company;

  const jobQuery = buildJobQuery(companySlug, jobSlug);

  await queryClient.prefetchQuery([JOB_KEY], () => {
    return request(endpoint, jobQuery);
  });

  const jobsData = queryClient.getQueryData<IJobDetailedQuery>([JOB_KEY]);

  if (!jobsData)
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        sharedData: {
          id: "NO_DATA",
          tags: [{ name: "", slug: "" }],
          slug: "",
        },
        sectionHeading: {
          title: "",
          company: { name: "", slug: "" },
        },
        sectionBody: {
          description: "",
        },
      },
    };

  const { id, tags, slug, title, company, description } = jobsData.job;

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      sharedData: {
        id: id,
        tags: tags,
        slug: slug,
      },
      sectionHeading: {
        title: title,
        company: company,
      },
      sectionBody: {
        description: description,
      },
    },
  };
};

// ****************** STATIC PATHS ******************

// export const getStaticPaths = staticPathsFactory<IJobsData>({ keys: [JOBS_KEY, CITIES], preprocessor: preprocessor })
export async function getStaticPaths() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery([JOBS_KEY], () => {
    return request(endpoint, ALL_JOBS);
  });

  const jobsData = queryClient.getQueryData<IJobsData>([JOBS_KEY]);
  if (!jobsData)
    return {
      paths: [],
      fallback: false,
    };

  const paths = jobsData.jobs.map((job) => {
    return {
      params: {
        company: job.company.slug,
        job: job.slug,
      },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
}
