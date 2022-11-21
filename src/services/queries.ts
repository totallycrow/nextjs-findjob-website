import { gql } from "graphql-request";

export const endpoint = "https://api.graphql.jobs/";

export const CITIES_KEY = "cities";
export const CITIES = gql`
  {
    cities {
      name
      slug
    }
  }
`;

export const JOBS_KEY = "jobs";
export const ALL_JOBS = gql`
  {
    jobs {
      id
      title
      tags {
        name
      }
      slug
      company {
        slug
        name
      }
      cities {
        name
      }
    }
  }
`;

export const JOB_QUERY = gql`
  {
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

// job(input: {
//     jobSlug:"senior-fullstack-engineer-platform"
//     companySlug:"segment"
//   }) {
//     title
//     slug
//     id
//     isFeatured
//     postedAt
//     company{
//       slug
//     }
//   }

// export const CITIES_QUERY = gql`
//   {
//     cities {
//       name
//       slug
//     }
//     jobs {
//       id
//       title
//       company {
//         name
//         slug
//       }
//       tags {
//         name
//       }
//       postedAt
//       slug
//       cities {
//         name
//       }
//       countries {
//         name
//       }
//     }
//   }
// `;
