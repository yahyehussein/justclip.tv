import { InertiaLink, useRemember } from "@inertiajs/inertia-react";
import React, { useEffect, useState } from "react";

import Ad from "@shared/ad";
import Clip from "@shared/clip";
import ClipPlaceholder from "@shared/placeholder/clip";
import ClipSkeleton from "@shared/skeleton/clip";
import type { Clip as ClipType } from "../types/clip";
import Footer from "@shared/footer";
import Grid from "@shared/grid";
import { Inertia } from "@inertiajs/inertia";
import InfiniteScroll from "react-infinite-scroll-component";
import Layout from "@shared/layout";
import type { Leaderboard } from "../types/leaderboard";
import LeaderboardSkeleton from "@shared/skeleton/leaderboard";
import type { Pagination } from "../types/pagination";
import Site from "@shared/site";
import SortClips from "@shared/sort-clips";
import TopClippers from "@shared/top-clippers";
import type { User } from "../types/user";
import axios from "axios";
import { isMobile } from "../utils";
import route from "ziggy-js";

const Home = ({
  asset_url,
  auth,
}: {
  asset_url: string;
  auth: User;
}): JSX.Element => {
  const feedPage = () => {
    if (auth) {
      if (route().current() === "home") {
        return "&feed=home";
      } else if (route().current() === "popular") {
        return "&feed=popular";
      }
    }

    return "&feed=popular";
  };

  const [sortBy, setSortBy] = useRemember("&hot=true", "sort");
  const [feed, setFeed] = useRemember(feedPage(), "feed");
  const [clips, setClips] = useRemember<Pagination<ClipType>>(
    {
      data: [],
      next_page_url: `/json/clip?page=1${sortBy}${feed}`,
      to: 10,
    },
    "clips"
  );
  const [empty, setEmpty] = useRemember(false, "empty");
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>();

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
      next_page_url: `/json/clip?page=1${sortBy}${feed}`,
      to: 10,
    });
    axios.get(`/json/clip?page=1${sortBy}${feed}`).then(({ data }) => {
      setClips(data);
      setEmpty(!!!data.from);
    });
  };

  useEffect(() => {
    getClips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isMobile) {
      axios.get("/json/leaderboard?limit=5").then(({ data }) => {
        setLeaderboard(data.data);
      });
    }
  }, []);

  return (
    <>
      <Site></Site>
      <Grid>
        <div className="lg:col-span-2 sm:col-span-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              {auth && (
                <>
                  <InertiaLink
                    href="/"
                    className={`px-3 py-1 rounded-full mr-1 hover:bg-opacity-80 font-semibold focus:outline-none lg:ml-0 ml-2 ${
                      feed === "&feed=home"
                        ? "text-white-light bg-primary"
                        : "bg-secondary"
                    }`}
                  >
                    Home
                  </InertiaLink>
                  <InertiaLink
                    href="/popular"
                    className={`px-3 py-1 rounded-full mr-1 hover:bg-opacity-80 font-semibold focus:outline-none ${
                      feed === "&feed=popular"
                        ? "text-white-light bg-primary"
                        : "bg-secondary"
                    }`}
                  >
                    Popular
                  </InertiaLink>
                </>
              )}
            </div>
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
            {clips.data.map((clip) => {
              return (
                <Clip
                  key={clip.id}
                  asset_url={asset_url}
                  clip={clip}
                  auth={auth}
                ></Clip>
              );
            })}
          </InfiniteScroll>
          {empty && feed === "&feed=home" && (
            <div className="relative">
              <ClipPlaceholder></ClipPlaceholder>
              <ClipPlaceholder></ClipPlaceholder>
              <div className="absolute w-full h-full bg-dark bg-opacity-70 flex items-center justify-center top-0 px-16 flex-col rounded-md">
                <i className="fas fa-search text-8xl"></i>
                <p className="lg:text-xl text-center mb-2">
                  Justclip gets better when you follow your favourite
                  broadcaster, so find some clips!
                </p>
                <InertiaLink
                  href="/popular"
                  className="bg-primary text-white-light font-semibold w-full rounded-md p-2 bg-opacity-80 focus:outline-none text-center"
                >
                  Browse Popular Clips
                </InertiaLink>
              </div>
            </div>
          )}
          {empty && feed === "&feed=popular" && (
            <div className="relative">
              <ClipPlaceholder></ClipPlaceholder>
              <ClipPlaceholder></ClipPlaceholder>
              <div className="absolute w-full h-full bg-dark bg-opacity-70 flex items-center justify-center top-0 px-16 flex-col">
                <p className="text-2xl text-center mb-2">There are no clips</p>
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
        <div>
          {leaderboard ? (
            !!leaderboard.length && (
              <TopClippers
                asset_url={asset_url}
                leaderboard={leaderboard}
                className="lg:block hidden"
              ></TopClippers>
            )
          ) : (
            <LeaderboardSkeleton className="lg:block hidden"></LeaderboardSkeleton>
          )}

          {/* <div
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            align="center"
            className="bg-dark lg:rounded-md lg:p-3 lg:border mb-3"
          >
            <Ad dataAdSlot="8252889064" dataAdFormat="rectangle"></Ad>
          </div> */}
          {feed === "&feed=home" && (
            <div className="lg:block hidden">
              <div className="bg-dark lg:rounded-t-md border-t border-b lg:border-r lg:border-l p-3">
                <p className="border-b-2 pb-1 font-semibold mb-2 text-lg">
                  Home
                </p>
                <p>
                  Your personal Justclip frontpage. Come here to check in with
                  your favourite broadcasters.
                </p>
              </div>
              <div className="p-2 border-b lg:border-l lg:border-r bg-dark mb-3">
                <InertiaLink
                  href="/upload"
                  className="p-3 bg-primary text-white-light text-lg text-center rounded-md font-semibold hover:bg-opacity-80 focus:outline-none uppercase block"
                >
                  Upload Clip
                </InertiaLink>
              </div>
            </div>
          )}
          {feed === "&feed=popular" && (
            <div className="lg:block hidden">
              <div className="bg-dark lg:rounded-t-md border-t border-b lg:border-r lg:border-l p-3">
                <p className="border-b-2 pb-1 font-semibold mb-2 text-lg">
                  Popular
                </p>
                <p>
                  The best clips on Justclip for you, pulled from the most
                  active broadcasters on Justclip. Check here to see the most
                  shared, upvoted, and commented content about Twitch.
                </p>
              </div>
              <div className="p-2 border-b border-l border-r bg-dark mb-3">
                <InertiaLink
                  href="/upload"
                  className="p-3 bg-primary text-white-light text-lg text-center rounded-md font-semibold hover:bg-opacity-80 focus:outline-none uppercase block"
                >
                  Upload Clip
                </InertiaLink>
              </div>
            </div>
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
Home.layout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default Home;
