import React from "react";

interface IJobItemProps {
  heading: string;
  description: string;
  companyName: string;
}

export const JobItem = ({
  heading,
  description,
  companyName,
}: IJobItemProps) => {
  return (
    <div>
      <header>
        <h1>
          {heading} | {companyName}
        </h1>
      </header>
      <section>
        <h2>Job Description</h2>
        <p>{description}</p>
      </section>
    </div>
  );
};
