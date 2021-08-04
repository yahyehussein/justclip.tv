import React, { useEffect, useState } from "react";

import Clip from "@shared/clip";
import ClipPlaceholder from "@shared/placeholder/clip";
import ClipSkeleton from "@shared/skeleton/clip";
import { Clip as ClipType } from "../types/clip";
import Footer from "@shared/footer";
import Grid from "@shared/grid";
import { Inertia } from "@inertiajs/inertia";
import InfiniteScroll from "react-infinite-scroll-component";
import Layout from "@shared/layout";
import { Leaderboard } from "../types/leaderboard";
import LeaderboardSkeleton from "@shared/skeleton/leaderboard";
import { Pagination } from "../types/pagination";
import Site from "@shared/site";
import SortClips from "@shared/sort-clips";
import Tippy from "@tippyjs/react";
import TopClippers from "@shared/top-clippers";
import { User } from "../types/user";
import axios from "axios";
import numeral from "numeral";
import { useRemember } from "@inertiajs/inertia-react";

const Broadcaster = (props: {
  asset_url: string;
  broadcaster: User;
  auth?: User;
  following?: boolean;
}): JSX.Element => {
  const [sortBy, setSortBy] = useRemember("&hot=true", "sort");
  const [clips, setClips] = useRemember<Pagination<ClipType>>(
    {
      data: [],
      next_page_url: `/json/clip?page=1&broadcaster_id=${props.broadcaster.id}${sortBy}`,
      to: 10,
    },
    "clips"
  );
  const [empty, setEmpty] = useRemember(false, "empty");
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>();
  const [following, setFollowing] = useRemember(props.following, "following");
  const [blocked, setBlocked] = useRemember(
    props.auth?.blocked_broadcasters?.includes(props.broadcaster.id),
    "blocked"
  );

  const getClips = () => {
    if (clips.next_page_url) {
      axios.get(`${clips.next_page_url}`).then(({ data }) => {
        setClips({ ...data, data: [...clips.data, ...data.data] });
        setEmpty(!!!data.from);
      });
    }
  };

  const onSort = (sortBy: string) => {
    setSortBy(sortBy);
    setClips({
      data: [],
      next_page_url: `/json/clip?page=1&broadcaster_id=${props.broadcaster.id}${sortBy}`,
      to: 10,
    });
    axios
      .get(`/json/clip?page=1&broadcaster_id=${props.broadcaster.id}${sortBy}`)
      .then(({ data }) => {
        setClips(data);
        setEmpty(!!!data.from);
      });
  };

  useEffect(() => {
    getClips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    axios
      .get(`/json/leaderboard?limit=5&broadcaster_id=${props.broadcaster.id}`)
      .then(({ data }) => {
        setLeaderboard(data.data);
      });
  }, [props.broadcaster.id]);

  return (
    <>
      <Site title={`${props.broadcaster.login}'s Clips`}></Site>
      <Grid>
        <>
          {props.broadcaster.subscriptions && props.broadcaster.type && (
            <div className="row-start-1 col-span-3 aspect-w-16 aspect-h-9 mb-3 lg:block hidden">
              <iframe
                src={`https://player.twitch.tv/?channel=${props.broadcaster.login}&parent=justclip.tv&parent=localhost`}
                allowFullScreen={false}
              ></iframe>
            </div>
          )}
        </>
        <div
          className={`lg:col-span-2 col-span-3 ${
            props.broadcaster.type ? "lg:row-start-2 row-start-3" : ""
          }`}
        >
          <div className="flex justify-end mb-2">
            <SortClips onSort={onSort}></SortClips>
          </div>
          <InfiniteScroll
            dataLength={clips.to}
            next={getClips}
            hasMore={!!clips.next_page_url}
            loader={
              <>
                <ClipSkeleton></ClipSkeleton>
                <ClipSkeleton></ClipSkeleton>
              </>
            }
          >
            {clips?.data.map((clip) => {
              return (
                <Clip
                  key={clip.id}
                  asset_url={props.asset_url}
                  clip={clip}
                  auth={props.auth}
                ></Clip>
              );
            })}
          </InfiniteScroll>
          {empty && (
            <div className="relative">
              <ClipPlaceholder></ClipPlaceholder>
              <ClipPlaceholder></ClipPlaceholder>
              <div className="absolute w-full h-full bg-dark bg-opacity-70 flex items-center justify-center top-0 px-16 flex-col rounded-md">
                <p className="text-2xl text-center mb-2">
                  There are no clips for {props.broadcaster.display_name}
                </p>
                <p className="text-center mb-2">
                  Be the first person to upload a clip
                </p>
                <button
                  className="bg-primary text-white-light font-semibold w-full rounded-md p-2 bg-opacity-80 focus:outline-none"
                  onClick={() => Inertia.visit("/upload")}
                >
                  Upload Clip
                </button>
              </div>
            </div>
          )}
        </div>
        <div
          className={`lg:col-start-3 lg:col-span-1 col-span-2 ${
            props.broadcaster.type ? "row-start-2" : "row-start-1"
          }`}
        >
          <a
            href={`https://www.twitch.tv/${props.broadcaster.login}`}
            className="bg-dark lg:rounded-t-md border-t border-b lg:border-r lg:border-l hover:border-muted block"
            target="_blank"
            rel="noreferrer"
          >
            {props.broadcaster.banner && (
              <img
                alt="Profile banner for sodapoppin"
                className="object-cover h-32 w-full rounded-t-md"
                sizes="100vw"
                srcSet={`${props.broadcaster.banner?.replace(
                  /{width}x{height}/g,
                  "320x160"
                )} 320w,${props.broadcaster.banner?.replace(
                  /{width}x{height}/g,
                  "640x320"
                )} 640w,${props.broadcaster.banner?.replace(
                  /{width}x{height}/g,
                  "960x480"
                )} 960w,${props.broadcaster.banner?.replace(
                  /{width}x{height}/g,
                  "1280x640"
                )} 1280w`}
                src={`${props.broadcaster.banner?.replace(
                  /{width}x{height}/g,
                  "320x160"
                )}`}
              />
            )}
            <div
              className={`flex space-x-3 px-2 pt-2 pb-3 ${
                props.broadcaster.banner ? "-mt-5" : ""
              }`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={props.broadcaster.avatar.replace(/\d+x\d+/g, "70x70")}
                  alt="avatar"
                  className="ring-2 ring-twitch bg-dark"
                  width="70"
                  height="70"
                  onError={(e) => {
                    e.currentTarget.src = `${
                      props.asset_url ? props.asset_url : ""
                    }/images/de130ab0-def7-11e9-b668-784f43822e80-profile_image-70x70.png`;
                  }}
                />
                {props.broadcaster.subscriptions &&
                  (props.broadcaster.type ? (
                    <span className="bg-red-600 rounded-full w-10 align-middle font-semibold text-center text-xs uppercase text-white-light absolute inset-middle">
                      Live
                    </span>
                  ) : (
                    <span className="bg-gray rounded-full w-16 align-middle font-semibold text-center text-xs uppercase absolute inset-middle">
                      Offline
                    </span>
                  ))}
              </div>
              <div
                className={`flex flex-col ${
                  props.broadcaster.banner ? "mt-3" : ""
                }`}
              >
                <p className="text-2xl font-bold break-all">
                  {props.broadcaster.display_name}
                </p>
                {props.broadcaster.subscriptions &&
                  props.broadcaster.type &&
                  props.broadcaster.category && (
                    <p className="text-sm text-twitch">
                      Streaming{" "}
                      <span className="font-bold">
                        {props.broadcaster.category}
                      </span>
                    </p>
                  )}
                {props.broadcaster.about ? (
                  <p className="text-sm break-words">
                    {props.broadcaster.about}
                  </p>
                ) : (
                  <p className="text-sm break-words">
                    We don&apos;t know much about them, but we&apos;re sure{" "}
                    {props.broadcaster.display_name} is great.
                  </p>
                )}
                <div className="flex mt-2 border-t pt-2 border-dashed">
                  <div className="flex-1">
                    <p>
                      {numeral(props.broadcaster.followers_count).format(
                        "0.[0]a"
                      )}
                    </p>
                    <p className="text-sm">Followers</p>
                  </div>
                  {props.broadcaster.partner && (
                    <div className="flex-1">
                      <img
                        src={`${
                          props.asset_url ? props.asset_url : ""
                        }/images/partner.png`}
                        alt="partner"
                        className="my-[3px]"
                      />
                      <p className="text-sm">Partner</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </a>
          <div className="border-b lg:border-l lg:border-r p-2 bg-dark mb-3 flex space-x-2">
            <Tippy content={`${blocked ? "Blocked" : "Block"}`}>
              {blocked ? (
                <button
                  className="p-3 text-lg text-center rounded-md font-semibold hover:bg-opacity-80 focus:outline-none border border-primary uppercase"
                  onClick={() => {
                    setBlocked(false);
                    axios
                      .patch(`/unblock/${props.broadcaster.id}/broadcaster`)
                      .catch(() => {
                        setBlocked(false);
                      });
                  }}
                >
                  <i className="fas fa-user-slash fa-fw"></i>
                </button>
              ) : (
                <button
                  className={`p-3 bg-secondary text-lg text-center rounded-md font-semibold hover:bg-opacity-80 focus:outline-none uppercase ${
                    props.auth?.id === props.broadcaster.id
                      ? "cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => {
                    setBlocked(true);
                    axios
                      .patch(`/block/${props.broadcaster.id}/broadcaster`)
                      .catch(() => {
                        setBlocked(false);
                      });
                  }}
                  disabled={props.auth?.id === props.broadcaster.id}
                >
                  <i className="fas fa-ban fa-fw"></i>
                </button>
              )}
            </Tippy>
            {following ? (
              <button
                className="p-3 text-lg text-center rounded-md font-semibold hover:bg-opacity-80 focus:outline-none border border-primary uppercase flex-grow"
                onClick={() => {
                  setFollowing(false);
                  axios.patch(`/unfollow/${props.broadcaster.id}`).catch(() => {
                    setFollowing(false);
                  });
                }}
              >
                <i className="far fa-heart"></i> Following
              </button>
            ) : (
              <button
                className={`p-3 bg-primary text-white-light text-lg text-center rounded-md font-semibold hover:bg-opacity-80 focus:outline-none uppercase flex-grow ${
                  props.auth?.id === props.broadcaster.id
                    ? "cursor-not-allowed"
                    : ""
                }`}
                onClick={() => {
                  setFollowing(true);
                  axios.patch(`/follow/${props.broadcaster.id}`).catch(() => {
                    setFollowing(false);
                  });
                }}
                disabled={props.auth?.id === props.broadcaster.id}
              >
                <i className="fas fa-heart"></i> Follow
              </button>
            )}
          </div>
          {leaderboard ? (
            !!leaderboard.length && (
              <TopClippers
                asset_url={props.asset_url}
                leaderboard={leaderboard}
                top={props.broadcaster.display_name}
                broadcaster_id={props.broadcaster.id}
              ></TopClippers>
            )
          ) : (
            <LeaderboardSkeleton></LeaderboardSkeleton>
          )}
          <div className="lg:sticky lg:top-3">
            <Footer></Footer>
          </div>
        </div>
      </Grid>
    </>
  );
};

/* eslint-disable react/display-name */
Broadcaster.layout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default Broadcaster;
