import React, { useEffect, useState } from "react";

import type { Clip } from "../../types/clip";
import Confirm from "@shared/confirm";
import Grid from "@shared/grid";
import { Inertia } from "@inertiajs/inertia";
import { InertiaLink } from "@inertiajs/inertia-react";
import Layout from "@shared/layout";
import type { Pagination } from "../../types/pagination";
import Site from "@shared/site";

const ClipReports = (props: {
  clips: Pagination<Clip>;
  clips_count: number;
  clip_bullet_chats_count: number;
  comments_count: number;
  users_count: number;
}): JSX.Element => {
  const [clips, setClips] = useState<Pagination<Clip>>(props.clips);

  const onClickApproved = (id: number, confirm: boolean, rule?: string) => {
    if (confirm) {
      Inertia.delete(`/reports/${id}?approved=1&type=clip&rule=${rule}`);
    }
  };

  const onClickDenied = (id: number, confirm: boolean) => {
    if (confirm) {
      Inertia.delete(`/reports/${id}?approved=0&type=clip`);
    }
  };

  useEffect(() => {
    setClips(props.clips);
  }, [props.clips]);

  return (
    <>
      <Site title="Clip Reports"></Site>
      <Grid fluid>
        <div className="flex items-center border mb-2">
          <InertiaLink
            href="/clip/reports"
            className="p-3 flex-1 border-r uppercase bg-secondary focus:outline-none text-center"
          >
            <span className="inline-block align-middle mr-2">Clips</span>
            <span className="bg-primary rounded-md text-xs font-semibold inline-block align-middle text-white-light px-2 py-1">
              {props.clips_count}
            </span>
          </InertiaLink>
          <InertiaLink
            href="/clip-bullet-chats/reports"
            className="p-3 flex-1 border-r uppercase hover:bg-secondary focus:outline-none text-center"
          >
            <span className="inline-block align-middle mr-2">
              Clip Bullet Chats
            </span>
            <span className="bg-primary rounded-md text-xs font-semibold inline-block align-middle text-white-light px-2 py-1">
              {props.clip_bullet_chats_count}
            </span>
          </InertiaLink>
          <InertiaLink
            href="/comments/reports"
            className="p-3 flex-1 border-r uppercase hover:bg-secondary focus:outline-none text-center"
          >
            <span className="inline-block align-middle mr-2">Comments</span>
            <span className="bg-primary rounded-md text-xs font-semibold inline-block align-middle text-white-light px-2 py-1">
              {props.comments_count}
            </span>
          </InertiaLink>
          <InertiaLink
            href="/users/reports"
            className="p-3 flex-1 uppercase hover:bg-secondary focus:outline-none text-center"
          >
            <span className="inline-block align-middle mr-2">Users</span>
            <span className="bg-primary rounded-md text-xs font-semibold inline-block align-middle text-white-light px-2 py-1">
              {props.users_count}
            </span>
          </InertiaLink>
        </div>
        <>
          {clips?.data?.map((clip) => {
            return (
              <div key={clip.id} className="mb-2">
                <InertiaLink
                  href={`/clip/${clip.slug}`}
                  className="border px-4 py-4 flex flex-col group hover:border-muted"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-col">
                      <p className="text-sm text-muted uppercase">
                        {clip.report && clip.report.report.type} |{" "}
                        <span className="text-red-persimmon font-bold">
                          {clip.report_count}{" "}
                          {clip.report_count && clip.report_count > 1
                            ? "reports"
                            : "report"}
                        </span>
                      </p>
                      <p className="font-bold text-xl text-primary group-hover:underline leading-4">
                        {clip.title}
                        {clip.spoiler ? (
                          <span className="border border-gray-chateau text-xs px-1 pb-1 inline-block align-middle ml-1 rounded-md font-semibold text-gray-chateau leading-3">
                            spoiler
                          </span>
                        ) : null}
                        {clip.tos ? (
                          <span className="border border-red-persimmon text-xs px-1 pb-1 inline-block align-middle ml-1 rounded-md text-red-persimmon font-semibold leading-3">
                            tos
                          </span>
                        ) : null}
                      </p>
                    </div>
                    {clip.spoiler || clip.tos ? (
                      <div className="overflow-hidden">
                        <img
                          src={clip.thumbnail.replace(/\d+x\d+/g, "260x147")}
                          width={90}
                          height={50}
                          alt="thumbnail"
                          className="blur-player"
                        />
                      </div>
                    ) : (
                      <img
                        src={clip.thumbnail.replace(/\d+x\d+/g, "260x147")}
                        width={90}
                        height={50}
                        alt="thumbnail"
                      />
                    )}
                  </div>
                </InertiaLink>

                {clip.report && (
                  <>
                    <div className="border-r border-b border-l bg-dark">
                      <div className="p-4">
                        <p className="text-2xl mb-2 underline uppercase text-red-persimmon">
                          {clip.report.report.rule}
                        </p>
                      </div>
                    </div>

                    <div className="flex p-2 border-r border-b border-l space-x-2">
                      <Confirm
                        id={clip.id}
                        title="Approve Report?"
                        rule={clip.report.report.rule}
                        description={`Removed - ${clip.report.report.rule}`}
                        className="rounded-sm p-2 focus:outline-none bg-secondary hover:bg-opacity-80 flex-1 border uppercase"
                        onConfirmed={onClickApproved}
                      >
                        <>Approve</>
                      </Confirm>
                      <Confirm
                        id={clip.id}
                        title="Deny Report?"
                        description={`Denied - ${clip.report.report.rule}`}
                        className="rounded-sm p-2 focus:outline-none bg-secondary hover:bg-opacity-80 flex-1 uppercase border"
                        onConfirmed={onClickDenied}
                      >
                        <>Deny</>
                      </Confirm>
                    </div>
                  </>
                )}
              </div>
            );
          })}
          <div className="flex flex-wrap justify-center">
            {props.clips.links &&
              props.clips.links?.length > 3 &&
              props.clips.links.map((link) => {
                return (
                  <React.Fragment key={link.label}>
                    {link.url === null ? (
                      <div
                        className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    ) : (
                      <InertiaLink
                        className={`mr-1 mb-1 px-4 py-3 text-sm leading-4 rounded hover:bg-opacity-80 focus:outline-none ${
                          link.active ? "bg-primary text-white-light" : ""
                        }`}
                        href={link.url}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
          </div>
          {!!!props.clips_count && (
            <div className="flex items-center justify-center flex-col pt-10">
              <img
                src="https://cdn.frankerfacez.com/emoticon/557676/4"
                alt="PauseChamp"
              />
              <p className="text-3xl">No Reports...</p>
              <p>Thanks for keeping Justclip safe</p>
            </div>
          )}
        </>
      </Grid>
    </>
  );
};

/* eslint-disable react/display-name */
ClipReports.layout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default ClipReports;
