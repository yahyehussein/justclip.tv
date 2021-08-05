import "moment-duration-format";

import React, { useEffect, useState } from "react";

import type { Clip } from "../types/clip";
import Grid from "@shared/grid";
import { Inertia } from "@inertiajs/inertia";
import { InertiaLink } from "@inertiajs/inertia-react";
import InfiniteScroll from "react-infinite-scroll-component";
import Layout from "@shared/layout";
import type { Pagination } from "../types/pagination";
import Site from "@shared/site";
import Tippy from "@tippyjs/react";
import type { User } from "../types/user";
import axios from "axios";
import { isGlobalModerator } from "../utils";
import moment from "moment";

const Search = ({
  asset_url,
  q,
  clipper,
  clip,
  type,
}: {
  asset_url: string;
  q: string;
  clipper?: Pagination<User>;
  clip?: Pagination<Clip>;
  type?: string;
}): JSX.Element => {
  const [clippers, setClippers] = useState(clipper);
  const [clips, setClips] = useState(clip);

  const getMoreResults = () => {
    switch (type) {
      case "clippers":
        axios.get(`${clippers?.next_page_url}`).then(({ data }) => {
          if (clippers) {
            setClippers({ ...data, data: [...clippers.data, ...data.data] });
          }
        });
        break;
      case "clips":
        axios.get(`${clips?.next_page_url}`).then(({ data }) => {
          if (clips) {
            setClips({ ...data, data: [...clips.data, ...data.data] });
          }
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setClippers(clipper);
  }, [clipper]);

  useEffect(() => {
    setClips(clip);
  }, [clip]);

  return (
    <>
      <Site title={q}></Site>
      <Grid fluid>
        <div className="lg:px-0 px-2">
          {clippers?.from && (
            <>
              <InfiniteScroll
                dataLength={clippers.to}
                next={getMoreResults}
                hasMore={!!type && !!clippers.next_page_url}
                loader={"loading..."}
              >
                {clippers.data.map((user) => {
                  return (
                    <div key={user.id} className="mb-3 flex items-center">
                      <InertiaLink
                        href={`/${user.login}`}
                        className="my-3 block"
                      >
                        <img
                          src={user.avatar}
                          alt="avatar"
                          width="164"
                          height="164"
                          className="lg:mx-6 mr-3 lg:w-[164px] lg:h-[164px] w-[70px] h-[70px] ring-2 ring-primary"
                          onError={(e) => {
                            e.currentTarget.src = `${
                              asset_url ? asset_url : ""
                            }/images/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-70x70.png`;
                          }}
                        />
                      </InertiaLink>
                      <div className="flex flex-col flex-1">
                        <div>
                          <InertiaLink
                            href={`/${user.login}`}
                            className="lg:text-4xl text-2xl text-primary break-all hover:underline inline-block align-middle mr-2"
                          >
                            {user.display_name}
                          </InertiaLink>
                          {user.roles?.map((role, index) => {
                            if (isGlobalModerator(role)) {
                              return (
                                <Tippy key={index} content="Global Moderator">
                                  <img
                                    src="/images/global_mod_2.png"
                                    sizes="(max-width: 540px) and (orientation: portrait) 18px,18px (max-width: 540px) and (orientation: portrait) 30px,30px"
                                    srcSet="/images/global_mod_2.png 30w,/images/global_mod.png 18w"
                                    alt="global_mod"
                                    className="inline-block align-middle mt-2"
                                  />
                                </Tippy>
                              );
                            }
                          })}
                        </div>
                        {user.about ? (
                          <p className="lg:text-base text-sm">{user.about}</p>
                        ) : (
                          <p className="lg:text-base text-sm">
                            We don&apos;t know much about them, but we&apos;re
                            sure {user.display_name} is great.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </InfiniteScroll>
              {clippers.next_page_url && (
                <div className="flex items-center">
                  <hr className="w-full" />
                  <button className="mx-3 hover:bg-secondary flex-shrink-0 rounded-md text-sm p-2">
                    Show more clippers{" "}
                    <i className="fas fa-chevron-down fa-sm"></i>
                  </button>
                  <hr className="w-full" />
                </div>
              )}
            </>
          )}

          {clips?.from && (
            <>
              {type && (
                <div className="border-b pb-4 mb-4 text-xl font-bold">
                  <span className="text-sm">
                    Clips &bull;{" "}
                    <InertiaLink
                      href={`/search?q=${q}`}
                      className="text-primary hover:underline"
                    >
                      Back to all results
                    </InertiaLink>{" "}
                  </span>
                </div>
              )}
              <InfiniteScroll
                dataLength={clips.to}
                next={getMoreResults}
                hasMore={!!type && !!clips.next_page_url}
                loader={"loading..."}
              >
                {clips.data.map((clip) => {
                  return (
                    <InertiaLink
                      href={`/clip/${clip.slug}`}
                      key={clip.id}
                      className="mb-3 flex items-center"
                    >
                      <div className="relative lg:mx-6 mr-3 lg:flex-initial flex-1">
                        <img
                          src={clip.thumbnail}
                          alt="thumbnail"
                          className="lg:max-w-none max-w-full"
                          width="360"
                          onError={(e) => {
                            e.currentTarget.src = `${
                              asset_url ? asset_url : ""
                            }/images/clip_deleted.png`;
                          }}
                        />
                        <div className="bg-black bg-opacity-70 absolute bottom-0 right-0 mb-2 mr-2 rounded-md text-sm px-1">
                          {moment.duration(clip.duration, "seconds").format()}
                        </div>
                      </div>
                      <div className="flex flex-col lg:flex-initial flex-1">
                        <p className="text-xs text-muted">
                          Cliped by{" "}
                          {clip.user ? clip.user.display_name : "[DELETED]"}
                        </p>
                        <p className="font-bold lg:text-lg text-base">
                          {clip.title}
                        </p>
                        <p className="lg:text-base text-sm">
                          {clip.broadcaster.display_name}
                        </p>
                        <p className="mb-2 lg:text-base text-sm">
                          {moment(clip.created_at).fromNow()}
                        </p>
                        <div className="bg-primary px-2 py-1 rounded-full text-xs font-semibold self-start">
                          {clip.category?.name}
                        </div>
                      </div>
                    </InertiaLink>
                  );
                })}
              </InfiniteScroll>
              {!!!type && clips.next_page_url && (
                <div className="flex items-center">
                  <hr className="w-full" />
                  <button
                    className="mx-3 hover:bg-secondary flex-shrink-0 rounded-md text-sm p-2 focus:outline-none"
                    onClick={() => {
                      Inertia.get(`?q=${q}&type=clips`);
                    }}
                  >
                    Show more clips{" "}
                    <i className="fas fa-chevron-down fa-sm"></i>
                  </button>
                  <hr className="w-full" />
                </div>
              )}
            </>
          )}
          {!clippers?.from && !clips?.from && (
            <div className="flex items-center justify-center flex-col">
              <img
                src={`${asset_url ? asset_url : ""}/images/dark-logo.png`}
                alt="logo"
                width="200"
              />
              <p className="text-3xl font-bold">No results found for {q}</p>
              <p>
                Make sure all words are spelled correctly or try different
                keywords.
              </p>
            </div>
          )}
        </div>
      </Grid>
    </>
  );
};

/* eslint-disable react/display-name */
Search.layout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default Search;
