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

interface IJobPageNoData {
  dehydratedState: DehydratedState;
  data: ["NO_DATA"];
}

// interface IIndex {
//   ui: {
//     section1: {
//       dummyData: 1;
//       sharedData: {};

//       products: [
//         {
//           title: string;
//           img: { src: string };
//           price: {};
//         }
//       ];
//     };
//     section2: 2;
//   };
//   state: {
//     products: [
//       {
//         id: 13213;
//         discound_id: 1213123;
//         rerefer: 12321;
//         title: string;
//         img: { src: string };
//         price: {};
//       }
//     ];
//   };
// }

export const JobPage = (props: IJobPage) => {
  // dispatch({ type: SET_PRODUCTS, payload: props.sharedData.products });
  console.log(props);

  return <div>{props.sectionHeading.title}</div>;
};
export default JobPage;

interface Params extends ParsedUrlQuery {
  company: string;
  job: string;
}

// ****************** STATIC PROPS ******************
export const getStaticProps: GetStaticProps<IJobPage, Params> = async (
  context
) => {
  const queryClient = new QueryClient();
  const params = context.params!;

  const jobSlug = params.job;
  const companySlug = params.company;

  const jobQuery = buildJobQuery(companySlug, jobSlug);
  console.log(jobQuery);

  await queryClient.prefetchQuery([JOB_KEY], () => {
    return request(endpoint, jobQuery);
  });

  const jobsData = queryClient.getQueryData<IJobDetailedQuery>([JOB_KEY]);

  console.log("???????????????????????????????????");
  console.log(context);
  console.log(jobsData);

  if (!jobsData)
    //   return {
    //     props: {
    //       dehydratedState: dehydrate(queryClient),
    //       data: ["NO_DATA"],
    //     },
    //   };
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        sharedData: {
          id: "",
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

  // const filteredData = jobsData.jobs.filter((job) => {
  //   if (job.company.slug === company && job.slug === jobSlug) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // });

  // interface IJobPage {
  //   dehydratedState: DehydratedState;
  //   sharedData: {
  //     id: string;
  //     tags: string[];
  //     slug: string;
  //   };
  //   sectionHeading: {
  //     title: string;
  //     company: string;
  //   };
  //   sectionBody: {
  //     description: string;
  //   };
  // }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      sharedData: {
        id: jobsData.job.id,
        tags: jobsData.job.tags,
        slug: jobsData.job.slug,
      },
      sectionHeading: {
        title: jobsData.job.title,
        company: jobsData.job.company,
      },
      sectionBody: {
        description: jobsData.job.description,
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
