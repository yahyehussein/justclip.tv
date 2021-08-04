import React, { useEffect, useState } from "react";

import Confirm from "@shared/confirm";
import Grid from "@shared/grid";
import { Inertia } from "@inertiajs/inertia";
import { InertiaLink } from "@inertiajs/inertia-react";
import Layout from "@shared/layout";
import type { Pagination } from "../../types/pagination";
import Site from "@shared/site";
import type { User } from "../../types/user";

const UsersReports = (props: {
  asset_url: string;
  users: Pagination<User>;
  clips_count: number;
  clip_bullet_chats_count: number;
  comments_count: number;
  users_count: number;
}): JSX.Element => {
  const [users, setUsers] = useState<Pagination<User>>(props.users);

  const onClickApproved = (id: number, confirm: boolean) => {
    if (confirm) {
      Inertia.delete(`/reports/${id}?approved=1&type=user`);
    }
  };

  const onClickDenied = (id: number, confirm: boolean) => {
    if (confirm) {
      Inertia.delete(`/reports/${id}?approved=0&type=user`);
    }
  };

  useEffect(() => {
    setUsers(props.users);
  }, [props.users]);

  return (
    <>
      <Site title="Users Reports"></Site>
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
            className="p-3 flex-1 border-r uppercase hover:bg-secondary focus:outline-none text-center"
          >
            <span className="inline-block align-middle mr-2">Comments</span>
            <span className="bg-primary rounded-md text-xs font-semibold inline-block align-middle text-white-light px-2 py-1">
              {props.comments_count}
            </span>
          </InertiaLink>
          <InertiaLink
            href="/users/reports"
            className="p-3 flex-1 uppercase bg-secondary focus:outline-none text-center"
          >
            <span className="inline-block align-middle mr-2">Users</span>
            <span className="bg-primary rounded-md text-xs font-semibold inline-block align-middle text-white-light px-2 py-1">
              {props.users_count}
            </span>
          </InertiaLink>
        </div>
        <>
          {users?.data?.map((user) => {
            return (
              <div key={user.id} className="mb-2">
                <InertiaLink
                  href={`/${user.login}`}
                  className="flex justify-between items-center border px-4 py-4 group hover:border-muted"
                >
                  <div className="flex flex-col">
                    <p className="text-sm text-muted uppercase">
                      {user.report && user.report.report.type} |{" "}
                      <span className="text-red-persimmon font-bold">
                        {user.report_count}{" "}
                        {user.report_count && user.report_count > 1
                          ? "reports"
                          : "report"}
                      </span>
                    </p>
                    <p className="font-bold text-xl text-primary group-hover:underline leading-4">
                      {user.display_name}
                    </p>
                    <p>{user.about}</p>
                  </div>
                  <img
                    src={user.avatar}
                    alt="avatar"
                    width="164"
                    height="164"
                    onError={(e) => {
                      e.currentTarget.src = `${
                        props.asset_url ? props.asset_url : ""
                      }/images/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-70x70.png`;
                    }}
                  />
                </InertiaLink>

                {user.report && (
                  <>
                    <div className="border-r border-b border-l">
                      <div className="p-4">
                        <p className="text-2xl mb-2 underline uppercase text-red-persimmon">
                          {user.report.report.rule}
                        </p>
                      </div>
                    </div>
                    <div className="flex p-2 border-r border-b border-l space-x-2">
                      <Confirm
                        id={user.id}
                        title="Approve Report?"
                        description={`Removed - ${user.report.report.rule}`}
                        className="rounded-sm p-2 focus:outline-none bg-secondary hover:bg-opacity-80 flex-1 border uppercase"
                        onConfirmed={onClickApproved}
                      >
                        <>Approve</>
                      </Confirm>
                      <Confirm
                        id={user.id}
                        title="Deny Report?"
                        description={`Denied - ${user.report.report.rule}`}
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
            {props.users.links &&
              props.users.links?.length > 3 &&
              props.users.links.map((link) => {
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
          {!!!props.users_count && (
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
UsersReports.layout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default UsersReports;
