import { dehydrate, QueryClient } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import React from "react";
import {
  ALL_JOBS,
  CITIES,
  CITIES_KEY,
  JOBS_KEY,
  endpoint,
} from "../../../services/queries";
import { IJobsData } from "../../../services/useGetJobs";

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

export const index = (props: any) => {
  // dispatch({ type: SET_PRODUCTS, payload: props.sharedData.products });

  const data = props.data;
  return (
    <div>
      {data[0].slug}

      {/* <Section1 {...props.section1} /> */}
    </div>
  );
};
export default index;

export async function getStaticProps(context: any) {
  const queryClient = new QueryClient();
  const params = context.params!;
  const { company } = params;
  const jobSlug = params.job;

  await queryClient.prefetchQuery([JOBS_KEY], () => {
    return request(endpoint, ALL_JOBS);
  });

  const jobsData = queryClient.getQueryData<IJobsData>([JOBS_KEY]);
  console.log(jobsData);

  if (!jobsData) return;
  const filteredData = jobsData.jobs.filter((job) => {
    if (job.company.slug === company && job.slug === jobSlug) {
      return true;
    } else {
      return false;
    }
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      data: filteredData,
    },
  };
}

// export const getStaticPaths = staticPathsFactory<IJobsData>({ keys: [JOBS_KEY, CITIES], preprocessor: preprocessor })

// const queryClient = new QueryClient();

// await queryClient.prefetchQuery([JOBS_KEY], () => {
//   return request(endpoint, ALL_JOBS);
// });
// await queryClient.prefetchQuery([CITIES_KEY], () => {
//   return request(endpoint, CITIES);
// });

// const jobsData = queryClient.getQueryData<IJobsData>([JOBS_KEY]);
// if (!jobsData) return;

// const paths = jobsData.jobs.map((city) => {
//   return {
//     params: {
//       company: city.company.slug,
//       job: city.slug,
//     },
//   };
// });

// return {
//   paths: paths,
//   fallback: false,
// };
