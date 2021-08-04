import * as Sentry from "@sentry/react";

import { Inertia } from "@inertiajs/inertia";
import { InertiaApp } from "@inertiajs/inertia-react";
import { InertiaProgress } from "@inertiajs/progress";
import { Integrations } from "@sentry/tracing";
import React from "react";
import ReactModal from "react-modal";
import axios from "axios";
import { render } from "react-dom";
import { toast } from "react-toastify";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Inertia.on("navigate", (event) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  gtag("event", "page_view", {
    page_location: event.detail.page.url,
  });
});

InertiaProgress.init({ color: "#4D8844" });

const el = document.getElementById("app");

if (el) {
  ReactModal.setAppElement(el);
}

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response) {
      toast.dark(
        <div className="flex flex-col space-y-1">
          <span className="font-semibold">
            {error.response.status === 401 && "401: Unauthorized"}
            {error.response.status === 404 && "404: Not Found"}
            {error.response.status === 403 && "403: Forbidden"}
            {error.response.status === 409 && "409: Conflict"}
            {error.response.status === 422 && "422: Unprocessable Entity"}
            {error.response.status === 500 && "503: Service Unavailable"}
          </span>
          {error.response.status === 401 && (
            <p>
              {error.response.data.message} You need to login with a Twitch
              account
            </p>
          )}
          {error.response.status === 404 && (
            <p>{error.response.data.message}</p>
          )}
          {error.response.status === 403 && (
            <p>{error.response.data.message}</p>
          )}
          {error.response.status === 409 && (
            <p
              dangerouslySetInnerHTML={{ __html: error.response.data.message }}
            ></p>
          )}
          {error.response.status === 422 && (
            <p>{error.response.data.message}</p>
          )}
          {error.response.status === 500 && <p>Server Error</p>}
        </div>,
        {
          autoClose: false,
        }
      );
    }
    return Promise.reject(error);
  }
);

Sentry.init({
  dsn:
    "https://ebdede01a4044c0da5a8d618ce8a9b15@o878843.ingest.sentry.io/5878583",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

render(
  <InertiaApp
    initialPage={JSON.parse(el?.dataset.page ? el.dataset.page : "")}
    resolveComponent={(name: string) =>
      import(`./pages/${name}`).then((module) => module.default)
    }
  />,
  el
);
