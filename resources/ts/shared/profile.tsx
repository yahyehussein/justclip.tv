import { isAdminister, isGlobalModerator } from "../utils";

import Footer from "@shared/footer";
import Grid from "@shared/grid";
import { InertiaLink } from "@inertiajs/inertia-react";
import React from "react";
import Report from "../shared/report";
import Tippy from "@tippyjs/react";
import type { User } from "../types/user";
import numeral from "numeral";
import route from "ziggy-js";

const Profile = ({
  asset_url,
  auth,
  user,
  children,
}: {
  asset_url: string;
  auth?: User;
  user: User;
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  const isAdmin = user.roles?.find((role) => isAdminister(role));
  const isGlobalMod = user.roles?.find((role) => isGlobalModerator(role));

  return (
    <>
      <Grid>
        <div className="lg:col-span-2 sm:col-span-3">
          <div className="lg:flex items-center rounded-md border bg-dark p-5 relative hidden">
            <img
              src={user.avatar}
              alt="avatar"
              width="164"
              height="164"
              className="ring-2 ring-primary mr-4"
              onError={(e) => {
                e.currentTarget.src = `${
                  asset_url ? asset_url : ""
                }/images/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-70x70.png`;
              }}
            />
            <div className="pr-4">
              {isAdmin && (
                <p className="bg-secondary px-2 py-1 rounded-full text-xs font-semibold inline-block mr-1 text-red-persimmon uppercase">
                  Admin
                </p>
              )}
              {isGlobalMod && (
                <p className="bg-secondary px-2 py-1 rounded-full text-xs font-semibold inline-block text-primary uppercase">
                  Global Mod
                </p>
              )}
              <p
                className="text-4xl text-primary break-all mb-1"
                style={{ textShadow: "1px 1px 4px #000" }}
              >
                {user.display_name}
              </p>
              {user.about ? (
                <p>{user.about}</p>
              ) : (
                <p>
                  We don&apos;t know much about them, but we&apos;re sure{" "}
                  {user.display_name} is great.
                </p>
              )}
            </div>
            <div className="absolute top-2 right-3">
              {!isAdmin && !isGlobalMod && auth?.id !== user.id && (
                <Report
                  type="user"
                  user={user}
                  auth={auth}
                  className="font-semibold hover:text-primary text-lg focus:outline-none"
                >
                  <Tippy content="Report">
                    <i className="far fa-flag"></i>
                  </Tippy>
                </Report>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between lg:hidden">
            <img
              src={user.avatar}
              alt="avatar"
              width="90"
              height="90"
              className="ml-4 ring-2 ring-primary"
              onError={(e) => {
                e.currentTarget.src = `${
                  asset_url ? asset_url : ""
                }/images/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-70x70.png`;
              }}
            />
          </div>
          <div className="pl-4 pt-2 lg:hidden block mb-2">
            {isAdmin && (
              <p className="bg-red-persimmon px-2 py-1 rounded-full text-xs font-semibold inline-block mr-1 text-black">
                Admin
              </p>
            )}
            {isGlobalMod && (
              <p className="bg-secondary px-2 py-1 rounded-full text-xs font-semibold inline-block">
                Global Mod
              </p>
            )}
            <p
              className="text-2xl text-primary break-all align-middle mr-2"
              style={{ textShadow: "1px 1px 4px #000" }}
            >
              {user.display_name}
            </p>
            {user.about ? (
              <p>{user.about}</p>
            ) : (
              <p>
                We don&apos;t know much about them, but we&apos;re sure{" "}
                {user.display_name} is great.
              </p>
            )}
            <span className="text-sm mr-3">
              {user.clip_upvotes_count - user.clip_downvotes_count}{" "}
              <span className="text-muted">Clip Votes</span>{" "}
            </span>
            <span className="text-sm">
              {user.comment_upvotes_count - user.comment_downvotes_count}{" "}
              <span className="text-muted">Comment Votes</span>{" "}
            </span>
          </div>
          <div className="bg-dark border-t border-b flex lg:hidden overflow-auto">
            <InertiaLink
              href={`/${user.login}`}
              className={`flex items-center px-3 py-2 border-r flex-shrink-0 ${
                route().current() === "clips" ? "text-primary" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 20 20"
                x="0px"
                y="0px"
                className={`fill-current group-hover:text-primary inline-block align-middle ${
                  route().current() === "clips" ? "text-primary" : ""
                }`}
              >
                <g>
                  <path d="M14.594 4.495l-.585-1.91L15.922 2l.585 1.91-1.913.585zM11.14 3.46l.585 1.911 1.913-.584-.585-1.91-1.913.583zM8.856 6.247l-.584-1.91 1.912-.584.585 1.91-1.913.584zM5.403 5.213l.584 1.91L7.9 6.54l-.585-1.911-1.912.584zM2.534 6.09L3.118 8l1.913-.584-.585-1.91-1.912.583zM5 9H3v7a2 2 0 002 2h10a2 2 0 002-2V9h-2v7H5V9z"></path>
                  <path d="M8 9H6v2h2V9zM9 9h2v2H9V9zM14 9h-2v2h2V9z"></path>
                </g>
              </svg>{" "}
              Clips
            </InertiaLink>
            <InertiaLink
              href={`/${user.login}/comments`}
              className={`px-3 py-2 border-r flex-shrink-0 ${
                route().current() === "comments" ? "text-primary" : ""
              }`}
            >
              <i className="fas fa-comment-alt"></i> Comments
            </InertiaLink>
            <InertiaLink
              href={`/${user.login}/following`}
              className={`px-3 py-2 border-r flex-shrink-0 ${
                route().current() === "following" ? "text-primary" : ""
              }`}
            >
              <i className="fas fa-user-circle"></i> Following
            </InertiaLink>
            {auth?.id === user.id && (
              <>
                <InertiaLink
                  href={`/${user.login}/upvotes`}
                  className={`px-3 py-2 border-r flex-shrink-0 ${
                    route().current() === "upvotes" ? "text-primary" : ""
                  }`}
                >
                  <i className="fas fa-arrow-up"></i> Upvotes
                </InertiaLink>
                <InertiaLink
                  href={`/${user.login}/downvotes`}
                  className={`px-3 py-2 flex-shrink-0 ${
                    route().current() === "downvotes" ? "text-primary" : ""
                  }`}
                >
                  <i className="fas fa-arrow-down"></i> Downvotes
                </InertiaLink>
              </>
            )}
          </div>
          {children}
        </div>
        <div className="lg:block hidden">
          <div className="bg-dark mb-3 rounded-md p-3 text-sm border">
            <p className="text-4xl mb-2 pb-2 border-b">
              {numeral(
                user.clip_upvotes_count -
                  user.clip_downvotes_count +
                  (user.comment_upvotes_count - user.comment_downvotes_count)
              ).format("0,0")}
            </p>

            <div className="flex">
              <div className="space-y-1 flex-1">
                <p className="font-semibold">Clip Votes</p>
                <p className="text-muted">
                  {numeral(
                    user.clip_upvotes_count - user.clip_downvotes_count
                  ).format("0,0")}
                </p>
              </div>
              <div className="space-y-1 flex-1">
                <p className="font-semibold">Comment Votes</p>
                <p className="text-muted">
                  {numeral(
                    user.comment_upvotes_count - user.comment_downvotes_count
                  ).format("0,0")}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-dark mb-3 rounded-md p-3 text-sm border">
            <ul className="space-y-2">
              <li>
                <InertiaLink
                  href={`/${user.login}`}
                  className={`group hover:text-primary text-lg ${
                    route().current() === "clips" ? "text-primary" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    viewBox="0 0 20 20"
                    x="0px"
                    y="0px"
                    className="fill-current group-hover:text-primary text-white inline-block align-middle fa-fw"
                  >
                    <g>
                      <path d="M14.594 4.495l-.585-1.91L15.922 2l.585 1.91-1.913.585zM11.14 3.46l.585 1.911 1.913-.584-.585-1.91-1.913.583zM8.856 6.247l-.584-1.91 1.912-.584.585 1.91-1.913.584zM5.403 5.213l.584 1.91L7.9 6.54l-.585-1.911-1.912.584zM2.534 6.09L3.118 8l1.913-.584-.585-1.91-1.912.583zM5 9H3v7a2 2 0 002 2h10a2 2 0 002-2V9h-2v7H5V9z"></path>
                      <path d="M8 9H6v2h2V9zM9 9h2v2H9V9zM14 9h-2v2h2V9z"></path>
                    </g>
                  </svg>{" "}
                  <span className="inline-block align-middle">Clips</span>
                </InertiaLink>
              </li>
              <li>
                <InertiaLink
                  href={`/${user.login}/comments`}
                  className={`hover:text-primary text-lg ${
                    route().current() === "comments" ? "text-primary" : ""
                  }`}
                >
                  <i className="fas fa-comment-alt fa-fw"></i> Comments
                </InertiaLink>
              </li>
              <li>
                <InertiaLink
                  href={`/${user.login}/following`}
                  className={`hover:text-primary text-lg ${
                    route().current() === "following" ? "text-primary" : ""
                  }`}
                >
                  <i className="fas fa-user-circle fa-fw"></i> Following
                </InertiaLink>
              </li>
              {auth?.id === user.id && (
                <>
                  <li>
                    <InertiaLink
                      href={`/${user.login}/upvotes`}
                      className={`hover:text-primary text-lg ${
                        route().current() === "upvotes" ? "text-primary" : ""
                      }`}
                    >
                      <i className="fas fa-arrow-up fa-fw"></i> Upvotes
                    </InertiaLink>
                  </li>
                  <li>
                    <InertiaLink
                      href={`/${user.login}/downvotes`}
                      className={`hover:text-primary text-lg ${
                        route().current() === "downvotes" ? "text-primary" : ""
                      }`}
                    >
                      <i className="fas fa-arrow-down fa-fw"></i> Downvotes
                    </InertiaLink>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div className="lg:sticky lg:top-3">
            <Footer ad={false}></Footer>
          </div>
        </div>
      </Grid>
    </>
  );
};

export default Profile;
