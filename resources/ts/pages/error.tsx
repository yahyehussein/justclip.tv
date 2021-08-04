import Layout from "@shared/layout";
import React from "react";
import Site from "@shared/site";

const Error = ({ status }: { status: 503 | 500 | 404 | 403 }): JSX.Element => {
  const title = {
    503: "503: Service Unavailable",
    500: "500: Server Error",
    404: "404: Page Not Found",
    403: "403: Forbidden",
  }[status];

  const description = {
    503: "Sorry, we are doing some maintenance. Please check back soon.",
    500: "Whoops, something went wrong on our servers.",
    404: "Sorry, the page you are looking for could not be found.",
    403: "Sorry, you are forbidden/banned from accessing this page or account.",
  }[status];

  return (
    <>
      <Site title={title}></Site>
      <div
        className="px-3 container mx-auto py-2 flex justify-center items-center flex-col"
        style={{ height: "calc(100vh - 78px)" }}
      >
        {status === 503 && <i className="fas fa-signal text-9xl"></i>}
        {status === 500 && <i className="fas fa-bug text-9xl"></i>}
        {status === 404 && (
          <i className="fas fa-exclamation-circle text-9xl"></i>
        )}
        {status === 403 && <i className="fas fa-ban text-9xl"></i>}
        <p className="text-2xl">{description}</p>
      </div>
    </>
  );
};

/* eslint-disable react/display-name */
Error.layout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default Error;
