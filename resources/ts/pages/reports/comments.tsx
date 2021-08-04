import React, { useEffect, useState } from "react";

import type { Comment } from "../../types/comment";
import Confirm from "@shared/confirm";
import Grid from "@shared/grid";
import { Inertia } from "@inertiajs/inertia";
import { InertiaLink } from "@inertiajs/inertia-react";
import Layout from "@shared/layout";
import type { Pagination } from "../../types/pagination";
import Site from "@shared/site";
import { formatText } from "../../utils";
import moment from "moment";

const CommentsReports = (props: {
  asset_url: string;
  comments: Pagination<Comment>;
  clips_count: number;
  clip_bullet_chats_count: number;
  comments_count: number;
  users_count: number;
}): JSX.Element => {
  const [comments, setComments] = useState<Pagination<Comment>>(props.comments);

  const onClickApproved = (id: number, confirm: boolean) => {
    if (confirm) {
      Inertia.delete(`/reports/${id}?approved=1&type=comment`);
    }
  };

  const onClickDenied = (id: number, confirm: boolean) => {
    if (confirm) {
      Inertia.delete(`/reports/${id}?approved=0&type=comment`);
    }
  };

  useEffect(() => {
    setComments(props.comments);
  }, [props.comments]);

  return (
    <>
      <Site title="Comments Reports"></Site>
      <Grid fluid>
        <div className="flex items-center border mb-2">
          <InertiaLink
            href="/clip/reports"
            className="p-3 flex-1 border-r uppercase hover:bg-secondary focus:outline-none text-center"
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
            className="p-3 flex-1 border-r uppercase bg-secondary focus:outline-none text-center"
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
          {comments?.data?.map((comment) => {
            return (
              <div key={comment.id} className="mb-2">
                {comment.clip && (
                  <InertiaLink
                    href={`/clip/${comment.clip.slug}`}
                    className="border px-4 py-4 flex flex-col group hover:border-muted"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex flex-col">
                        <p className="text-sm text-muted uppercase">
                          {comment.report && comment.report.report.type} |{" "}
                          <span className="text-red-persimmon font-bold">
                            {comment.report_count}{" "}
                            {comment.report_count && comment.report_count > 1
                              ? "reports"
                              : "report"}
                          </span>
                        </p>
                        <p className="font-bold text-xl text-primary group-hover:underline leading-4">
                          {comment.clip.title}
                          {comment.clip.spoiler ? (
                            <span className="border border-gray-chateau text-xs px-1 pb-1 inline-block align-middle ml-1 rounded-md font-semibold text-gray-chateau leading-3">
                              spoiler
                            </span>
                          ) : null}
                          {comment.clip.tos ? (
                            <span className="border border-red-persimmon text-xs px-1 pb-1 inline-block align-middle ml-1 rounded-md text-red-persimmon font-semibold leading-3">
                              tos
                            </span>
                          ) : null}
                        </p>
                      </div>
                      {comment.clip.spoiler || comment.clip.tos ? (
                        <div className="overflow-hidden">
                          <img
                            src={comment.clip.thumbnail.replace(
                              /\d+x\d+/g,
                              "260x147"
                            )}
                            width={90}
                            height={50}
                            alt="thumbnail"
                            className="blur-player"
                          />
                        </div>
                      ) : (
                        <img
                          src={comment.clip.thumbnail.replace(
                            /\d+x\d+/g,
                            "260x147"
                          )}
                          width={90}
                          height={50}
                          alt="thumbnail"
                        />
                      )}
                    </div>
                  </InertiaLink>
                )}

                <div className="border-r border-b border-l p-4">
                  <div className="flex">
                    {comment.user ? (
                      <InertiaLink
                        href={`/${comment.user.login}`}
                        className="mr-3"
                      >
                        <img
                          src={comment.user.avatar.replace(/\d+x\d+/g, "70x70")}
                          alt="avatar"
                          width="48"
                          height="48"
                          className="ring-2 ring-primary"
                        />
                      </InertiaLink>
                    ) : (
                      <img
                        src={`${
                          props.asset_url ? props.asset_url : ""
                        }/images/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-70x70.png`}
                        alt="avatar"
                        width="48"
                        height="48"
                      />
                    )}
                    <div className="flex flex-col flex-1 justify-center">
                      <div className="flex justify-between items-end">
                        <div className="flex items-center text-sm space-x-1">
                          {comment.user ? (
                            <InertiaLink href={`/${comment.user.login}`}>
                              <span className="hover:underline">
                                {comment.user.display_name}
                              </span>
                            </InertiaLink>
                          ) : (
                            <span>[DELETED]</span>
                          )}
                          <span className="text-muted">&#8226;</span>
                          <span className="text-muted">
                            {moment(comment.created_at).fromNow()}
                          </span>
                        </div>
                      </div>
                      <p
                        className="my-1 break-words"
                        dangerouslySetInnerHTML={{
                          __html: formatText(comment.text, comment.emotes),
                        }}
                      ></p>
                    </div>
                  </div>
                </div>

                {comment.report && (
                  <>
                    <div className="border-r border-b border-l">
                      <div className="p-4">
                        <p className="text-2xl mb-2 underline uppercase text-red-persimmon">
                          {comment.report.report.rule}
                        </p>
                      </div>
                    </div>

                    <div className="flex p-2 border-r border-b border-l space-x-2">
                      <Confirm
                        id={comment.id}
                        title="Approve Report?"
                        description={`Removed - ${comment.report.report.rule}`}
                        className="rounded-sm p-2 focus:outline-none bg-secondary hover:bg-opacity-80 flex-1 border uppercase"
                        onConfirmed={onClickApproved}
                      >
                        <>Approve</>
                      </Confirm>
                      <Confirm
                        id={comment.id}
                        title="Deny Report?"
                        description={`Denied - ${comment.report.report.rule}`}
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
            {props.comments.links &&
              props.comments.links?.length > 3 &&
              props.comments.links.map((link) => {
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
          {!!!props.comments_count && (
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
CommentsReports.layout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default CommentsReports;
